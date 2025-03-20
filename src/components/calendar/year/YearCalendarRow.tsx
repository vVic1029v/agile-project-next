import React, { useMemo } from 'react';
import YearCalendarDayCell from './YearCalendarDayCell';
import { getWeekStartDateFromYearWeek, type DayObj } from '@/lib/calendarUtils';
import { useRouter, useSearchParams } from "next/navigation";
import { DayCell, WeekCell } from '@/lib/database/getCalendarData';
import { SelectedDate } from '../useCalendarState';

export interface YearCalendarRowProps {
  week: DayObj[];
  weekIndex: number;
  days: DayObj[];
  selectedDate : SelectedDate
  onDayClick: (selected: SelectedDate, openModal: boolean) => void;
  onWeekClick: (selected: SelectedDate, openModal: boolean) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  year: number;
  events?: WeekCell;
  showNewMonth?: boolean;
}

const YearCalendarRow: React.FC<YearCalendarRowProps> = ({
  week,
  weekIndex,
  days,
  selectedDate,
  onDayClick,
  onWeekClick,
  dayRefs,
  year,
  events,
  showNewMonth = true,
}) => {
  const now = useMemo(() => new Date(), []);

  // Check if the current week includes the selected date
  const isSelectedWeek = week.some(
    (dayObj) =>
      dayObj.day === selectedDate.day && dayObj.month === selectedDate.month
  );

  const goToWeek = (weekIdx: number) => {
    const idx = (week[0].day === -1) ? 6 : 0
    onWeekClick(
      {
        day: week[idx].day,
        month: week[idx].month,
        year: year,
        week: weekIdx,
        dayWeek: idx
      },
      false
    );
  };

  return (
    <div
      className={`relative items-center -mx-[-0px] flex overflow-visible ${
        isSelectedWeek ? "bg-blue-100" : ""
      }`} // Highlight the row if it's the selected week
      key={`week-${weekIndex}`}
    >
      <button
        type="button"
        style={{
          WebkitMaskImage: "linear-gradient(to left, black 1%, transparent 50%)",
          maskImage: "linear-gradient(to left, black 1%, transparent 50%)",
        }}
        className="absolute left-0 -translate-x-full m-[-0.5px] group aspect-square h-full cursor-pointer border-2 font-medium transition-all opacity-20 hover:z-20 hover:border-cyan-400 hover:opacity-100 rounded-3xl"
        onClick={() => goToWeek(weekIndex)}
      >
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl"
          style={{
            writingMode: "vertical-lr",
            textOrientation: "sideways",
            height: "100%",
          }}
        >
          Week {weekIndex + 1}
        </span>
      </button>
      <div className="flex w-full">
        {week.map((dayObj, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isNewMonth =
            showNewMonth &&
            (index === 0 || days[index - 1].month !== dayObj.month);
          const isToday =
            dayObj.month === now.getMonth() &&
            dayObj.day === now.getDate() &&
            now.getFullYear() === year;
          const dayEvents: DayCell = events?.[dayIndex] ?? {};

          return (
            <YearCalendarDayCell
              key={`${dayObj.month}-${dayObj.day}-${index}`}
              dayObj={dayObj}
              index={index}
              isNewMonth={isNewMonth}
              isToday={isToday}
              onClick={onDayClick}
              dayRefs={dayRefs}
              year={year}
              dayWeek={dayIndex}
              dayEvents={dayEvents}
              isBlank={dayObj.month === -1 || dayObj.month === 12}
            />
          );
        })}
      </div>
    </div>
  );
};

export default YearCalendarRow;