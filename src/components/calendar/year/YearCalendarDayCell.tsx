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
  const getImageSrc = (eventType: string) => {
    switch (eventType) {
      case "HOMEWORK":
        return "https://res.cloudinary.com/dqdn7bvwq/image/upload/v1743445784/lwtutjwofarsx3wo1ysg.png";
      case "TEST":
        return "https://res.cloudinary.com/dqdn7bvwq/image/upload/v1743445785/iu91mrczyfwjxecqzljn.png";
      case "MISC":
        return "https://res.cloudinary.com/dqdn7bvwq/image/upload/v1743445787/cm3gsfxgdvfjqwyq6zm7.png";
      default:
        return "";
    }
  };

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
              className="flex items-center justify-center w-[29%] aspect-square  rounded-2xl hover:border-double  self-start"
              style={{ borderWidth: "0.05rem" }}
            >
           <img src={getImageSrc(event.type)} alt={event.type} />
            </button>
          ))}
        </div>
      )}
    </CalendarCellWrapper>
  );
};

export default YearCalendarDayCell;