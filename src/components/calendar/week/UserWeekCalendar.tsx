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
import { getToday, SelectedDate } from "../useCalendarState";
import { useCalendarStateContext } from "../CalendarStateProvider";
import EventFormModal from "@/components/EventFormModal";
import { Modal } from "@/components/Modal";
import DayEventsModal from "@/components/DayEventsModal";

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}
export interface Event {
  id: string;
  title: string;
  type: string;
  courseId: string;
  timeSlot: TimeSlot;
  dayOfWeek: number; // Poți elimina această linie dacă folosești doar `timeSlot.dayOfWeek`
  yearNumber: number;  // ✅ Adăugat
  weekNumber: number; 
  description : string; // ✅ Adăugat
}
export interface TimeSlot {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  dayOfWeek: number; // Assuming this is the day in the week (from 0 to 6)
}
type WeekEvents = Record<number, Event[]>;
type YearEvents = Record<number, WeekEvents>;

type EventsContextType = {
  events: Record<number, YearEvents>;
  courses: any;
};

export default function UserWeekCalendar() {
  const { events, courses } = useCalendarContext() as unknown as EventsContextType;
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { selectedDate, setSelectedDate, updateUrl, isModalOpen, setIsModalOpen } = useCalendarStateContext();
  const [modalDayEvents, setModalDayEvents] = useState<Event[]>([]);
  const handleCellClick = useCallback(
    (date: SelectedDate) => {
      const dateString = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day + 1).padStart(2, "0")}`;
      const weekAndDay = getWeekAndDay(date.year, date.month + 1, date.day + 1);
      updateUrl(date.year, weekAndDay.week, { date: dateString });
      setSelectedDate({ ...date, week: weekAndDay.week });
      setModalDayEvents(dayEvents); 
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

  const weekEvents: WeekEvents = events?.[selectedDate.year]?.[selectedDate.week] ?? {};
  const dayEvents: Event[] = Array.isArray(weekEvents[selectedDate.day]) ? weekEvents[selectedDate.day] : [];
  
  if (status === "loading" || !userId) return null;

  return (
    <>
      <WeekCalendarContainer isModalOpen={isModalOpen}>
        <WeekCalendarHeader
          selectedDate={selectedDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onTodayClick={handleTodayClick}
        />
        <WeekCalendar onClick={handleCellClick} courses={courses} selectedDate={selectedDate} />
      </WeekCalendarContainer>
  {/* Aici se deschide DayEventsModal cu evenimentele zilei selectate */}
  <DayEventsModal 
        selectedDate={selectedDate} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        events={modalDayEvents} // Transmiterea evenimentelor pentru ziua respectivă
      />
    </>
  );
}

const WeekCalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <CalendarContainter isModalOpen={isModalOpen}>
    <div className="w-full px-[0vw] ">{children}</div>
  </CalendarContainter>
);
