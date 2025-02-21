import { PrismaClient, User, Student, FacultyMember, UserType, HomeClass, TimeSlot, Course, Event, EventType, Prisma } from "@prisma/client";
import { createScheduleTimeSlots, createTimeSlot, getTimesOfIndentifier, WeekScheduleIdentifier } from "@/lib/timeSlots"
import { EventTimeSlot } from "./getCalendarData";

export const prisma = new PrismaClient();

// for auth
export async function getExpensiveUserByEmail(email: string): Promise<User & { student: Student | null, facultyMember: FacultyMember | null } | null> {
  return prisma.user.findUnique({
    where: { email },
    include: { student: true, facultyMember: true },
  });
}

// for register
export async function getCheapUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

// for register
export async function postNewUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  userType: UserType,
): Promise<User | null> {
  return prisma.user.create({
    data: {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      userType: userType,
      student: userType === "STUDENT" ? { create: {} } : undefined,
      facultyMember: userType === "FACULTYMEMBER" ? { create: {} } : undefined
    },
  });
}

// for new HomeClass
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

    },
  });
}

// for new Course
export async function getCheapHomeClassById(homeClassId: string): Promise<HomeClass | null> {
  return prisma.homeClass.findUnique({
    where: { id: homeClassId },
  });
}

// for new Course
export async function postNewCourse(
  homeClassId: string,
  teacherId: string,
  subject: string,
  weekScheduleId: WeekScheduleIdentifier
): Promise<Course | null> {
  // Get the relative times (startHour, startMinute, endHour, endMinute) using the renamed getTimesOfIndex function

  // Create the course in the database
  const course = await prisma.course.create({
    data: {
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
  // Prepare the time slot data
  const timeSlotsData = createScheduleTimeSlots(weekScheduleId, course.id, homeClassId)

  // Create multiple time slots in the database
  await prisma.timeSlot.createMany({
    data: timeSlotsData
  });

  return course;
}

// for events api
export async function getUserEvents(userId: string): Promise<EventTimeSlot[]> {
  const events = await prisma.event.findMany({
    where: {
      users: {
        some: {
          id: userId, // Check if the user is associated with the event
        }
      }
    },
    include: {
      timeSlot: true
    }
  });
  return events; // Return the events, or null if none found
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

  // Extract the faculty member user ID
  const facultyUserId = courseData?.facultyMember?.user?.id;

  // Extract the student user IDs
  const studentUserIds = studentCourseData.map(sc => sc.student.user.id);

  // Combine them into a single array, ensuring facultyUserId is included if it exists
  const userIds = facultyUserId ? [facultyUserId, ...studentUserIds] : studentUserIds;

  return userIds;
}

export async function postEventFloating(dayOfWeek: number, startHour: number, startMinute: number, endHour: number, endMinute: number, eventData: Event): Promise<Event | null> {

  const newTimeSlotId = await prisma.timeSlot.create({
    data: createTimeSlot(eventData.courseId, { dayOfWeek, startHour, startMinute, endHour, endMinute })
  });

  const userIds = await getAllCourseUserIds(eventData)
  return prisma.event.create({
    data: {
      title: eventData.title,
      type: eventData.type,
      weekNumber: eventData.weekNumber,
      yearNumber: eventData.yearNumber,
      course: { connect: { id: eventData.courseId } },
      timeSlot: { connect: { id: newTimeSlotId.id } },
      users: {
        connect: userIds.map(userId => ({ id: userId })) // Connect all users by their IDs
      }
    }
  }).then(event => event ?? null);

}


//{ title: string; type: EventType; description?: string; courseId: string; timeSlotId: string; weekNumber: number, yearNumber: number }
// for events api
export async function postEventTimeSlot(eventData: Event): Promise<Event | null> {
  const userIds = await getAllCourseUserIds(eventData)

  return prisma.event.create({
    data: {
      title: eventData.title,
      type: eventData.type,
      weekNumber: eventData.weekNumber,
      yearNumber: eventData.yearNumber,
      courseId: eventData.courseId,
      timeSlotId: eventData.timeSlotId,
      users: {
        connect: userIds.map(userId => ({ id: userId })) // Connect all users by their IDs
      }
    }
  }).then(event => event ?? null);
}


//get the TimeSlot's startTime and endTime
export async function getTimeSlot(timeSlotId: string): Promise<TimeSlot | null> {
  return prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
  });
}


export async function getUserCourses(userId: string, userType: UserType): Promise<Course[]> {
  if (userType === "STUDENT") {
    const studentCourses = await prisma.studentCourse.findMany({
      where: { studentId: userId },
      include: { course: true }, // Include the related course data
    });

    return studentCourses.map(sc => sc.course); // Extract and return the courses
  }

  if (userType === "FACULTYMEMBER") {
    return prisma.course.findMany({
      where: { facultyMemberId: userId },
    });
  }

  return [];
}





// for search homeclass modal
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