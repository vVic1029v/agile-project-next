import { Course, Prisma, TimeSlot } from "@prisma/client";
import { getUserCourses, getUserEvents } from "./database";
import { authMiddleware } from "./auth";
import { getWeekAndDay } from "./calendarUtils";

export type EventTimeSlot = Prisma.EventGetPayload<{ include: { timeSlot: true } }>;

export type Event = Prisma.EventGetPayload<{}>;
export type TimeSlotCell = EventTimeSlot[];
export type DayCell = Record<string, TimeSlotCell>;
export type WeekCell = Record<number, DayCell>;
export type YearCell = Record<number, WeekCell>;
export type StructuredEvents = Record<number, YearCell>;

export async function getCalendarData(userId: string): Promise<{
  events: StructuredEvents;
  courses: Course[];
}> {
  const session = await authMiddleware();
  try {
    const events: EventTimeSlot[]  = await getUserEvents(userId);
    const courses: Course[] = await getUserCourses(userId, session.user.userType);

    const structuredEvents: Record<number, YearCell> = {};

    events.forEach(event => {
      const timeSlotId = event.timeSlot.id;
      const dayOfWeek = event.timeSlot.dayOfWeek;
      const {yearNumber, weekNumber} = event;

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
        structuredEvents[yearNumber][weekNumber][dayOfWeek][timeSlotId] = [];
      }
      structuredEvents[yearNumber][weekNumber][dayOfWeek][timeSlotId].push(event);
    });

    return { events: structuredEvents, courses };

  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return { events: {}, courses: [] };
  }
}