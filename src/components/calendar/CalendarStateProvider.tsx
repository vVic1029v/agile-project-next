'use client';
import React, { createContext, useContext } from "react";
import { useCalendarState } from "./useCalendarState";

interface CalendarStateContextType {
  selectedDate: ReturnType<typeof useCalendarState>["selectedDate"];
  setSelectedDate: ReturnType<typeof useCalendarState>["setSelectedDate"];
  updateUrl: ReturnType<typeof useCalendarState>["updateUrl"];
  isModalOpen: ReturnType<typeof useCalendarState>["isModalOpen"];
  setIsModalOpen: ReturnType<typeof useCalendarState>["setIsModalOpen"];
}

const CalendarStateContext = createContext<CalendarStateContextType | undefined>(undefined);

export default function CalendarStateProvider({
  isWeekView,
  children,
}: {
  isWeekView: boolean;
  children: React.ReactNode;
}) {
  const calendarState = useCalendarState(isWeekView);

  return (
    <CalendarStateContext.Provider value={calendarState}>
      {children}
    </CalendarStateContext.Provider>
  );
}

export function useCalendarStateContext() {
  const context = useContext(CalendarStateContext);
  if (!context) {
    throw new Error("useCalendarStateContext must be used within a CalendarStateProvider");
  }
  return context;
}
