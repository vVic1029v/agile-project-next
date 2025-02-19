import React, { useMemo } from 'react';
import YearCalendarRow from './YearCalendarRow';
import { getDaysInYear, chunkDaysIntoWeeks } from '@/lib/calendarUtils';
import { YearCell } from '../useCalendar';

export interface YearCalendarGridProps {
  year: number;
  onDayClick: (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  events?: Record<number, YearCell>;
}

const YearCalendarGrid: React.FC<YearCalendarGridProps> = ({ year, onDayClick, dayRefs, events }) => {
  const days = useMemo(() => getDaysInYear(year), [year]);
  const weeks = useMemo(() => chunkDaysIntoWeeks(days), [days]);

  return (
    <>
      {weeks.map((week, weekIndex) => (
        <YearCalendarRow
          key={weekIndex}
          week={week}
          weekIndex={weekIndex}
          days={days}
          onDayClick={onDayClick}
          dayRefs={dayRefs}
          year={year}
          events={events?.[year]?.[weekIndex] ?? []}
        />
      ))}
    </>
  );
};

export default YearCalendarGrid;
