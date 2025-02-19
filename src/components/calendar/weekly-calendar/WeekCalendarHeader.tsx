import React from "react";

export interface WeekCalendarHeaderProps {
  currentYear: number;
  currentWeek: number;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const WeekCalendarHeader: React.FC<WeekCalendarHeaderProps> = ({
  currentYear,
  currentWeek,
  onPrevWeek,
  onNextWeek,
}) => {
  return (
    <div className="flex items-center justify-between mb-4 px-2">
      <button onClick={onPrevWeek} className="p-2 border rounded">
        Prev Week
      </button>
      <div className="text-lg font-semibold">{`Year ${currentYear} - Week ${currentWeek + 1}`}</div>
      <button onClick={onNextWeek} className="p-2 border rounded">
        Next Week
      </button>
    </div>
  );
};

export default WeekCalendarHeader;
