import React, { useMemo } from "react";
import { daysOfWeek } from "@/lib/calendarUtils";
import type { WeekCell } from "../useCalendar";
import WeekCalendarHeader from "./WeekCalendarHeader";

export interface WeekCalendarProps {
  onDayClick?: (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => void;
  events: WeekCell;
  currentYear: number;
  currentWeek: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  onDayClick,
  events,
  currentYear,
  currentWeek,
  onPrevWeek,
  onNextWeek,
}) => {
  // Compute all time slot values that appear in this week’s events.
  // (We assume each event’s timeSlot.periodOfDay represents its time slot.)
  const timeSlots = useMemo(() => {
    const slotsSet = new Set<number>();
    if (events) {
      events.forEach((dayEvents) => {
        if (dayEvents) {
          dayEvents.forEach((event) => {
            const slot = event.timeSlot.periodOfDay;
            if (slot !== null) {
              slotsSet.add(slot);
            }
          });
        }
      });
    }
    const slots = Array.from(slotsSet);
    slots.sort((a, b) => a - b);
    return slots;
  }, [events]);

  // Helper: for a given day (index 0–6) and time slot, filter events.
  const getEventsForCell = (dayIndex: number, slot: number) => {
    if (!events) return null;
    const dayEvents = events[dayIndex];
    if (!dayEvents) return null;
    return dayEvents.filter((event) => event.timeSlot.periodOfDay === slot);
  };

  return (
    <div className="w-full">
      <WeekCalendarHeader
        currentYear={currentYear}
        currentWeek={currentWeek}
        onPrevWeek={onPrevWeek}
        onNextWeek={onNextWeek}
      />
      <div className="grid grid-cols-8">
        {/* Top-left empty cell */}
        <div className="border p-2"></div>
        {/* Day headers */}
        {daysOfWeek.map((day, index) => (
          <div key={index} className="border p-2 text-center font-semibold">
            {day}
          </div>
        ))}
        {/* For each time slot, render a row: first cell is the slot label, then one cell per day */}
        {timeSlots.map((slot) => (
          <React.Fragment key={slot}>
            {/* Time slot label */}
            <div className="border p-2 text-center font-medium">{`Slot ${slot}`}</div>
            {daysOfWeek.map((_, dayIndex) => {
              const cellEvents = getEventsForCell(dayIndex, slot);
              return (
                <div
                  key={dayIndex}
                  className="border p-2 h-20 relative cursor-pointer"
                  onClick={() => {
                    if (onDayClick) {
                      // Here you might want to pass additional info about the day.
                      // For this example, we pass the slot value as the day indicator.
                      onDayClick(slot, dayIndex, currentYear, currentWeek, dayIndex);
                    }
                  }}
                >
                  {cellEvents && cellEvents.length > 0 ? (
                    cellEvents.map((event, idx) => (
                      <div key={idx} className="bg-blue-500 text-white text-xs p-1 mb-1 rounded">
                        {event.timeSlot.startHour}:{String(event.timeSlot.startMinute).padStart(2, '0')} – {event.timeSlot.endHour}:{String(event.timeSlot.endMinute).padStart(2, '0')}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-300 text-xs">No event</div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
