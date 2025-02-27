import React, { useMemo } from 'react';
import YearCalendarRow from './YearCalendarRow';
import { getDaysInYear, chunkDaysIntoWeeks } from '@/lib/calendarUtils';
import { StructuredEvents } from '@/lib/database/getCalendarData';
import { SelectedDate } from '../useCalendarState';

export interface YearCalendarGridProps {
  year: number;
  onDayClick: (selected: SelectedDate) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  events?: StructuredEvents;
  selectedDate : SelectedDate;
}

const YearCalendarGrid: React.FC<YearCalendarGridProps> = ({ year, onDayClick, dayRefs, events,selectedDate }) => {
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
          selectedDate={selectedDate}
        />
      ))}
    </>
  );
};

export default YearCalendarGrid;