'use client';
import React from "react";
import WeekCalendarCell from "./WeekCalendarCell";
import { SelectedDate } from "../useCalendarState";
import { StructuredWeekCourses, WeekCell } from "@/lib/database/getCalendarData";
import { collectTimeSlotRecords, sortTimeSlotPeriods, getSelectedDateForDay } from "@/lib/weekCalendarUtils";
import { Course } from "@prisma/client";
import { daySchedule } from "@/lib/database/timeSlots";

export interface WeekCalendarProps {
  onClick?: (date: SelectedDate) => void;
  events?: WeekCell;
  courses: StructuredWeekCourses;
  selectedDate?: SelectedDate;
  showAllPeriods?: boolean;
  highlightedPeriods?: SelectedDate[];
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  onClick,
  events = {}, // Default to an empty object if events is undefined
  courses,
  selectedDate,
  showAllPeriods = false,
  highlightedPeriods = [],
}) => {
  // Collect all time slot identifiers across the week.
  const timeslotRecords = collectTimeSlotRecords(events, courses, showAllPeriods);
  const timeslotsPeriods = sortTimeSlotPeriods(timeslotRecords);

  return (
    <div className="w-full pt-[1vh]">
      {timeslotsPeriods.map((timeslotPeriod, rowIndex) => (
        <div key={rowIndex} className="flex w-full">
          {Array.from({ length: 7 }, (_, dayWeek) => {
            // Get the events for the current day and time slot from timeslotRecords.
            const cellEvents = timeslotRecords?.[timeslotPeriod]?.[dayWeek]?.events || [];
            
            const selectedDateForDay = selectedDate ? getSelectedDateForDay(selectedDate, dayWeek, timeslotPeriod) : 
            {
              day: 0,
              month: 0,
              year: 0,
              week: 0,
              dayWeek: dayWeek,
              period: timeslotPeriod,
            };

            // if it is a highlighted date, set highlighted to true
            const isHighlighted = highlightedPeriods.some((date) => date.dayWeek === dayWeek && date.period === timeslotPeriod );
            const isWeekend = dayWeek === 5 || dayWeek === 6;
            return (
              <WeekCalendarCell
                key={`${rowIndex}-${dayWeek}`}
                courseName={timeslotRecords?.[timeslotPeriod]?.[dayWeek]?.course?.subject || ""}
                events={cellEvents}
                onClick={() => onClick && onClick(selectedDateForDay)}
                color={timeslotRecords?.[timeslotPeriod]?.[dayWeek]?.course?.color || "transparent"}
                isWeekend={isWeekend}
                highlighted={isHighlighted}
                timeslotPeriod={`${daySchedule[timeslotPeriod-1]?.start.hour}:${daySchedule[timeslotPeriod-1]?.start.minute} - ${daySchedule[timeslotPeriod-1]?.end.hour}:${daySchedule[timeslotPeriod-1]?.end.minute}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeekCalendar;
