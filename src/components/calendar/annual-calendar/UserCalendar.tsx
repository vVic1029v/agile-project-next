'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ContinuousCalendar } from "@/components/calendar/annual-calendar/ContinuousCalendar";
import ModalBody from "./ModalBody";
import { useSession } from "next-auth/react";
import { useCalendar } from "../useCalendar";
import { getWeekAndDay } from "@/lib/calendarUtils";

const monthNames = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

export default function UserCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{ dayMonth: number; month: number; year: number; week: number; dayWeek: number} | null>(null);

  const { timeCells, courses } = useCalendar(session?.user.id);

  useEffect(() => {
    if (!session?.user?.id) return;
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number); 
      const {week, dayWeek} = getWeekAndDay(year, month, day);
      setSelectedDate({ dayMonth: day, month: month - 1, year, week: week - 1, dayWeek });

      setIsModalOpen(true);
    }
  }, [searchParams, session?.user?.id]);

  const handleDayClick = (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => {
    if (!session?.user?.id) return;
    
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayMonth).padStart(2, "0")}`; // -${String(week).padStart(2, "0")}
    router.push(`${pathname}?date=${dateString}`, { scroll: false });

    setSelectedDate({ dayMonth: dayMonth, month, year, week: week - 1, dayWeek});

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={closeModal}>
              ✕
            </button>
              <ModalBody
              selectedDate={selectedDate}
              timeCells={timeCells}
            />
            
          </div>
        </div>
      )}

      <div className={`relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center ${isModalOpen ? "pointer-events-none" : ""}`}>
        <div className="relative h-full w-full overflow-auto mt-10">
          <ContinuousCalendar onClick={handleDayClick} events={timeCells} />
        </div>
      </div>
    </div>
  );
}
