import { Course, Prisma, TimeSlot } from "@prisma/client";
import { getUserCourses, getUserEvents } from "./database";
import { authMiddleware } from "./auth";

export type EventTimeSlot = Prisma.EventGetPayload<{ include: { timeSlot: true } }>;

export type Event = Prisma.EventGetPayload<{}>;
export type TimeSlotCell = {events: Event[], timeslot: TimeSlot, course?: Course};
export type DayCell = Record<string, TimeSlotCell>;
export type WeekCell = Record<number, DayCell>;
export type YearCell = Record<number, WeekCell>;
export type StructuredEvents = Record<number, YearCell>;


export type CourseTimeSlots = Prisma.CourseGetPayload<{ include: { timeSlots: true } }>;

export type TimeSlotCourse = {courses: Course[], timeslot: TimeSlot};
export type DayCourse = Record<string, TimeSlotCourse>;
export type StructuredWeekCourses = Record<number, DayCourse>;

export async function getCalendarData(userId: string): Promise<{
  events: StructuredEvents;
  courses: StructuredWeekCourses;
}> {
  const session = await authMiddleware();
  try {
    const [events, courses] = await Promise.all([
      getUserEvents(userId),
      getUserCourses(userId, session.user.userType)
    ]);
    

    const structuredEvents: StructuredEvents = {};
    const structuredCourses: StructuredWeekCourses = {};

    // Process events with specific year and week
    events.forEach(event => {
      const timeSlotId = event.timeSlot.id;
      const dayOfWeek = event.timeSlot.dayOfWeek;
      const { yearNumber, weekNumber } = event;

      if (!structuredEvents[yearNumber]) {
        structuredEvents[yearNumber] = {};
      }
      if (!structuredEvents[yearNumber][weekNumber]) {
        structuredEvents[yearNumber][weekNumber] = {};
      }
      if (!structuredEvents[yearNumber][weekNumber][dayOfWeek]) {
        structuredEvents[yearNumber][weekNumber][dayOfWeek] = {};
      }
      if (!structuredEvents[yearNumber][weekNumber][dayOfWeek][timeSlotId]) {
        structuredEvents[yearNumber][weekNumber][dayOfWeek][timeSlotId] = { events: [], timeslot: event.timeSlot };
      }
      structuredEvents[yearNumber][weekNumber][dayOfWeek][timeSlotId].events.push(event);
    });

    // Process recurrent courses (organized by day-of-week and timeslot)
    courses.forEach(course => {
      course.timeSlots.forEach(timeslot => {
        const day = timeslot.dayOfWeek; // assumed to be a number
        if (!structuredCourses[day]) {
          structuredCourses[day] = {};
        }
        const timeSlotKey = timeslot.id;
        if (!structuredCourses[day][timeSlotKey]) {
          structuredCourses[day][timeSlotKey] = { courses: [], timeslot };
        }
        structuredCourses[day][timeSlotKey].courses.push(course);
      });
    });

    // Merge courses into events:
    // Since Object.entries returns keys as strings, convert day back to a number when indexing.
    Object.entries(structuredEvents).forEach(([year, weeks]) => {
      Object.entries(weeks).forEach(([week, days]) => {
        Object.entries(days).forEach(([day, timeslotCells]) => {
          const dayNum = Number(day); // Convert string key back to a number
          Object.entries(timeslotCells).forEach(([timeSlotId, eventCell]) => {
            if (structuredCourses[dayNum] && structuredCourses[dayNum][timeSlotId]) {
              // If multiple courses exist, adjust the selection logic as needed.
              eventCell.course = structuredCourses[dayNum][timeSlotId].courses[0];
              // Ensure the timeslot references are the same.
              eventCell.timeslot = structuredCourses[dayNum][timeSlotId].timeslot;
            }
          });
        });
      });
    });

    return { events: structuredEvents, courses: structuredCourses };
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return { events: {}, courses: {} };
  }
}


