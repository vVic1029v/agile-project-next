'use client';

import { useState, useCallback, useMemo, ReactNode } from "react";
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

  const monthOptions = useMemo(() => monthNames.map((month, index) => ({
    name: month,
    value: index.toString(),
  })), []);

  const handleYearChange = (offset: number) => {
    const newYear = selectedDate.year + offset;
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

  const closeModal = useMemo(() => () => {
    updateYearUrl(selectedDate.year);
    setIsModalOpen(false);
  }, [selectedDate.year, updateYearUrl, setIsModalOpen]);

  const handleTodayClick = () => {
    const todayDate = getToday();
    setSelectedDate(todayDate);
    updateYearUrl(todayDate.year);
  };

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
          onTodayClick={handleTodayClick}
          onPrevYear={() => handleYearChange(-1)}
          onNextYear={() => handleYearChange(1)}
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