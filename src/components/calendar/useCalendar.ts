import { useState, useEffect, useMemo } from "react";
import { Course } from "@prisma/client";
import { EventTimeSlot } from "calendar-types";

export type DayCell = EventTimeSlot[] | null;
export type WeekCell = DayCell[] | null;
export type YearCell = WeekCell[] | null;

export function useCalendar(userId?: string): {
  timeCells: Record<number, YearCell>;
  courses: Course[];
} {
  const [timeCells, setTimeCells] = useState<Record<number, YearCell>>({});
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchCalendarData = async () => {
      try {
        // Fetch events
        const eventsRes = await fetch(`/api/getEvents?userId=${userId}`);
        if (!eventsRes.ok) throw new Error("Failed to fetch events");
        const eventsData = await eventsRes.json();
        const events: EventTimeSlot[] = eventsData.events;

        // Fetch courses
        const coursesRes = await fetch(`/api/getCourses?userId=${userId}`);
        if (!coursesRes.ok) throw new Error("Failed to fetch courses");
        const coursesData = await coursesRes.json();
        const { courses } = coursesData;

        // Group events by year, then by week, then by day-of-week.
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

        // Only update state if the data has changed.
        setTimeCells(yearCells);
        setCourses(courses);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setTimeCells({});
        setCourses([]);
      }
    };

    fetchCalendarData();
  }, [userId]);

  // Memoize timeCells and courses to avoid unnecessary recalculations
  const memoizedTimeCells = useMemo(() => timeCells, [timeCells]);
  const memoizedCourses = useMemo(() => courses, [courses]);

  return { timeCells: memoizedTimeCells, courses: memoizedCourses };
}
