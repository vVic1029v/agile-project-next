'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import WeekCalendar from "./WeekCalendar";
import WeekCalendarHeader from "./WeekCalendarHeader";
import CalendarDayModal from "../CalendarDayModal";
import { useCalendar } from "../useCalendar";
import { getWeekAndDay, getWeekStartDate, getWeeksInYear, getWeekStartDateFromYearWeek } from "@/lib/calendarUtils";
import type { ReactNode } from "react";

interface SelectedWeekDate {
  dayMonth: number;
  month: number;
  year: number;
  week: number;
  dayWeek: number;
  timeSlot: number;
}

interface ModalOverlayProps {
  children: ReactNode;
  onClose: () => void;
}

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}

export default function UserWeekCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // Initialize the current week based on today.
  const today = new Date();
  const initialYear = today.getFullYear();
  const { week, dayWeek } = getWeekAndDay(initialYear, today.getMonth() + 1, today.getDate());
  const initialWeek = week - 1; // we use 0-indexed weeks internally

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<SelectedWeekDate | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(initialYear);
  const [currentWeek, setCurrentWeek] = useState<number>(initialWeek);
  const [weekStart, setWeekStart] = useState<Date>(getWeekStartDate(today));

  const { timeCells } = useCalendar(userId);

  // If a query param “date” is present, open the modal for that day.
  useEffect(() => {
    if (!userId) return;

    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const { week, dayWeek } = getWeekAndDay(year, month, day);
      console.log(week)
      setSelectedDate({ dayMonth: day, month: month - 1, year, week: week - 1, dayWeek, timeSlot: 0 });
      setIsModalOpen(true);
      // Also update the week view to match the query date.
      setCurrentYear(year);
      setCurrentWeek(week - 1);
      setWeekStart(getWeekStartDate(new Date(year, month - 1, day)));
    }
  }, [searchParams, userId]);

  const handleCellClick = useCallback(
    (date: Date, timeSlot: number, dayIndex: number) => {
      if (!userId) return;
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      router.push(`${pathname}?date=${dateString}`, { scroll: false });
      const { week, dayWeek: computedDayWeek } = getWeekAndDay(year, month + 1, day);
      setSelectedDate({ dayMonth: day, month, year, week: week - 1, dayWeek: computedDayWeek, timeSlot });
      setIsModalOpen(true);
    },
    [userId, router, pathname]
  );

  const closeModal = useCallback(() => {
    router.push(pathname, { scroll: false });
    setIsModalOpen(false);
  }, [router, pathname]);

  // Navigation handlers for week view.
  const handlePrevWeek = () => {
    let newWeek = currentWeek - 1;
    let newYear = currentYear;
    if (newWeek < 0) {
      newYear = currentYear - 1;
      newWeek = getWeeksInYear(newYear) - 1;
    }
    setCurrentYear(newYear);
    setCurrentWeek(newWeek);
    setWeekStart(getWeekStartDateFromYearWeek(newYear, newWeek));
  };

  const handleNextWeek = () => {
    let newWeek = currentWeek + 1;
    let newYear = currentYear;
    if (newWeek >= getWeeksInYear(currentYear)) {
      newYear = currentYear + 1;
      newWeek = 0;
    }
    setCurrentYear(newYear);
    setCurrentWeek(newWeek);
    setWeekStart(getWeekStartDateFromYearWeek(newYear, newWeek));
  };

  const handleTodayClick = () => {
    const now = new Date();
    const newYear = now.getFullYear();
    const { week } = getWeekAndDay(newYear, now.getMonth() + 1, now.getDate());
    setCurrentYear(newYear);
    setCurrentWeek(week - 1);
    setWeekStart(getWeekStartDate(now));
  };

  // For the given currentYear and currentWeek, get the corresponding WeekCell.
  const weekEvents = timeCells[currentYear]?.[currentWeek] || [null, null, null, null, null, null, null];

  if (status === "loading" || !userId) return null;

  return (
    <div>
      {isModalOpen && selectedDate && (
        <ModalOverlay onClose={closeModal}>
          <CalendarDayModal selectedDate={selectedDate} timeCells={timeCells} />
        </ModalOverlay>
      )}
      <CalendarContainer isModalOpen={isModalOpen}>
        <WeekCalendarHeader
          currentYear={currentYear}
          currentWeek={currentWeek}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onTodayClick={handleTodayClick}
        />
        <WeekCalendar
          onClick={handleCellClick}
          events={weekEvents}
          weekStart={weekStart}
          currentYear={currentYear}
          currentWeek={currentWeek}
        />
      </CalendarContainer>
    </div>
  );
}

const ModalOverlay = ({ children, onClose }: ModalOverlayProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const CalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <div
    className={`relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center ${
      isModalOpen ? "pointer-events-none" : ""
    }`}
  >
    <div className="relative h-full w-full overflow-auto mt-10">{children}</div>
  </div>
);
