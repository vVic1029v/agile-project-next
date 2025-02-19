import React from "react";
import WeekCalendarRow from "./WeekCalendarRow";

export interface WeekCalendarGridProps {
  weekDays: Date[];
  gridData: Array<Array<any>>; // rows x columns (each cell is an array of events)
  timeSlots: number[];
  onCellClick: (date: Date, period: number) => void;
}

const WeekCalendarGrid: React.FC<WeekCalendarGridProps> = ({
  weekDays,
  gridData,
  timeSlots,
  onCellClick,
}) => {
  return (
    <div className="flex flex-col">
      {timeSlots.map((period, rowIndex) => (
        <WeekCalendarRow
          key={period}
          period={period}
          dayCells={gridData[rowIndex]}
          weekDays={weekDays}
          onCellClick={onCellClick}
        />
      ))}
    </div>
  );
};

export default WeekCalendarGrid;
