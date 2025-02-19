import React from 'react';
import CalendarDayCell from './CalendarDayCell';
import type { DayObj } from '@/lib/calendarUtils';
import { DayCell } from '../useCalendar';

export interface CalendarRowProps {
  week: DayObj[];
  weekIndex: number;
  days: DayObj[];
  onDayClick: (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => void;
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
    <div className="relative flex w-full items-center" key={`week-${weekIndex}`}>
      <button
        type="button"
        style={{
          WebkitMaskImage: "linear-gradient(to left, black 1%, transparent 50%)",
          maskImage: "linear-gradient(to left, black 1%, transparent 50%)",
        }}
        className="absolute left-0 -translate-x-full m-[-0.5px] group aspect-square grow cursor-pointer 
                  border font-medium transition-all opacity-20 w-30
                   hover:z-20 hover:border-cyan-400 hover:opacity-100
                   sm:-m-px sm:border-2 
                   rounded-3xl size-[15vh]"
        onClick={() => {}}
      >
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl"
          style={{ writingMode: "vertical-lr", textOrientation: "sideways", height: "100%" }}
        >
          Week {weekIndex + 1}
        </span>
      </button>
      <div className="flex w-full">
        {week.map((dayObj, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isNewMonth = index === 0 || days[index - 1].month !== dayObj.month;
          const isToday = dayObj.month === now.getMonth() && dayObj.day === now.getDate() && now.getFullYear() === year;
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
              dayWeek={dayIndex}
              events={dayEvents}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarRow;