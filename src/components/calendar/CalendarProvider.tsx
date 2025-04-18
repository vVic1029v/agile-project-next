// components/calendar/CalendarProvider.tsx
'use client';
import React, { createContext, useContext, useState } from "react";
import type { StructuredEvents, StructuredWeekCourses } from "@/lib/database/getCalendarData";

interface CalendarContextType {
  events: StructuredEvents;
  courses: StructuredWeekCourses;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export default function CalendarProvider({
  events,
  courses,
  children,
}: {
  events: StructuredEvents;
  courses: StructuredWeekCourses;
  children: React.ReactNode;
}) {
  const [stateEvents] = useState(events);
  const [stateCourses] = useState(courses);

  return (
    <CalendarContext.Provider
      value={{
        events: stateEvents,
        courses: stateCourses,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}
