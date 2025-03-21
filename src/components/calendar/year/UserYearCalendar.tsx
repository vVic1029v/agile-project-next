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
import { getToday, SelectedDate } from "../useCalendarState";
import { useCalendarStateContext } from "../CalendarStateProvider";

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}

export default function UserYearCalendar() {
  const { events, courses } = useCalendarContext();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const { selectedDate, setSelectedDate, isModalOpen, setIsModalOpen, updateUrl: updateYearUrl } = useCalendarStateContext();

  const [monthHeaders, setMonthHeaders] = useState(true);

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

  const handleSelectedDayChange = useCallback(
    (selected: SelectedDate, openModal: boolean) => {
      if (!userId) return;
      const { day, month, year } = selected;
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      updateYearUrl(year, undefined, { date: dateString });
      setSelectedDate(selected);
      if (openModal) setIsModalOpen(true);
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
        <YearCalendar selectedDay={selectedDate} onClick={handleSelectedDayChange} events={events} monthHeaders={monthHeaders} />
      </YearCalendarContainer>
    </>
  );
}

const YearCalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <CalendarContainter isModalOpen={isModalOpen}>
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
      <div className="w-full p-[0vw]">{children}</div>
    </div>
  </CalendarContainter>
);