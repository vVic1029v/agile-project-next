import React, { useMemo, useState } from 'react';
import { monthNames } from '@/lib/calendarUtils';
import type { DayObj } from '@/lib/calendarUtils';
import { DayCell } from '@/lib/database/getCalendarData';
import { SelectedDate } from '../useCalendarState';
import CalendarCellWrapper from '../CalendarCellWrapper';

export interface YearDayCellProps {
  dayObj: DayObj;
  index: number;
  isNewMonth: boolean;
  isToday: boolean;
  onClick: (selected: SelectedDate, openModal: boolean) => void;
  dayRefs: React.RefObject<(HTMLDivElement | null)[]>;
  year: number;
  dayWeek: number;
  dayEvents: DayCell;
  isBlank?: boolean;
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
  isBlank = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const modalTimeSlotCells = useMemo(() => Object.values(dayEvents).flatMap(timeSlotCell => timeSlotCell), [dayEvents]);

  const handleClick = () => {
      onClick({
        day: dayObj.day,
        month: dayObj.month,
        year: year,
        week: dayObj.week,
        dayWeek: dayWeek,
      }, true);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <CalendarCellWrapper
      onClick={handleClick}
      isBlank={isBlank}
      dayWeek={dayWeek}
      dayRefs={dayRefs}
      index={index}
      dayObj={dayObj}
      isToday={isToday}
      isNewMonth={isNewMonth}
      monthNames={monthNames}
    >
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
              onClick={handleButtonClick}
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
    </CalendarCellWrapper>
  );
};

export default YearCalendarDayCell;