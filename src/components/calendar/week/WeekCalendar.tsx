'use client';
import React from "react";
import WeekCalendarCell from "./WeekCalendarCell";
import type { WeekCell } from "@/components/calendar/useCalendar";
import { SelectedWeekDate } from "./UserWeekCalendar";

export interface WeekCalendarProps {
  onClick?: (date: Date, timeSlot: number, dayIndex: number) => void;
  events: WeekCell; // array of 7 DayCells (one per day; each DayCell is an array of EventTimeSlot or null)
  weekStart: Date;
  selectedDate: SelectedWeekDate | null
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  onClick,
  events,
  weekStart,
}) => {
  // Collect all time slot identifiers across the week.
  const timeslotSet = new Set<number>();
  events?.forEach((dayEvents) => {
    if (dayEvents) {
      dayEvents.forEach((event) => {
        if (event.timeSlot.periodOfDay != null) {
          timeslotSet.add(event.timeSlot.periodOfDay);
        }
      });
    }
  });
  const timeslots = Array.from(timeslotSet).sort((a, b) => a - b);

  // If there are no events/time slots, show a default row.
  if (timeslots.length === 0) {
    timeslots.push(1);
  }

  return (
    <div className="w-full pt-[1vh]">
      {timeslots.map((timeslot, rowIndex) => (
        <div key={rowIndex} className="flex w-full">
          {Array.from({ length: 7 }, (_, dayIndex) => {
            // For each day column, get events (or an empty array if none).
            const dayEvents = events?.[dayIndex] || [];
            // Filter events for this particular timeslot.
            const cellEvents = dayEvents.filter(
              (event) => event.timeSlot.periodOfDay === timeslot
            );
            // Compute the full date for this cell (weekStart + dayIndex days).
            const cellDate = new Date(weekStart);
            cellDate.setDate(weekStart.getDate() + dayIndex);

            return (
              <WeekCalendarCell
                key={dayIndex}
                date={cellDate}
                timeslot={timeslot}
                events={cellEvents}
                onClick={() => onClick && onClick(cellDate, timeslot, dayIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeekCalendar;
