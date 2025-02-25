import { TimeSlotCell, DayCell, WeekCell, StructuredWeekCourses } from "@/lib/database/getCalendarData";
import { SelectedDate } from "../components/calendar/useCalendarState";
import { getWeekStartDateFromYearWeek } from "@/lib/calendarUtils";

// Helper function to collect all time slot identifiers across the week
export function collectTimeSlotRecords(
    events: WeekCell,
    courses: StructuredWeekCourses
  ): Record<number, Record<number, TimeSlotCell>> {
    const timeslotRecords: Record<number, Record<number, TimeSlotCell>> = {};
  
    // Process events first.
    Object.values(events).forEach((dayEvents: DayCell) => {
      if (dayEvents) {
        Object.values(dayEvents).forEach((timeSlotCell: TimeSlotCell) => {
          if (timeSlotCell) {
            const { timeslot } = timeSlotCell;
            const { periodOfDay, dayOfWeek } = timeslot;
            if (periodOfDay !== null && periodOfDay !== undefined) {
              if (!timeslotRecords[periodOfDay]) {
                timeslotRecords[periodOfDay] = {};
              }
              // Use the event record if it doesn't already exist for this period/day.
              if (!timeslotRecords[periodOfDay][dayOfWeek]) {
                timeslotRecords[periodOfDay][dayOfWeek] = timeSlotCell;
              }
            }
          }
        });
      }
    });
  
    // Process courses and create new records if missing.
    Object.entries(courses).forEach(([dayKey, dayCourses]) => {
      // Convert the day key to a number (as courses keys are numeric).
      const day = Number(dayKey);
      Object.values(dayCourses).forEach((timeslotCourse) => {
        const { timeslot, courses: courseArr } = timeslotCourse;
        const { periodOfDay, dayOfWeek } = timeslot;
        if (periodOfDay !== null && periodOfDay !== undefined) {
          if (!timeslotRecords[periodOfDay]) {
            timeslotRecords[periodOfDay] = {};
          }
          if (!timeslotRecords[periodOfDay][dayOfWeek]) {
            // Create a new record using the timeslot info and set course to the first course.
            timeslotRecords[periodOfDay][dayOfWeek] = {
              events: [],
              timeslot,
              course: courseArr[0],
            };
          } else {
            // If a record exists but doesn't have course data, add it.
            if (!timeslotRecords[periodOfDay][dayOfWeek].course && courseArr.length > 0) {
              timeslotRecords[periodOfDay][dayOfWeek].course = courseArr[0];
            }
          }
        }
      });
    });
  
    return timeslotRecords;
  }
  

// Helper function to sort time slot records by period of day
export function sortTimeSlotPeriods(timeslotRecords: Record<number, Record<number, TimeSlotCell>>): number[] {
  return Object.keys(timeslotRecords).map(Number).sort((a, b) => a - b);
}

// Helper function to get the selected date for a specific day in the week
export function getSelectedDateForDay(selectedDate: SelectedDate, dayIndex: number, timeslotPeriod: number): SelectedDate {
  const weekStartDate = getWeekStartDateFromYearWeek(selectedDate.year, selectedDate.week);
  return {
    ...selectedDate,
    day: weekStartDate.getDate() + dayIndex,
    month: weekStartDate.getMonth(),
    year: weekStartDate.getFullYear(),
    dayWeek: dayIndex,
    timeSlot: timeslotPeriod,
  };
}