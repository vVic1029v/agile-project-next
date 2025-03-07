import React from 'react';

interface CalendarCellWrapperProps {
  children: React.ReactNode;
  onClick: () => void;
  highlighted?: boolean;
  isBlank?: boolean;
  dayWeek?: number;
  dayRefs?: React.RefObject<(HTMLDivElement | null)[]>;
  index?: number;
  dayObj?: { month: number; day: number };
  isToday?: boolean;
  isNewMonth?: boolean;
  monthNames?: string[];
}

const CalendarCellWrapper: React.FC<CalendarCellWrapperProps> = ({
  children,
  onClick,
  highlighted = false,
  isBlank = false,
  dayWeek,
  dayRefs,
  index,
  dayObj,
  isToday,
  isNewMonth,
  monthNames,
}) => {
  return (
    <div
      ref={(el) => {
        if (dayRefs && index !== undefined) {
          dayRefs.current[index] = el;
        }
      }}
      data-month={dayObj?.month}
      data-day={dayObj?.day}
      onClick={onClick}
      className={`relative z-10 m-[-0.5px] group aspect-[3/4] w-full grow cursor-pointer border-2 font-medium transition-all hover:z-20 hover:border-cyan-400 rounded-3xl 
        ${isBlank ? "invisible pointer-events-none" : ""} ${dayWeek === 6 || dayWeek === 5 ? "bg-gray-200 border-gray-300" : ""} ${highlighted ? 'border-blue-700' : ''}`}
      style={{ '--cell-size': '15vh' } as React.CSSProperties}
    >
      {dayObj && (
        <span
        className={`absolute flex items-center justify-center rounded-full left-2 top-2 text-base w-8 h-8 ${
          isToday ? 'bg-blue-500 font-semibold text-white' : ''
        } ${dayObj.month < 0 ? 'text-slate-400' : 'text-slate-800'}`}
      >
        {dayObj.day}
      </span>
      )}
      {isNewMonth && dayObj && monthNames && (
        <span className="absolute bottom-0.5 left-0 w-full truncate px-1.5 text-sm font-semibold text-slate-300 sm:bottom-0 sm:text-lg lg:bottom-2.5 lg:left-3.5 lg:w-fit lg:px-0 lg:text-xl">
          {dayObj.month === 12 ? monthNames[0] : monthNames[dayObj.month]}
        </span>
      )}
      {children}
    </div>
  );
};

export default CalendarCellWrapper;