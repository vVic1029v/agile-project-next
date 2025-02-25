'use client';
import React from "react";
import WeekCalendarCell from "./WeekCalendarCell";
import { SelectedDate } from "../useCalendarState";
import { StructuredWeekCourses, WeekCell } from "@/lib/database/getCalendarData";
import { collectTimeSlotRecords, sortTimeSlotPeriods, getSelectedDateForDay } from "@/lib/weekCalendarUtils";
import { Course } from "@prisma/client";

export interface WeekCalendarProps {
  onClick?: (date: SelectedDate) => void;
  events: WeekCell;
  courses: StructuredWeekCourses;
  selectedDate: SelectedDate;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  onClick,
  events = {}, // Default to an empty object if events is undefined
  courses,
  selectedDate,
}) => {

  // Collect all time slot identifiers across the week.
  const timeslotRecords = collectTimeSlotRecords(events, courses);
  const timeslotsPeriods = sortTimeSlotPeriods(timeslotRecords);

  return (
    <div className="w-full pt-[1vh]">
      {timeslotsPeriods.map((timeslotPeriod, rowIndex) => (
        <div key={rowIndex} className="flex w-full">
          {Array.from({ length: 7 }, (_, dayIndex) => {
            // Get the events for the current day and time slot from timeslotRecords.
            const cellEvents = timeslotRecords[timeslotPeriod]?.[dayIndex]?.events || [];
            const selectedDateForDay = getSelectedDateForDay(selectedDate, dayIndex, timeslotPeriod);
            return (
              <WeekCalendarCell
                key={dayIndex}
                courseName={timeslotRecords[timeslotPeriod]?.[dayIndex]?.course?.subject}
                events={cellEvents}
                onClick={() => onClick && onClick(selectedDateForDay)}
                color={timeslotRecords[timeslotPeriod]?.[dayIndex]?.course?.color}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeekCalendar;