'use client';

import { useState, useCallback, useMemo, ReactNode, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { YearCalendar } from "@/components/calendar/year/YearCalendar";
import { getWeekStartDateFromYearWeek, monthNames } from "@/lib/calendarUtils";
import YearCalendarHeader from "@/components/calendar/year/YearCalendarHeader";
import { useCalendarContext } from "../CalendarProvider";
import { ModalOverlay } from "@/components/ModalOverlay";
import CalendarDayModal from "../event-modal/CalendarDayModal";
import CalendarContainter from "../CalendarContainer";
import { getToday, SelectedDate } from "../useCalendarState";
import { useCalendarStateContext } from "../CalendarStateProvider";
import ScrollPanels, { ScrollPanelsRef } from "@/components/calendar/calendar-page/ScrollPanels";

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}

export default function UserYearCalendar() {
  const { events, courses } = useCalendarContext();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const scrollPanelsRef = useRef<ScrollPanelsRef>(null);
  const { selectedDate, setSelectedDate, isModalOpen, setIsModalOpen, updateUrl } = useCalendarStateContext();
  console.log(selectedDate)

  const [monthHeaders, setMonthHeaders] = useState(true);

  const monthOptions = useMemo(() => monthNames.map((month, index) => ({
    name: month,
    value: index.toString(),
  })), []);

  const handleYearChange = (offset: number) => {
    const newYear = selectedDate.year + offset;
    setSelectedDate((prev) => ({ ...prev, year: newYear }));
    updateUrl(newYear);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedDate((prev) => ({ ...prev, month: monthIndex }));
  };

  useEffect(() => {
    if (scrollPanelsRef.current) {
      // Now you can safely use the ref
      scrollPanelsRef.current.scrollToPanel(selectedDate.week - 1);
    }
  }, [scrollPanelsRef, selectedDate.week]);
  
  const handleSelectedDayChange = useCallback(
    (selected: SelectedDate, openModal: boolean) => {
      if (!userId) return;
      const { day, month, year } = selected;
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      updateUrl(year, undefined, { date: dateString });
      setSelectedDate(selected);
      if (openModal) setIsModalOpen(true);
    },
    [userId, updateUrl, setSelectedDate, setIsModalOpen]
  );

  const handleSelectedWeekChange = useCallback(
    (selected: SelectedDate, openModal: boolean) => {
      if (!userId) return;
      const { year, week } = selected;
  
      updateUrl(year, week);
      setSelectedDate(selected);
      if (openModal) setIsModalOpen(true);
  
      if (scrollPanelsRef.current) {
        console.log(`Scrolling to panel: ${week - 1}`); // Debugging
        scrollPanelsRef.current.scrollToPanel(week - 1);
      } else {
        console.warn('ScrollPanelsRef is null');
      }
    },
    [userId, updateUrl, setSelectedDate, setIsModalOpen]
  );
  
  
  const closeModal = useMemo(() => () => {
    updateUrl(selectedDate.year);
    setIsModalOpen(false);
  }, [selectedDate.year, updateUrl, setIsModalOpen]);

  const handleTodayClick = () => {
    const todayDate = getToday();
    setSelectedDate(todayDate);
    updateUrl(todayDate.year, todayDate.week);
  };

  const handleShowMonthHeadersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonthHeaders(event.target.checked);
  };

  if (status === "loading" || !userId) return null;

  return (
    <>
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
          onShowMonthHeadersChange={handleShowMonthHeadersChange}
          monthHeaders={monthHeaders}
        />
        <YearCalendar selectedDay={selectedDate} onDayClick={handleSelectedDayChange} onWeekClick={handleSelectedWeekChange} events={events} monthHeaders={monthHeaders} />
      </YearCalendarContainer>
    </>
  );
}

const YearCalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <CalendarContainter isModalOpen={isModalOpen}>
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 overflow-visible">
      <div className="w-full pl-[5vw] overflow-visible">{children}</div>
    </div>
  </CalendarContainter>
);