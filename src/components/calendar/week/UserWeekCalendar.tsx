'use client';

import React, { useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useCalendarContext } from "../CalendarProvider";
import { ModalOverlay } from "@/components/ModalOverlay";
import WeekCalendarHeader from "@/components/calendar/week/WeekCalendarHeader";
import WeekCalendar from "@/components/calendar/week/WeekCalendar";
import CalendarDayModal from "../event-modal/CalendarDayModal";
import CalendarContainter from "../CalendarContainer";
import { getWeekAndDay, getWeeksInYear } from "@/lib/calendarUtils";
import { getToday, SelectedDate, useCalendarState } from "../useCalendarState";
import { useCalendarStateContext } from "../CalendarStateProvider";
import EventFormModal from "@/components/EventFormModal";
import { Modal } from "@/components/Modal";

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}

export default function UserWeekCalendar() {
  const { events, courses } = useCalendarContext();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { selectedDate, setSelectedDate, updateUrl, isModalOpen, setIsModalOpen } = useCalendarStateContext();
  
  const handleCellClick = useCallback(
    (date: SelectedDate) => {
      const dateString = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day+1).padStart(2, "0")}`;
      const weekAndDay = getWeekAndDay(date.year, date.month + 1, date.day+1);
      updateUrl(date.year, weekAndDay.week, { date: dateString });
      setSelectedDate({ ...date, week: weekAndDay.week });
      setIsModalOpen(true);
    },
    [updateUrl, setIsModalOpen, setSelectedDate]
  );
  
  const closeModal = useCallback(() => {
    updateUrl(selectedDate.year, selectedDate.week);
    setIsModalOpen(false);
  }, [selectedDate.year, selectedDate.week, updateUrl, setIsModalOpen]);
  
  const handlePrevWeek = () => {
    let newWeek = selectedDate.week - 1;
    let newYear = selectedDate.year;
    if (newWeek < 0) {
      newYear = selectedDate.year - 1;
      newWeek = getWeeksInYear(newYear) - 1;
    }
    setSelectedDate((prev) => ({ ...prev, year: newYear, week: newWeek }));
    updateUrl(newYear, newWeek);
  };
  
  const handleNextWeek = () => {
    let newWeek = selectedDate.week + 1;
    let newYear = selectedDate.year;
    if (newWeek >= getWeeksInYear(selectedDate.year)) {
      newYear = selectedDate.year + 1;
      newWeek = 0;
    }
    setSelectedDate((prev) => ({ ...prev, year: newYear, week: newWeek }));
    updateUrl(newYear, newWeek);
  };
  
  const handleTodayClick = () => {
    const todayDate = getToday();
    setSelectedDate(todayDate);
    updateUrl(todayDate.year, todayDate.week);
  };

  const weekEvents = events[selectedDate.year]?.[selectedDate.week];

  if (status === "loading" || !userId) return null;

  return (
    <>
    
    {isModalOpen && (
      <Modal isOpen={isModalOpen} onClose={closeModal} children={
        <EventFormModal onClose={closeModal} selectedDate={selectedDate} />
      }>
      
      </Modal>
  
    )}
  
      <WeekCalendarContainer isModalOpen={isModalOpen}>
        <WeekCalendarHeader
          selectedDate={selectedDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onTodayClick={handleTodayClick}
        />
        <WeekCalendar onClick={handleCellClick} events={weekEvents} courses={courses} selectedDate={selectedDate} />
      </WeekCalendarContainer>
    </>
  );
}

const WeekCalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <CalendarContainter isModalOpen={isModalOpen}>
    <div className="w-full px-[0vw] ">{children}</div>
  </CalendarContainter>
);