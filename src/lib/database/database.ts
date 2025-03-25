// External Imports
import { PrismaClient, User, Student, FacultyMember, UserType, HomeClass, TimeSlot, Course, Event, EventType, Prisma, Announcement } from "@prisma/client";

// Internal Imports
import { createScheduleTimeSlots, createTimeSlot, getTimesOfIndentifier, WeekScheduleIdentifier } from "@/lib/database/timeSlots";
import { CourseTimeSlots, EventTimeSlot } from "./getCalendarData";
import bcrypt from "bcryptjs";
import { isAuthorized } from "../auth";
import { Url } from "next/dist/shared/lib/router/router";

// Initialize Prisma Client
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export { prisma };

// User-related Functions
// ======================

// For authentication
export async function getExpensiveUserByEmail(email: string): Promise<User & { student: Student | null, facultyMember: FacultyMember | null } | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      student: { include: { homeClass: true } }, 
      facultyMember: { include: { homeroomClass: true } },
    },
  });

  console.log("✅ User from DB:", JSON.stringify(user, null, 2));
  return user;
    
  }
// For registration
export async function getCheapUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function postNewUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  userType: UserType,
  profileImage?: string,
): Promise<User | null> {
  return prisma.user.create({
    data: {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      userType: userType,
      student: userType === "STUDENT" ? { create: {} } : undefined,
      facultyMember: userType === "FACULTYMEMBER" ? { create: {} } : undefined,
      profileImage: profileImage,
    },
  });
}

// HomeClass-related Functions
// ===========================

export async function postNewHomeClass(
  teacherId: string,
  startYear: number,
  nameLetter: string
  
): Promise<HomeClass | null> {
  return prisma.homeClass.create({
    data: {
      name: nameLetter,
      startYear: startYear,
      homeroomFacultyMember: {
        connect: {
          id: teacherId,
        },
      },
      announcements: {
        create: [], 
      },
    },
  });
}

export async function getCheapHomeClassById(homeClassId: string): Promise<HomeClass | null> {
  return prisma.homeClass.findUnique({
    where: { id: homeClassId },
  });
}


// Course-related Functions
// ========================

export async function postNewCourse(
  homeClassId: string,
  teacherEmail: string,
  subject: string,
  weekScheduleIds: WeekScheduleIdentifier[],
  color: string
): Promise<Course | null> {
  const teacherId= (await getCheapUserByEmail(teacherEmail))?.id;
  if (!teacherId) {
    throw new Error(`No User found with email: ${teacherEmail}`);
  }
  const facultyMember = await prisma.facultyMember.findUnique({
    where: { id: teacherId },
  });

  if (!facultyMember) {
    throw new Error(`No FacultyMember found with ID: ${teacherId}`);
  }
  const course = await prisma.course.create({
    data: {
      color: color,
      subject: subject,
      facultyMember: {
        connect: {
          id: teacherId
        }
      },
      homeClass: {
        connect: {
          id: homeClassId
        }
      }
    }
  });

  const timeSlotsData = weekScheduleIds.flatMap(id => createScheduleTimeSlots(id, course.id, homeClassId));
  if (!Array.isArray(timeSlotsData) || timeSlotsData.length === 0) {
    throw new Error("Failed to generate valid time slots");
  }
  
  await prisma.timeSlot.createMany({
    data: timeSlotsData
  });

  return course;
}

export async function getUserCourses(userId: string, userType: UserType): Promise<CourseTimeSlots[]> {
  if (userType === "STUDENT") {
    const studentCourses = await prisma.studentCourse.findMany({
      where: { studentId: userId },
      include: { course: {include: {timeSlots: true} } },
    });

    return studentCourses.map(sc => sc.course);
  }

  if (userType === "FACULTYMEMBER") {
    return prisma.course.findMany({
      where: { facultyMemberId: userId },
      include: {timeSlots: true}
    });
  }

  return [];
}

// Event-related Functions
// =======================

export async function getUserEvents(userId: string): Promise<EventTimeSlot[]> {
  const events = await prisma.event.findMany({
    where: {
      users: {
        some: {
          id: userId,
        }
      }
    },
    include: {
      timeSlot: true
    }
  });
  return events;
}

export async function getAllCourseUserIds(eventData: Event) {
  const [courseData, studentCourseData] = await Promise.all([
    prisma.course.findUnique({
      where: { id: eventData.courseId },
      select: {
        facultyMember: {
          select: {
            user: {
              select: {
                id: true
              }
            }
          }
        }
      }
    }),

    prisma.studentCourse.findMany({
      where: { courseId: eventData.courseId },
      select: {
        student: { select: { user: { select: { id: true } } } }
      }
    })
  ]);

  const facultyUserId = courseData?.facultyMember?.user?.id;
  const studentUserIds = studentCourseData.map(sc => sc.student.user.id);
  const userIds = facultyUserId ? [facultyUserId, ...studentUserIds] : studentUserIds;

  return userIds;
}

export async function postEventFloating(dayOfWeek: number, startHour: number, startMinute: number, endHour: number, endMinute: number, eventData: Event): Promise<Event | null> {
  const newTimeSlotId = await prisma.timeSlot.create({
    data: createTimeSlot(eventData.courseId, { dayOfWeek, startHour, startMinute, endHour, endMinute })
  });

  const userIds = await getAllCourseUserIds(eventData);
  return prisma.event.create({
    data: {
      title: eventData.title,
      type: eventData.type,
      weekNumber: eventData.weekNumber,
      yearNumber: eventData.yearNumber,
      course: { connect: { id: eventData.courseId } },
      timeSlot: { connect: { id: newTimeSlotId.id } },
      users: {
        connect: userIds.map(userId => ({ id: userId }))
      }
    }
  }).then(event => event ?? null);
}

