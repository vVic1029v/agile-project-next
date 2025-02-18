import { PrismaClient, User, Student, FacultyMember, UserType, HomeClass, TimeSlot, Course, Event, EventType } from "@prisma/client";
import { getTimesOfIndentifier, WeekScheduleIdentifier } from "@/lib/timeSlots"

export const prisma = new PrismaClient();

// for auth
export async function getExpensiveUserByEmail(email: string): Promise<User & { student: Student | null, facultyMember: FacultyMember | null }|null> {
  return prisma.user.findUnique({
    where: { email },
    include: { student: true, facultyMember: true },
  });
}

// for register
export async function getCheapUserByEmail(email: string): Promise<User|null>  {
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
  userType : UserType,
): Promise<User|null> {
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
): Promise<HomeClass|null> {
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
export async function getCheapHomeClassById(homeClassId: string): Promise<HomeClass|null>  {
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
  const timeSlots = getTimesOfIndentifier(weekScheduleId);
  
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
  const timeSlotsData = timeSlots.map((timeSlot, index) => ({
    dayOfWeek: weekScheduleId[index].day, // zero-indexed, no change needed
    periodOfDay: weekScheduleId[index].period, // zero-indexed, no change needed
    startHour: timeSlot.startHour, // Using relative start time
    startMinute: timeSlot.startMinute, // Using relative start time
    endHour: timeSlot.endHour, // Using relative end time
    endMinute: timeSlot.endMinute, // Using relative end time
    courseId: course.id, // Connect the course to the time slot
    homeClassId: homeClassId
  }));

  // Create multiple time slots in the database
  console.log(timeSlotsData)
  await prisma.timeSlot.createMany({
    data: timeSlotsData
  });
  
  return course;
}




// for events api
export async function getUserEvents(userId: string): Promise<Event[] | null> {
  const events = await prisma.event.findMany({
    where: {
      users: {
        some: {
          id: userId, // Check if the user is associated with the event
        }
      }
    }
  });
  console.log(events)
  return events.length > 0 ? events : null; // Return the events, or null if none found
}

// for events api
export async function postEvent(eventData: { title: string; type: EventType; description?: string; courseId: string; timeSlotId?: string; startTime: Date; endTime: Date; weekNumber: number, yearNumber: number }): Promise<Event | null> {
  const [courseData, courseUsersIds] = await Promise.all([
    prisma.course.findUnique({
      where: { id: eventData.courseId },
      select: {
        homeClass: {
          select: {
            homeroomFacultyMember: {
              select: {
                user: { select: { id: true } }
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
  
  
  // Combine the teacher's userId with the students' userIds
  const allUserIds = [
    ...courseUsersIds.map(studentCourse => studentCourse.student.user.id), // Add student userIds
    courseData?.homeClass?.homeroomFacultyMember?.user?.id // Add teacher's userId
  ].filter(Boolean); // Ensure we don't add any undefined values
  
  // Create the event and connect the users (students + teacher)
  return prisma.event.create({
    data: {
      title: eventData.title,
      type: eventData.type,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      weekNumber: eventData.weekNumber,
      yearNumber: eventData.yearNumber,
      courseId: eventData.courseId,
      timeSlotId: eventData.timeSlotId ?? null,
      users: {
        connect: allUserIds.map(userId => ({ id: userId })) // Connect all users by their IDs
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


