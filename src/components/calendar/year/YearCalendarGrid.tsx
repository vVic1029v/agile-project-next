import React, { useMemo } from 'react';
import YearCalendarRow from './YearCalendarRow';
import { getDaysInYear, chunkDaysIntoWeeks, monthNames } from '@/lib/calendarUtils';
import { StructuredEvents } from '@/lib/database/getCalendarData';
import { SelectedDate } from '../useCalendarState';
import AnimatedHeader from '@/components/Common/Headers/AnimatedHeader';

export interface YearCalendarGridProps {
  year: number;
  onDayClick: (selected: SelectedDate) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  events?: StructuredEvents;
  selectedDate : SelectedDate;
}

const YearCalendarGrid: React.FC<YearCalendarGridProps> = ({ year, onDayClick, dayRefs, events, selectedDate }) => {
  const days = useMemo(() => getDaysInYear(year), [year]);
  const weeks = useMemo(() => chunkDaysIntoWeeks(days), [days]);

  return (
    <>
      {weeks.map((week, weekIndex) => {
        const monthChangeIndex = week.findIndex((day, dayIndex) => dayIndex > 0 && day.month !== week[dayIndex - 1].month);
        const monthChange = monthChangeIndex !== -1;

        return (
          <React.Fragment key={weekIndex}>
            {monthChange && (
              <>
                {weekIndex !== 0 && (
                  <YearCalendarRow
                  key={`${weekIndex}-first`}
                  week={[...week.slice(0, monthChangeIndex), ...Array(7 - monthChangeIndex).fill({ month: -1, week: weekIndex, day: 0 })]}
                  weekIndex={weekIndex}
                  days={days}
                  onDayClick={onDayClick}
                  dayRefs={dayRefs}
                  year={year}
                  events={events?.[year]?.[weekIndex] ?? []}
                  selectedDate={selectedDate}
                  showNewMonth={false}
                />
                )}
                <div className="flex justify-center py-10">
                  <AnimatedHeader text={monthNames[week[monthChangeIndex].month]} />
                </div>
                <YearCalendarRow
                  key={`${weekIndex}-second`}
                  week={[...Array(monthChangeIndex).fill({ month: -1, week: weekIndex, day: 0 }), ...week.slice(monthChangeIndex)]}
                  weekIndex={weekIndex}
                  days={days}
                  onDayClick={onDayClick}
                  dayRefs={dayRefs}
                  year={year}
                  events={events?.[year]?.[weekIndex] ?? []}
                  selectedDate={selectedDate}
                  showNewMonth={false}
                />
              </>
            )}
            {!monthChange && (
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
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default YearCalendarGrid;