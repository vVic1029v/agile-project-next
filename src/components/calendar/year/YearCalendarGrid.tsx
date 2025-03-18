import React, { useMemo, useEffect } from 'react';
import YearCalendarRow from './YearCalendarRow';
import { getDaysInYear, chunkDaysIntoWeeks, monthNames } from '@/lib/calendarUtils';
import { StructuredEvents } from '@/lib/database/getCalendarData';
import { SelectedDate } from '../useCalendarState';
import AnimatedHeader from '@/components/Common/Headers/AnimatedHeader';

export interface YearCalendarGridProps {
  year: number;
  onDayClick: (selected: SelectedDate, openModal: boolean) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  events?: StructuredEvents;
  selectedDate : SelectedDate;
  monthHeaders?: boolean;
}

const YearCalendarGrid: React.FC<YearCalendarGridProps> = ({ 
  year, 
  onDayClick, 
  dayRefs, 
  events, 
  selectedDate,
  monthHeaders = false
}) => {
  const days = useMemo(() => getDaysInYear(year), [year]);
  const weeks = useMemo(() => chunkDaysIntoWeeks(days), [days]);

  if (monthHeaders) {
    return (
      <>
        {weeks.map((week, weekIndex) => {
          const monthChangeIndex = week.findIndex((day, dayIndex) => dayIndex > 0 && day.month !== week[dayIndex - 1].month);
          const monthChange = monthChangeIndex !== -1 || (weekIndex > 0 && week[0].month !== weeks[weekIndex - 1][6].month);
          return (
            <React.Fragment key={weekIndex}>
              {monthChange && (
                <>
                  {monthChangeIndex !== -1 && weekIndex !== 0 && (
                    <YearCalendarRow
                      key={`${weekIndex}-first`}
                      week={[...week.slice(0, monthChangeIndex), ...Array(7 - monthChangeIndex).fill({ month: -1, week: weekIndex, day: 0 })]}
                      weekIndex={weekIndex}
                      days={days}
                      selectedDate={selectedDate}
                      onClick={onDayClick}
                      dayRefs={dayRefs}
                      year={year}
                      events={events?.[year]?.[weekIndex] ?? []}
                      showNewMonth={false}
                    />
                  )}
                  
                  {!(weekIndex > 1 && weeks[weekIndex][6].month === 0) && (
                    <>
                    <div className="flex justify-center py-10" style={{ top: 100, backgroundColor: 'transparent', zIndex: 20 }}> {/* position: 'sticky', */}
                      <AnimatedHeader text={monthNames[week[monthChangeIndex !== -1 ? monthChangeIndex : 0].month]} />
                    </div>
                    <YearCalendarRow
                      key={`${weekIndex}-second`}
                      week={[...Array(monthChangeIndex !== -1 ? monthChangeIndex : 0).fill({ month: -1, week: weekIndex, day: 0 }), ...week.slice(monthChangeIndex !== -1 ? monthChangeIndex : 0)]}
                      weekIndex={weekIndex}
                      days={days}
                      selectedDate={selectedDate}
                      onClick={onDayClick}
                      dayRefs={dayRefs}
                      year={year}
                      events={events?.[year]?.[weekIndex] ?? []}
                      showNewMonth={false}
                    />
                    </>
                  )}
                </>
              )}
              {!monthChange && weekIndex !== 0 && (
                <YearCalendarRow
                  key={weekIndex}
                  week={week}
                  weekIndex={weekIndex}
                  days={days}
                  selectedDate={selectedDate}
                  onClick={onDayClick}
                  dayRefs={dayRefs}
                  year={year}
                  events={events?.[year]?.[weekIndex] ?? []}
                  showNewMonth={false}
                />
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  } else {
    return (
      <>
        {weeks.map((week, weekIndex) => (
          <YearCalendarRow
            key={weekIndex}
            week={week}
            weekIndex={weekIndex}
            days={days}
            selectedDate={selectedDate}
            onClick={onDayClick}
            dayRefs={dayRefs}
            year={year}
            events={events?.[year]?.[weekIndex] ?? []}
          />
        ))}
      </>
    );
  }
};

export default YearCalendarGrid;