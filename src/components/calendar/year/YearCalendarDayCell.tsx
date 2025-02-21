import React from 'react';
import { monthNames } from '@/lib/calendarUtils';
import type { DayObj } from '@/lib/calendarUtils';
import { DayCell } from '@/lib/getCalendarData';
import { SelectedDate } from '../useCalendarState';

export interface YearDayCellProps {
  dayObj: DayObj;
  index: number;
  isNewMonth: boolean;
  isToday: boolean;
  onClick: (selected: SelectedDate) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  year: number;
  dayWeek: number;
  dayEvents: DayCell;
}

const YearCalendarDayCell: React.FC<YearDayCellProps> = ({
  dayObj,
  index,
  isNewMonth,
  isToday,
  onClick,
  dayRefs,
  year,
  dayWeek,
  dayEvents,
}) => {

  // console.log("Day events", dayEvents, selectedDate.year, selectedDate.week, selectedDate.dayWeek);
  const modalTimeSlotCells = Object.values(dayEvents).flatMap(timeSlotCell => timeSlotCell);
  return (
    <div
      ref={(el) => {
        dayRefs.current[index] = el;
      }}
      data-month={dayObj.month}
      data-day={dayObj.day}
      onClick={() =>
      {
        onClick({
          day: dayObj.day,
          month: dayObj.month,
          year: year,
          week: dayObj.week,
          dayWeek: dayWeek,
        })
        // console.log("CLICKED", {
        //   day: dayObj.day,
        //   month: dayObj.month,
        //   year: year,
        //   week: dayObj.week,
        //   dayWeek: dayWeek,
        // })
      }
      }
      className="relative z-10 m-[-0.5px] group aspect-square w-full grow cursor-pointer border-2 font-medium transition-all hover:z-20 hover:border-cyan-400 rounded-3xl size-[15vh]"
    >
      <span
        className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${
          isToday ? 'bg-blue-500 font-semibold text-white' : ''
        } ${dayObj.month < 0 ? 'text-slate-400' : 'text-slate-800'}`}
      >
        {dayObj.day}
      </span>
      {isNewMonth && (
        <span className="absolute bottom-0.5 left-0 w-full truncate px-1.5 text-sm font-semibold text-slate-300 sm:bottom-0 sm:text-lg lg:bottom-2.5 lg:left-3.5 lg:-mb-1 lg:w-fit lg:px-0 lg:text-xl 2xl:mb-[-4px] 2xl:text-2xl">
          {monthNames[dayObj.month]}
        </span>
      )}
      {/* Plus Icon Button – stops propagation so it does not trigger the day click */}
      <button
        type="button"
        onClick={(e) => {e.stopPropagation()}}
        className="flex absolute right-2 top-2 rounded-full opacity-0 transition-all focus:opacity-100 group-hover:opacity-100 z-50"
      >
        <svg
          className="size-8 scale-90 text-blue-500 transition-all hover:scale-100 group-focus:scale-100"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {/* Render event icons – each stops propagation */}
      {modalTimeSlotCells && modalTimeSlotCells.length > 0 && (
        <div
          className="absolute bottom-[-2px] flex flex-wrap-reverse flex-row-reverse overflow-hidden w-[100%] h-[90%] justify-start p-2 content-start"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 50%, transparent 80%)",
            maskImage: "linear-gradient(to top, black 50%, transparent 80%)",
          }}
        >
          {modalTimeSlotCells.flatMap((timeSlotCell, idx) => timeSlotCell.events).map((event, idx) => (
            <button
              key={idx}
              onClick={(e) => {e.stopPropagation(); console.log("STOPPED")}}
              className="flex items-center justify-center w-[25%] aspect-square bg-gradient-to-bl from-cyan-500 to-blue-500 rounded-2xl hover:border-double border-white self-start"
              style={{ borderWidth: "0.2rem" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="m-auto"
              >
                <path d="M12 2a10 10 0 1 1-10 10A10 10 0 0 1 12 2zm0 18a8 8 0 1 0-8-8 8 8 0 0 0 8 8zm1-13h-2v6h6v-2h-4z" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default YearCalendarDayCell;
