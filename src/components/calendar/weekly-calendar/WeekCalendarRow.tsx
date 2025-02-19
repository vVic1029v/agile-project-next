import React from "react";
import WeekCalendarCell from "./WeekCalendarCell";

export interface WeekCalendarRowProps {
  period: number;
  dayCells: any[]; // Array for each day (the events in that time slot)
  weekDays: Date[];
  onCellClick: (date: Date, period: number) => void;
}

const WeekCalendarRow: React.FC<WeekCalendarRowProps> = ({
  period,
  dayCells,
  weekDays,
  onCellClick,
}) => {
  return (
    <div className="grid grid-cols-8">
      {/* Time slot label cell */}
      <div className="border p-2 flex items-center justify-center">
        Slot {period}
      </div>
      {weekDays.map((day, index) => (
        <WeekCalendarCell
          key={index}
          events={dayCells[index]}
          day={day}
          period={period}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
};

export default WeekCalendarRow;
