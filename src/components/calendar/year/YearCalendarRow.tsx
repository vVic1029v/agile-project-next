import React, { useMemo } from 'react';
import YearCalendarDayCell from './YearCalendarDayCell';
import type { DayObj } from '@/lib/calendarUtils';
import { useRouter, useSearchParams } from "next/navigation";
import { DayCell, WeekCell } from '@/lib/database/getCalendarData';
import { SelectedDate } from '../useCalendarState';

export interface YearCalendarRowProps {
  week: DayObj[];
  weekIndex: number;
  days: DayObj[];
  onDayClick: (selected: SelectedDate) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  year: number;
  events?: WeekCell;
  selectedDate:SelectedDate
}

const YearCalendarRow: React.FC<YearCalendarRowProps> = ({
  week,
  weekIndex,
  days,
  onDayClick,
  dayRefs,
  year,
  events,
  selectedDate
}) => {
  const now = useMemo(() => new Date(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Helper function to navigate to a specific week on /calendar/week.
  const goToWeek = (weekIdx: number) => {
    // Convert the 0-indexed week to a 1-indexed string and pad it.
    const weekStr = String(weekIdx + 1).padStart(2, "0");
    const newSearch = new URLSearchParams(searchParams.toString());
    newSearch.set("year", String(year));
    newSearch.set("week", `W${weekStr}`);
    newSearch.delete("date"); // Remove the "date" parameter if it exists.
    router.push(`/calendar/week?${newSearch.toString()}`, { scroll: false });
  };

  return (
    <div className="relative flex w-full items-center z- [-50]" key={`week-${weekIndex}`}>
      <button
        type="button"
        style={{
          WebkitMaskImage: "linear-gradient(to left, black 1%, transparent 50%)",
          maskImage: "linear-gradient(to left, black 1%, transparent 50%)",
        }}
        className="absolute left-0 -translate-x-full m-[-0.5px] group aspect-square grow cursor-pointer border font-medium transition-all opacity-20 w-30 hover:z-20 hover:border-cyan-400 hover:opacity-100 sm:-m-px sm:border-2 rounded-3xl size-[15vh]"
        onClick={() => goToWeek(weekIndex)}
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
              selectedDate={selectedDate}
              
            />
          );
        })}
      </div>
    </div>
  );
};

export default YearCalendarRow;