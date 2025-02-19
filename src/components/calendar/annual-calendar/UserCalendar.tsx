'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ContinuousCalendar } from "@/components/calendar/annual-calendar/ContinuousCalendar";
import ModalBody from "./ModalBody";
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

export default function UserCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const { timeCells } = useCalendar(userId);

  useEffect(() => {
    if (!userId) return;

    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const { week, dayWeek } = getWeekAndDay(year, month, day);
      setSelectedDate({ dayMonth: day, month: month - 1, year, week: week - 1, dayWeek });
      setIsModalOpen(true);
    }
  }, [searchParams, userId]);

  const handleDayClick = useCallback(
    (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => {
      if (!userId) return;
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayMonth).padStart(2, "0")}`;
      router.push(`${pathname}?date=${dateString}`, { scroll: false });
      setSelectedDate({ dayMonth, month, year, week: week - 1, dayWeek });
      setIsModalOpen(true);
    },
    [userId, router, pathname]
  );

  const closeModal = useCallback(() => {
    router.push(pathname, { scroll: false });
    setIsModalOpen(false);
  }, [router, pathname]);

  if (status === "loading" || !userId) return null;
  
  return (
    <div>
      {isModalOpen && selectedDate && (
        <ModalOverlay onClose={closeModal}>
          <ModalBody selectedDate={selectedDate} timeCells={timeCells} />
        </ModalOverlay>
      )}
      <CalendarContainer isModalOpen={isModalOpen}>
        <ContinuousCalendar onClick={handleDayClick} events={timeCells} />
      </CalendarContainer>
    </div>
  );
}

const ModalOverlay = ({ children, onClose }: ModalOverlayProps) => {
  
  return(
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-96 relative">
      <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
        ✕
      </button>
      {children}
    </div>
  </div>
)};

const CalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
  <div
    className={`relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center ${
      isModalOpen ? "pointer-events-none" : ""
    }`}
  >
    <div className="relative h-full w-full overflow-auto mt-10">{children}</div>
  </div>
);
