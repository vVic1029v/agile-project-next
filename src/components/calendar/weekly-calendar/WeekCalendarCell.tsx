import React from "react";
import { EventTimeSlot } from "@/components/calendar/useCalendar";

export interface WeekCalendarCellProps {
  events: EventTimeSlot[];
  day: Date;
  period: number;
  onClick: (day: Date, period: number) => void;
}

const WeekCalendarCell: React.FC<WeekCalendarCellProps> = ({
  events,
  day,
  period,
  onClick,
}) => {
  return (
    <div
      className="border p-2 h-24 relative cursor-pointer"
      onClick={() => onClick(day, period)}
    >
      {events && events.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {events.map((event, idx) => (
            <div key={idx} className="bg-blue-500 text-white text-xs rounded px-1">
              {event.timeSlot.startHour}:{event.timeSlot.startMinute
                .toString()
                .padStart(2, "0")}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default WeekCalendarCell;
