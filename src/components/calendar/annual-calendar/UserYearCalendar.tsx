'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { YearCalendar } from "@/components/calendar/annual-calendar/YearCalendar";
import CalendarDayModal from "../CalendarDayModal";
import { useCalendar } from "../useCalendar";
import { getWeekAndDay, monthNames } from "@/lib/calendarUtils";
import YearCalendarHeader from "@/components/calendar/annual-calendar/YearCalendarHeader";
import type { ReactNode } from "react";

// Shared type for the unified date state.
export interface SelectedDay {
  day: number;
  month: number;
  year: number;
  week: number;
  dayWeek: number;
}

interface ModalOverlayProps {
  children: ReactNode;
  onClose: () => void;
}

interface CalendarContainerProps {
  children: ReactNode;
  isModalOpen: boolean;
}

export const getToday = (): SelectedDay => {
  const now = new Date();
  const { week, dayWeek } = getWeekAndDay(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    week: week - 1,
    dayWeek,
  };
};

export default function UserYearCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // Single state for all date values.
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { timeCells } = useCalendar(userId);
  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: index.toString(),
  }));

  const today = new Date();
  const yearParam = searchParams.get("year");
  const initialYear = yearParam ? Number(yearParam) : today.getFullYear();
  const [selectedDay, setSelectedDay] = useState<SelectedDay>({ ...getToday(), year: initialYear });

  // Dedicated function for updating the URL.
  const updateYearUrl = useCallback(
    (year: number, extraParams: Record<string, string> = {}) => {
      const search = new URLSearchParams(searchParams.toString());
      search.set("year", String(year));
      if (!("date" in extraParams)) {
        search.delete("date");
      }
      for (const key in extraParams) {
        search.set(key, extraParams[key]);
      }
      router.replace(`${pathname}?${search.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  useEffect(() => {
    if (!userId) return;

    const yearParam = searchParams.get("year");
    const dateParam = searchParams.get("date");

    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const { week, dayWeek } = getWeekAndDay(year, month, day);
      setSelectedDay({ day, month: month - 1, year, week: week - 1, dayWeek });
      setIsModalOpen(true);
    } else if (yearParam) {
      const parsedYear = Number(yearParam);
      if (!isNaN(parsedYear)) {
        setSelectedDay((prev) => ({ ...prev, year: parsedYear }));
      }
    } else {
      updateYearUrl(selectedDay.year);
    }
  }, [searchParams, userId, selectedDay.year, updateYearUrl]);

  const handlePrevYear = () => {
    const newYear = selectedDay.year - 1;
    setSelectedDay((prev) => ({ ...prev, year: newYear }));
    updateYearUrl(newYear);
  };

  const handleNextYear = () => {
    const newYear = selectedDay.year + 1;
    setSelectedDay((prev) => ({ ...prev, year: newYear }));
    updateYearUrl(newYear);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedDay((prev) => ({ ...prev, month: monthIndex }));
  };

  // Accepts a SelectedDay object directly.
  const handleDayClick = useCallback(
    (selected: SelectedDay) => {
      if (!userId) return;
      const { day, month, year } = selected;
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      updateYearUrl(year, { date: dateString });
      setSelectedDay(selected);
      setIsModalOpen(true);
    },
    [userId, updateYearUrl]
  );

  const closeModal = useCallback(() => {
    updateYearUrl(selectedDay.year);
    setIsModalOpen(false);
  }, [selectedDay.year, updateYearUrl]);

  if (status === "loading" || !userId) return null;

  return (
    <div>
      {isModalOpen && (
        <ModalOverlay onClose={closeModal}>
          <CalendarDayModal selectedDate={selectedDay} timeCells={timeCells} />
        </ModalOverlay>
      )}
      <CalendarContainer isModalOpen={isModalOpen}>
        <YearCalendarHeader
          selectedDay={selectedDay}
          monthOptions={monthOptions}
          onMonthChange={handleMonthChange}
          onTodayClick={() => {
            const todayDate = getToday();
            setSelectedDay(todayDate);
            updateYearUrl(todayDate.year);
          }}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
        />
        <YearCalendar selectedDay={selectedDay} onClick={handleDayClick} events={timeCells} />
      </CalendarContainer>
    </div>
  );
}

const ModalOverlay = ({ children, onClose }: ModalOverlayProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
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
    <div className="relative h-full w-full overflow-auto mt-10">
      <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
        <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">{children}</div>
      </div>
    </div>
  </div>
);
