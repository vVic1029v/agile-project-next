// External Imports
import { PrismaClient, User, Student, FacultyMember, UserType, HomeClass, TimeSlot, Course, Event, EventType, Prisma } from "@prisma/client";

// Internal Imports
import { createScheduleTimeSlots, createTimeSlot, getTimesOfIndentifier, WeekScheduleIdentifier } from "@/lib/database/timeSlots";
import { CourseTimeSlots, EventTimeSlot } from "./getCalendarData";
import bcrypt from "bcryptjs";

// Initialize Prisma Client
export const prisma = new PrismaClient();

// User-related Functions
// ======================

// For authentication
export async function getExpensiveUserByEmail(email: string): Promise<User & { student: Student | null, facultyMember: FacultyMember | null } | null> {
  return prisma.user.findUnique({
    where: { email },
    include: { student: { select: { id: true, homeClassId: true } }, 
    facultyMember: { select: { id: true, titles: true } }, },
  });
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
  teacherId: string,
  subject: string,
  weekScheduleId: WeekScheduleIdentifier,
  color: string
): Promise<Course | null> {
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

  const timeSlotsData = createScheduleTimeSlots(weekScheduleId, course.id, homeClassId);

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