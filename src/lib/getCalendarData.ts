// lib/getCalendarData.ts
import { Course, Prisma } from "@prisma/client";
import { getUserCourses, getUserEvents } from "./database";
import { auth } from "./auth";

export type EventTimeSlot = Prisma.EventGetPayload<{ include: { timeSlot: true } }>;
export type DayCell = EventTimeSlot[] | null;
export type WeekCell = DayCell[] | null;
export type YearCell = WeekCell[] | null;

export async function getCalendarData(userId: string): Promise<{
  timeCells: Record<number, YearCell>;
  courses: Course[];
}> {
  const session = await auth()
  try {
    // Use server-side fetch (disable caching if you want fresh data)
    const events: EventTimeSlot[]  = await getUserEvents(userId);
    
    
    let courses: Course[] = [];
    if (session?.user.userType === "FACULTYMEMBER")
    {
        courses = await getUserCourses(userId, "FACULTYMEMBER");
    }
    else if (session?.user.userType === "STUDENT")
    {
        courses = await getUserCourses(userId, "STUDENT");
    }

    // Group events by year, then week, then day-of-week.
    const yearMap = new Map<number, Map<number, Map<number, EventTimeSlot[]>>>();

    events.forEach((event) => {
      const { yearNumber, weekNumber } = event;
      const dayOfWeek = event.timeSlot.dayOfWeek;
      if (!yearMap.has(yearNumber)) {
        yearMap.set(yearNumber, new Map());
      }
      const weekMap = yearMap.get(yearNumber)!;
      if (!weekMap.has(weekNumber)) {
        weekMap.set(weekNumber, new Map());
      }
      const dayMap = weekMap.get(weekNumber)!;
      if (!dayMap.has(dayOfWeek)) {
        dayMap.set(dayOfWeek, []);
      }
      dayMap.get(dayOfWeek)!.push(event);
    });

    // Build the YearCell object from our grouped data.
    const yearCells: Record<number, YearCell> = {};

    yearMap.forEach((weekMap, yearNumber) => {
      const weekNumbers = Array.from(weekMap.keys());
      const maxWeekNumber = Math.max(...weekNumbers);
      const weeks: WeekCell[] = Array.from({ length: maxWeekNumber }, () => null);

      weekMap.forEach((dayMap, weekNumber) => {
        if (dayMap.size > 0) {
          const days: DayCell[] = [];
          for (let day = 0; day < 7; day++) {
            const eventsForDay = dayMap.get(day) || [];
            days[day] = eventsForDay.length > 0 ? eventsForDay : null;
          }
          weeks[weekNumber - 1] = days;
        }
      });

      const yearCell: YearCell = weeks.some((week) => week !== null) ? weeks : null;
      yearCells[yearNumber] = yearCell;
    });

    return { timeCells: yearCells, courses };
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return { timeCells: {}, courses: [] };
  }
}
