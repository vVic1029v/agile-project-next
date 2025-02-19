'use client';

import React, { useState, useEffect, ReactNode } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ContinuousCalendar } from "@/components/calendar/annual-calendar/ContinuousCalendar";
import ModalBody from "./ModalBody";
import { useCalendar } from "../useCalendar";
import { getWeekAndDay } from "@/lib/calendarUtils";

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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const { timeCells, courses } = useCalendar(session?.user?.id);

  useEffect(() => {
    if (!session?.user?.id) return;
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      const { week, dayWeek } = getWeekAndDay(year, month, day);
      setSelectedDate({ dayMonth: day, month: month - 1, year, week: week - 1, dayWeek });
      setIsModalOpen(true);
    }
  }, [searchParams, session?.user?.id]);

  const handleDayClick = (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => {
    if (!session?.user?.id) return;
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayMonth).padStart(2, "0")}`;
    router.push(`${pathname}?date=${dateString}`, { scroll: false });
    setSelectedDate({ dayMonth, month, year, week: week - 1, dayWeek });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    router.push(pathname, { scroll: false });
    setIsModalOpen(false);
  };

  if (status === "loading" || !session?.user) return null;

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

const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg w-96 relative">
      <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
        ✕
      </button>
      {children}
    </div>
  </div>
);

const CalendarContainer: React.FC<CalendarContainerProps> = ({ children, isModalOpen }) => (
  <div className={`relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center ${isModalOpen ? "pointer-events-none" : ""}`}>
    <div className="relative h-full w-full overflow-auto mt-10">
      {children}
    </div>
  </div>
);
