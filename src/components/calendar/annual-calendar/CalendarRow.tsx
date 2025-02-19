// /components/Calendar/WeekRow.tsx
import React from 'react';
import CalendarDayCell from './CalendarDayCell';
import type { DayObj } from '@/lib/calendarUtils';
import { DayCell } from '../useCalendar';

export interface CalendarRowProps {
  week: DayObj[];
  weekIndex: number;
  days: DayObj[];
  onDayClick: (day: number, month: number, week: number, year: number) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  year: number;
  events?: DayCell[];
}

const CalendarRow: React.FC<CalendarRowProps> = ({
  week,
  weekIndex,
  days,
  onDayClick,
  dayRefs,
  year,
  events
}) => {
  const now = new Date();

  return (
    <div className="relative flex w-full items-center" key={`week-${weekIndex}`} style={{ maxWidth: "100%", maxHeight: "1%" }}>
      {/* Button on the left */}

      <button
        type="button"
        style={{
          WebkitMaskImage: "linear-gradient(to left, black 1%, transparent 50%)",
          maskImage: "linear-gradient(to left, black 1%, transparent 50%)",
        }}
        onClick={() => { }}
        className="absolute left-0 -translate-x-full 
             m-[-0.5px] group aspect-square w-full grow cursor-pointer 
             rounded-xl border font-medium transition-all opacity-20 
             hover:z-20 hover:border-cyan-400 hover:opacity-100
             sm:-m-px sm:size-20 sm:rounded-2xl sm:border-2 
             lg:size-36 lg:rounded-3xl 
             2xl:size-40"
      >
        <span
          style={{
            writingMode: "vertical-lr",
            textOrientation: "sideways",
            height: "100%",
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl"
        >
          Week {weekIndex + 1}
        </span>
      </button>

      {/* Week row (Days) */}
      <div className="flex w-full">
        {week.map((dayObj, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isNewMonth = index === 0 || days[index - 1].month !== dayObj.month;
          const isToday =
            dayObj.month === now.getMonth() &&
            dayObj.day === now.getDate() &&
            now.getFullYear() === year;

          const dayEvents = events?.[dayIndex] ?? [];

          return (
            <CalendarDayCell
              key={`${dayObj.month}-${dayObj.day}-${index}`}
              dayObj={dayObj}
              index={index}
              isNewMonth={isNewMonth}
              isToday={isToday}
              onClick={onDayClick}
              dayRefs={dayRefs}
              year={year}
              events={dayEvents}
            />
          );
          
        })}
      </div>
    </div>
  );
};


export default CalendarRow;