export async function postEventTimeSlot(eventData: Event): Promise<Event | null> {
  const userIds = await getAllCourseUserIds(eventData);

  return prisma.event.create({
    data: {
      title: eventData.title,
      type: eventData.type,
      weekNumber: eventData.weekNumber,
      yearNumber: eventData.yearNumber,
      courseId: eventData.courseId,
      timeSlotId: eventData.timeSlotId,
      users: {
        connect: userIds.map(userId => ({ id: userId }))
      }
    }
  }).then(event => event ?? null);
}

// TimeSlot-related Functions
// ==========================

export async function getTimeSlot(timeSlotId: string): Promise<TimeSlot | null> {
  return prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });
}

// HomeClass Search Function
// =========================

export type HomeClassSearchResult = {
  name: string;
  id: string;
};

export async function getHomeClassesByName(name: string): Promise<HomeClassSearchResult[]> {
  return prisma.homeClass.findMany({
    where: { name: { contains: name, mode: "insensitive" } },
    select: { id: true, name: true },
    take: 5,
  });
}


export async function getUserById(userId: string): Promise<Pick<User, "id" | "firstName" | "lastName" | "email" | "userType" | "profileImage"> | null>  {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      userType: true, 
      profileImage: true,
    },
  });
}

export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Database error" };
  }}

  export async function getClasses(): Promise<HomeClass[]> {
    return prisma.homeClass.findMany({
      include: {
        homeroomFacultyMember: {
          select: {
            user: true
          }
        }
      }
    });
  }

  export async function postNewAnnouncement(
    title: string,
    content: string,
    date: string,
    allUsers: boolean,
    homeClassIds?: string[]
  ): Promise<{
    id: string;
    title: string;
    content: string;
    date: Date;
    allUsers: boolean;
    homeClasses: HomeClass[];
  }> {
    if (!allUsers && (!homeClassIds || homeClassIds.length === 0)) {
      throw new Error("Trebuie să selectezi exact o clasă dacă anunțul nu este pentru toți utilizatorii.");
    }
  
    return prisma.announcement.create({
      data: {
        title,
        content,
        date: new Date(date),
        allUsers,
        homeClasses: homeClassIds?.length
          ? { connect: homeClassIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { homeClasses: true },
    });
  }
  
  export async function getAllAnnouncements(userId: string): Promise<
  (Prisma.AnnouncementGetPayload<{ include: { homeClasses: true } }>)[]
> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { userType: true, student: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.userType === UserType.STUDENT && !user.student) {
    throw new Error("Student not found");
  }

  const homeClassId = user.student?.homeClassId;

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { allUsers: true },
        ...(homeClassId
          ? [
              {
                homeClasses: {
                  some: {
                    id: homeClassId,
                  },
                },
              },
            ]
          : []),
      ],
    },
    include: { homeClasses: true },
  });

  return announcements;
}
  export async function getHomeClassDetails(userId: string) {
    // Fetch user and their home class (student or facultyMember)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: { include: { homeClass: true } },
        facultyMember: { include: { homeroomClass: true } },
      },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    // Determine home class (for student or facultyMember)
    const homeClassId =
      user.student?.homeClass?.id || user.facultyMember?.homeroomClass?.id;
  
    if (!homeClassId) {
      throw new Error("User is not assigned to a home class");
    }
  
    // Fetch home class details
    const homeClass = await prisma.homeClass.findUnique({
      where: { id: homeClassId },
      include: {
        homeroomFacultyMember: { include: { user: true } },
        students: { include: { user: true } },
        courses: { include: { facultyMember: { include: { user: true } } } },
      },
    });
  
    if (!homeClass) {
      throw new Error("Home class not found");
    }
  
    return { homeClass };
  }
  export async function getUserProfileImage(userId:string){
    const user=await prisma.user.findFirst({
      where:{id:userId},
    })
    return {profileImg:user?.profileImage}
  }
  export async function ChangeProfilePicture(userId:string,profileImage:string){
    const user = await prisma.user.update({
      where: { id: userId },
     data:{
      profileImage: profileImage
     }
    });

  }
  export async function DeleteProfilePicture(userId:string){
    const user = await prisma.user.update({
      where: { id: userId },
     data:{
      profileImage: null
     }
    });

  }
  export async function getAllUsersEmails(): Promise<string[]> {
    try {
      // Interoghează baza de date pentru a obține email-urile tuturor utilizatorilor
      const users = await prisma.user.findMany({
        select: {
          email: true, // Selectează doar câmpul email
        },
      });
  
      // Returnează un array de email-uri
      return users.map(user => user.email);
    } catch (error) {
      console.error("Error fetching all users' emails:", error);
      throw new Error("Unable to fetch emails.");
    }
  }

 export async function getHomeClassEmails(allUsers: boolean, homeClassIds: string[]): Promise<string[]> {
    let users;
  
    if (allUsers) {
      // Fetch all users if the announcement is for all users
      users = await prisma.user.findMany({
        select: {
          email: true,
        },
      });
    } else {
      // Fetch users belonging to the specified home class IDs
      users = await prisma.user.findMany({
        where: {
          OR: homeClassIds.map((homeClassId) => ({
            student: {
              homeClassId: homeClassId,
            },
          })),
        },
        select: {
          email: true,
        },
      });
    }
  
    // Extract and return just the email addresses
    return users.map((user) => user.email);
  }
 