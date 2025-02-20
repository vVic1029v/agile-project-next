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
import { getToday } from "../annual-calendar/UserYearCalendar";

export interface SelectedWeekDate {
  day: number;
  month: number;
  year: number;
  week: number;
  dayWeek: number;
  timeSlot?: number;
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

  // Initialize week state based on URL parameters or fallback to today
  const today = new Date();
  const yearParam = searchParams.get("year");
  const weekParam = searchParams.get("week");

  const initialYear = yearParam ? Number(yearParam) : today.getFullYear();
  const initialWeek = weekParam
    ? Number(weekParam.split("-")[1]) - 1 // Convert to 0-indexed
    : getWeekAndDay(initialYear, today.getMonth() + 1, today.getDate()).week - 1;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<SelectedWeekDate>(getToday());
  const [weekStart, setWeekStart] = useState<Date>(getWeekStartDateFromYearWeek(initialYear, initialWeek));

  const { timeCells } = useCalendar(userId);

  // Dedicated function for updating the URL.
  // It sets the "year" and then removes "date" (or any extra params) if not explicitly provided.
  const updateWeekUrl = useCallback(
    (year: number, extraParams: Record<string, string> = {}) => {
      const search = new URLSearchParams(searchParams.toString());
      search.set("year", String(year));
      // Remove known extra params if they aren't provided in extraParams.
      if (!("date" in extraParams)) {
        search.delete("date");
      }
      // In case you want to add more extra parameters, set them now.
      for (const key in extraParams) {
        search.set(key, extraParams[key]);
      }
      router.replace(`${pathname}?${search.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  useEffect(() => {
    if (!userId) return;

    // If there's a "week" or "year" in the URL, update the calendar state accordingly
    const weekParam = searchParams.get("week");
    const yearParam = searchParams.get("year");

    if (weekParam && yearParam) {
      const [weekYear, weekNumber] = weekParam.split("-").map(Number);
      setSelectedDate((prev) => ({ ...prev, year: weekYear, week: weekNumber - 1 }));
      setWeekStart(getWeekStartDateFromYearWeek(weekYear, weekNumber - 1));
    } else {
      // If no parameters, update the URL with the current year and week
      updateWeekUrl(selectedDate.year);
    }

    // Handle the "date" parameter to open a modal for that day
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const { week, dayWeek } = getWeekAndDay(year, month, day);
      setSelectedDate({ day: day, month: month - 1, year, week: week - 1, dayWeek, timeSlot: 0 });
      setIsModalOpen(true);
      updateWeekUrl(year, { date: dateParam });
      // Ensure the state is updated to reflect the URL change.
      setSelectedDate((prev) => ({ ...prev, year: year, week: week - 1 }));
      setWeekStart(getWeekStartDate(new Date(year, month - 1, day)));
    }
  }, [searchParams, userId, updateWeekUrl]);

  const handleCellClick = useCallback(
    (date: Date, timeSlot: number, dayIndex: number) => {
      if (!userId) return;
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const { week, dayWeek: computedDayWeek } = getWeekAndDay(year, month + 1, day);
      updateWeekUrl(year, { date: dateString });
      setSelectedDate({ day: day, month, year, week: week - 1, dayWeek: computedDayWeek, timeSlot });
      setIsModalOpen(true);
    },
    [userId, updateWeekUrl]
  );

  const closeModal = useCallback(() => {
    // On modal close, call updateWeekUrl without extraParams to remove them.
    updateWeekUrl(selectedDate.year);
    setIsModalOpen(false);
  }, [selectedDate.year, updateWeekUrl]);

  // Navigation handlers for week view
  const handlePrevWeek = () => {
    let newWeek = selectedDate.week - 1;
    let newYear = selectedDate.year;
    if (newWeek < 0) {
      newYear = selectedDate.year - 1;
      newWeek = getWeeksInYear(newYear) - 1;
    }
    setSelectedDate((prev) => ({ ...prev, year: newYear, week: newWeek }));
    setWeekStart(getWeekStartDateFromYearWeek(newYear, newWeek));
    updateWeekUrl(newYear);
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
    updateWeekUrl(newYear);
  };

  const handleTodayClick = () => {
    const now = new Date();
    const newYear = now.getFullYear();
    const { week } = getWeekAndDay(newYear, now.getMonth() + 1, now.getDate());
    const newWeek = week - 1;
    setSelectedDate((prev) => ({ ...prev, year: newYear, week: newWeek }));
    setWeekStart(getWeekStartDate(now));
    updateWeekUrl(newYear);
  };

  // For the given currentYear and currentWeek, get the corresponding WeekCell.
  const weekEvents = timeCells[selectedDate.year]?.[selectedDate.week] || [null, null, null, null, null, null, null];

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
          selectedDate={selectedDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          onTodayClick={handleTodayClick}
        />
        <WeekCalendar
          onClick={handleCellClick}
          events={weekEvents}
          weekStart={weekStart}
          selectedDate={selectedDate}
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
    className={`relative flex h-screen max-h-screen w-full flex-col gap-4 pt-4 items-center justify-center ${isModalOpen ? "pointer-events-none" : ""}`}
  >
    <div className="relative h-full w-full overflow-auto mt-10"><div className="w-full px-[5vw] pt-4">{children}</div></div>
  </div>
);
