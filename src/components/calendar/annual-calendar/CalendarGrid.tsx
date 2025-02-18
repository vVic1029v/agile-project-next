// /components/Calendar/CalendarGrid.tsx
import React, { useMemo } from 'react';
import CalendarRow from './WeekRow';
import { getDaysInYear, chunkDaysIntoWeeks } from '@/lib/calendarUtils';
import type { DayObj } from '@/lib/calendarUtils';

export interface CalendarGridProps {
  year: number;
  onDayClick: (day: number, month: number, year: number) => void;
  dayRefs: React.RefObject <(HTMLDivElement | null)[]>;
  events?: { [key: string]: Array<{ icon: string; color: string }> };
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  onDayClick,
  dayRefs,
  events,
}) => {
  const days = useMemo(() => getDaysInYear(year), [year]);
  const weeks = useMemo(() => chunkDaysIntoWeeks(days), [days]);

  return (
    <>
      {weeks.map((week, weekIndex) => (
        <CalendarRow
          key={weekIndex}
          week={week}
          weekIndex={weekIndex}
          days={days}
          onDayClick={onDayClick}
          dayRefs={dayRefs}
          year={year}
          events={events}
        />
      ))}
    </>
  );
};

export default CalendarGrid;
