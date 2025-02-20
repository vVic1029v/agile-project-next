import React, { useMemo } from 'react';
import YearCalendarRow from './YearCalendarRow';
import { getDaysInYear, chunkDaysIntoWeeks } from '@/lib/calendarUtils';
import type { SelectedDay } from "@/components/calendar/annual-calendar/UserYearCalendar"; // adjust path as needed
import { YearCell } from '../useCalendar';

export interface YearCalendarGridProps {
  year: number;
  onDayClick: (selected: SelectedDay) => void;
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
