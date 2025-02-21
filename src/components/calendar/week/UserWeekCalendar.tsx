'use client';

import React, { useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useCalendarContext } from "../CalendarProvider";
import { ModalOverlay } from "@/components/ModalOverlay";
import WeekCalendarHeader from "@/components/calendar/week/WeekCalendarHeader";
import WeekCalendar from "@/components/calendar/week/WeekCalendar";
import CalendarDayModal from "../event-modal/CalendarDayModal";
import CalendarContainter from "../CalendarContainer";
import { useCalendarState } from "../useCalendarState";
import { getWeekAndDay, getWeeksInYear, getWeekStartDate, getWeekStartDateFromYearWeek } from "@/lib/calendarUtils";

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}

export default function UserWeekCalendar() {
  const { timeCells, courses } = useCalendarContext();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { selectedDate, setSelectedDate, weekStart, setWeekStart, updateUrl: updateWeekUrl } = useCalendarState(true);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCellClick = useCallback(
    (date: Date, timeSlot: number, dayIndex: number) => {
      if (!userId) return;
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const { week, dayWeek: computedDayWeek } = getWeekAndDay(year, month + 1, day);
      updateWeekUrl(year, week - 1, { date: dateString });
      setSelectedDate({ day, month, year, week: week - 1, dayWeek: computedDayWeek, timeSlot });
      setIsModalOpen(true);
    },
    [userId, updateWeekUrl]
  );

  const closeModal = useCallback(() => {
    updateWeekUrl(selectedDate.year, selectedDate.week);
    setIsModalOpen(false);
  }, [selectedDate.year, selectedDate.week, updateWeekUrl]);

  const handlePrevWeek = () => {
    let newWeek = selectedDate.week - 1;
    let newYear = selectedDate.year;
    if (newWeek < 0) {
      newYear = selectedDate.year - 1;
      newWeek = getWeeksInYear(newYear) - 1;
    }
    setSelectedDate((prev) => ({ ...prev, year: newYear, week: newWeek }));
    setWeekStart(getWeekStartDateFromYearWeek(newYear, newWeek));
    updateWeekUrl(newYear, newWeek);
  };

  const handleNextWeek = () => {
    let newWeek = selectedDate.week + 1;
    let newYear = selectedDate.year;
    if (newWeek >= getWeeksInYear(selectedDate.year)) {
      newYear = selectedDate.year + 1;
      newWeek = 0;
    }
    setSelectedDate((prev) => ({ ...prev, year: newYear, week: newWeek }));
    setWeekStart(getWeekStartDateFromYearWeek(newYear, newWeek));
    updateWeekUrl(newYear, newWeek);
  };

  const handleTodayClick = () => {
    const now = new Date();
    const newYear = now.getFullYear();
    const { week } = getWeekAndDay(newYear, now.getMonth() + 1, now.getDate());
    const newWeek = week - 1;
    setSelectedDate((prev) => ({ ...prev, year: newYear, week: newWeek }));
    setWeekStart(getWeekStartDate(now));
    updateWeekUrl(newYear, newWeek);
  };

  const weekEvents = timeCells[selectedDate.year]?.[selectedDate.week] || [null, null, null, null, null, null, null];

  if (status === "loading" || !userId) return null;

  return (
    <div>
      <ModalOverlay onClose={closeModal} isOpen={isModalOpen}>
        <CalendarDayModal selectedDate={selectedDate} timeCells={timeCells} />
      </ModalOverlay>
      <WeekCalendarContainer isModalOpen={isModalOpen}>
        <WeekCalendarHeader
          selectedDate={selectedDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onTodayClick={handleTodayClick}
        />
        <WeekCalendar onClick={handleCellClick} events={weekEvents} weekStart={weekStart} selectedDate={selectedDate} />
      </WeekCalendarContainer>
    </div>
  );
}

const WeekCalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <CalendarContainter isModalOpen={isModalOpen}>
    <div className="w-full px-[5vw] pt-4">{children}</div>
  </CalendarContainter>
);