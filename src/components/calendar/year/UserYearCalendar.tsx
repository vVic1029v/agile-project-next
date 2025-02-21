'use client';

import { useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { YearCalendar } from "@/components/calendar/year/YearCalendar";
import { monthNames } from "@/lib/calendarUtils";
import YearCalendarHeader from "@/components/calendar/year/YearCalendarHeader";
import { useCalendarContext } from "../CalendarProvider";
import { ModalOverlay } from "@/components/ModalOverlay";
import CalendarDayModal from "../event-modal/CalendarDayModal";
import CalendarContainter from "../CalendarContainer";
import { getToday, SelectedDate, useCalendarState } from "../useCalendarState";

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}

export default function UserYearCalendar() {
  const { events, courses } = useCalendarContext();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { selectedDate, setSelectedDate, updateUrl: updateYearUrl, isModalOpen, setIsModalOpen } = useCalendarState(false);

  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: index.toString(),
  }));

  const handlePrevYear = () => {
    const newYear = selectedDate.year - 1;
    setSelectedDate((prev) => ({ ...prev, year: newYear }));
    updateYearUrl(newYear);
  };

  const handleNextYear = () => {
    const newYear = selectedDate.year + 1;
    setSelectedDate((prev) => ({ ...prev, year: newYear }));
    updateYearUrl(newYear);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedDate((prev) => ({ ...prev, month: monthIndex }));
  };

  const handleDayClick = useCallback(
    (selected: SelectedDate) => {
      if (!userId) return;
      const { day, month, year } = selected;
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      updateYearUrl(year, undefined, { date: dateString });
      setSelectedDate(selected);
      setIsModalOpen(true);
    },
    [userId, updateYearUrl, setSelectedDate, setIsModalOpen]
  );

  const closeModal = useCallback(() => {
    updateYearUrl(selectedDate.year);
    setIsModalOpen(false);
  }, [selectedDate.year, updateYearUrl, setIsModalOpen]);

  if (status === "loading" || !userId) return null;

  return (
    <div>
      <ModalOverlay onClose={closeModal} isOpen={isModalOpen}>
        <CalendarDayModal selectedDate={selectedDate} events={events} />
      </ModalOverlay>

      <YearCalendarContainer isModalOpen={isModalOpen}>
        <YearCalendarHeader
          selectedDay={selectedDate}
          monthOptions={monthOptions}
          onMonthChange={handleMonthChange}
          onTodayClick={() => {
            const todayDate = getToday();
            setSelectedDate(todayDate);
            updateYearUrl(todayDate.year);
          }}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
        />
        <YearCalendar selectedDay={selectedDate} onClick={handleDayClick} events={events} />
      </YearCalendarContainer>
    </div>
  );
}

const YearCalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <CalendarContainter isModalOpen={isModalOpen}>
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
      <div className="w-full px-[5vw] pt-4">{children}</div>
    </div>
  </CalendarContainter>
);