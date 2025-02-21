'use client';
import React from "react";
import WeekCalendarCell from "./WeekCalendarCell";
import { SelectedDate } from "../useCalendarState";
import { WeekCell, DayCell, TimeSlotCell } from "@/lib/getCalendarData";
import { Event } from "@prisma/client";

export interface WeekCalendarProps {
  onClick?: (date: SelectedDate) => void;
  events: WeekCell; // array of 7 DayCells (one per day; each DayCell is an array of EventTimeSlot or null)
  selectedDate: SelectedDate;
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({
  onClick,
  events = {}, // Default to an empty object if events is undefined
  selectedDate,
}) => {

  // Collect all time slot identifiers across the week.
  // <period, <day, TimeSlotCell>>
  const timeslotRecords: Record<number, Record<number, TimeSlotCell>> = {};
  Object.values(events).forEach((dayEvents: DayCell) => {
    if (dayEvents) {
      Object.values(dayEvents).forEach((timeSlotCell: TimeSlotCell) => {
        if (timeSlotCell) {
          const { timeslot } = timeSlotCell;
          const { periodOfDay } = timeslot;
          // check if timslot has periodOfDay
          if (periodOfDay !== null && periodOfDay !== undefined) {
            if (!timeslotRecords[periodOfDay]) {
              timeslotRecords[periodOfDay] = {};
            }
            const dayOfWeek = timeslot.dayOfWeek;
            if (!timeslotRecords[periodOfDay][dayOfWeek]) {
              timeslotRecords[periodOfDay][dayOfWeek] = timeSlotCell;
            }
          }
        }
      });
    }
  });
  // sort timeslotRecords by periodOfDay
  const timeslotsperiods = Object.keys(timeslotRecords).map(Number).sort((a, b) => a - b);

  // // If there are no events/time slots, add a period 0 to display an empty row.
  // if (timeslotsperiods.length === 0) {
  //   timeslotsperiods.push("0");
  // }

  return (
    <div className="w-full pt-[1vh]">
      {timeslotsperiods.map((timeslotperiod, rowIndex) => (
        <div key={rowIndex} className="flex w-full">
          {Array.from({ length: 7 }, (_, dayIndex) => {
            // Get the events for the current day and time slot from timeslotRecords.
            const cellEvents = timeslotRecords[timeslotperiod]?.[dayIndex]?.events || [];
            

            return (
              <WeekCalendarCell
                key={dayIndex}
                timeslot={timeslotperiod}
                events={cellEvents}
                onClick={() => onClick && onClick({ ...selectedDate, dayWeek: dayIndex, timeSlot: timeslotperiod })}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeekCalendar;