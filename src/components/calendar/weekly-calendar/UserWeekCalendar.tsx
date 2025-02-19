'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { WeekCalendar } from "./WeekCalendar";
import CalendarDayModal from "../CalendarDayModal";
import { useCalendar } from "../useCalendar";
import { getWeekAndDay } from "@/lib/calendarUtils";
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

export default function UserWeekCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // Initialize current week from today's date (getWeekAndDay returns week and dayWeek)
  const today = new Date();
  const initialWeekData = getWeekAndDay(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  // Store week as a zero-index (so subtract 1)
  const [currentWeek, setCurrentWeek] = useState<number>(initialWeekData.week - 1);
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const { timeCells } = useCalendar(userId);

  useEffect(() => {
    if (!userId) return;

    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const { week, dayWeek } = getWeekAndDay(year, month, day);
      setSelectedDate({ dayMonth: day, month: month - 1, year, week: week - 1, dayWeek });
    }
  }, [searchParams, userId]);

  const handleDayClick = useCallback(
    (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => {
      if (!userId) return;
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayMonth).padStart(2, "0")}`;
      router.push(`${pathname}?date=${dateString}`, { scroll: false });
      setSelectedDate({ dayMonth, month, year, week, dayWeek });
    },
    [userId, router, pathname]
  );

  const closeModal = useCallback(() => {
    router.push(pathname, { scroll: false });
    setSelectedDate(null);
  }, [router, pathname]);

  // Week navigation handlers.
  // (For simplicity, we assume 52 weeks per year; you might adjust this logic to handle 53‑week years)
  const handlePrevWeek = () => {
    if (currentWeek === 0) {
      setCurrentYear((prev) => prev - 1);
      setCurrentWeek(51);
    } else {
      setCurrentWeek((prev) => prev - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek === 51) {
      setCurrentYear((prev) => prev + 1);
      setCurrentWeek(0);
    } else {
      setCurrentWeek((prev) => prev + 1);
    }
  };

  if (status === "loading" || !userId) return null;

  // Extract the WeekCell (type: DayCell[] | null) for the current year/week.
  const weekEvents = timeCells[currentYear]?.[currentWeek] ?? null;

  return (
    <div>
      {selectedDate && (
        <ModalOverlay onClose={closeModal}>
          <CalendarDayModal selectedDate={selectedDate} timeCells={timeCells} />
        </ModalOverlay>
      )}
      <CalendarContainer isModalOpen={!!selectedDate}>
        <WeekCalendar
          onDayClick={handleDayClick}
          events={weekEvents}  
          currentYear={currentYear}
          currentWeek={currentWeek}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
      </CalendarContainer>
    </div>
  );
}

const ModalOverlay = ({ children, onClose }: ModalOverlayProps) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-96 relative">
      <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
        ✕
      </button>
      {children}
    </div>
  </div>
);

const CalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <div
    className={`relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center ${isModalOpen ? "pointer-events-none" : ""}`}
  >
    <div className="relative h-full w-full overflow-auto mt-10">{children}</div>
  </div>
);
