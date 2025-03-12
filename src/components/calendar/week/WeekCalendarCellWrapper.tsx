// WeekCalendarCellWrapper.tsx
import React from "react";

interface WeekCalendarCellWrapperProps {
  children: React.ReactNode;
  onClick: () => void;
  highlighted?: boolean;
  isBlank?: boolean;
  isWeekend?: boolean;
  isToday?: boolean;
  dayObj?: { month: number; day: number };
  index?: number;
}

const WeekCalendarCellWrapper: React.FC<WeekCalendarCellWrapperProps> = ({
  children,
  onClick,
  highlighted = false,
  isBlank = false,
  isWeekend = false,
  isToday = false,
  dayObj,
  index,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative z-10 m-[-0.5px] aspect-[4/3] w-full cursor-pointer border-2 font-medium transition-all hover:z-20 hover:border-cyan-400 rounded-3xl
        ${highlighted ? 'border-blue-700' : ''}
        ${isWeekend ? 'bg-gray-200 border-gray-300' : ''}
        ${isToday ? 'bg-blue-500 text-white font-semibold' : ''}
      `}
    >
      {dayObj && dayObj.day !== 0 && (
        <span className="absolute flex items-center justify-center rounded-full left-2 top-2 text-base w-8 h-8">
          {/* {dayObj.day} */}
        </span>
      )}
      {children}
    </div>
  );
};

export default WeekCalendarCellWrapper;
