// /components/Calendar/WeekRow.tsx
import React from 'react';
import DayCell from './DayCell';
import { computeDateKey } from '@/lib/calendarUtils';
import type { DayObj } from '@/lib/calendarUtils';

export interface WeekRowProps {
  week: DayObj[];
  weekIndex: number;
  days: DayObj[];
  onDayClick: (day: number, month: number, year: number) => void;
  dayRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  year: number;
  events?: { [key: string]: Array<{ icon: string; color: string }> };
}

const WeekRow: React.FC<WeekRowProps> = ({
  week,
  weekIndex,
  days,
  onDayClick,
  dayRefs,
  year,
  events,
}) => {
  const now = new Date();

  return (
    <div className="flex w-full" key={`week-${weekIndex}`}>
      {week.map((dayObj, dayIndex) => {
        const index = weekIndex * 7 + dayIndex;
        const isNewMonth = index === 0 || days[index - 1].month !== dayObj.month;
        const isToday =
          dayObj.month === now.getMonth() &&
          dayObj.day === now.getDate() &&
          now.getFullYear() === year;
        const dateKey = computeDateKey(dayObj, year);
        const dayEvents = events ? events[dateKey] : undefined;
        return (
          <DayCell
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
  );
};

export default WeekRow;
