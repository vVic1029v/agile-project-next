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

interface SelectedDate {
  dayMonth: number;
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

export default function UserYearCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null); // Initial state set to null
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const { timeCells } = useCalendar(userId);
  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: index.toString(),
  }));

  useEffect(() => {
    if (!userId) return;

    const yearParam = searchParams.get("year");
    if (yearParam) {
      const parsedYear = Number(yearParam);
      if (!isNaN(parsedYear)) {
        setCurrentYear(parsedYear); // Use the year from the URL if available
      } else {
        setCurrentYear(new Date().getFullYear()); // Default to the current year if invalid
      }
    } else {
      setCurrentYear(new Date().getFullYear()); // Default to the current year if no year param
    }

    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const { week, dayWeek } = getWeekAndDay(year, month, day);
      setSelectedDate({ dayMonth: day, month: month - 1, year, week: week - 1, dayWeek });
      setIsModalOpen(true);
    }
  }, [searchParams, userId]);

  const handlePrevYear = () => {
    if (currentYear !== null) {
      setCurrentYear(currentYear - 1);
      router.replace(`${pathname}?year=${currentYear - 1}`, { scroll: false });
    }
  };

  const handleNextYear = () => {
    if (currentYear !== null) {
      setCurrentYear(currentYear + 1);
      router.replace(`${pathname}?year=${currentYear + 1}`, { scroll: false });
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
  };

  const handleDayClick = useCallback(
    (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => {
      if (!userId) return;
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayMonth).padStart(2, "0")}`;
      router.replace(`${pathname}?year=${year}&date=${dateString}`, { scroll: false });
      setSelectedDate({ dayMonth, month, year, week: week - 1, dayWeek });
      setIsModalOpen(true);
    },
    [userId, router, pathname]
  );

  const closeModal = useCallback(() => {
    if (currentYear !== null) {
      router.replace(`${pathname}?year=${currentYear}`, { scroll: false });
      setIsModalOpen(false);
    }
  }, [router, pathname, currentYear]);

  if (status === "loading" || !userId || currentYear === null) return null; // Ensure currentYear is set

  return (
    <div>

      {isModalOpen && selectedDate && (
        <ModalOverlay onClose={closeModal}>
          <CalendarDayModal selectedDate={selectedDate} timeCells={timeCells} />
        </ModalOverlay>
      )}
      <CalendarContainer isModalOpen={isModalOpen}>
        <YearCalendarHeader
          year={currentYear}
          selectedMonth={selectedMonth}
          monthOptions={monthOptions}
          onMonthChange={handleMonthChange}
          onTodayClick={() => setCurrentYear(new Date().getFullYear())}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
        />
        <YearCalendar year={currentYear} onClick={handleDayClick} events={timeCells} />
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
    className={`relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center ${isModalOpen ? "pointer-events-none" : ""}`}
  >
    <div className="relative h-full w-full overflow-auto mt-10">
      <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl pl-10">
        <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">

          {children}
        </div>
      </div>
    </div>
  </div>
);
