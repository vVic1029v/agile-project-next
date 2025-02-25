// components/calendar/CalendarProvider.tsx
'use client';
import React, { createContext, useContext, useState } from "react";
import type { StructuredEvents, StructuredWeekCourses } from "@/lib/database/getCalendarData";

// Define the context type.
interface CalendarContextType {
  events: StructuredEvents;
  courses: StructuredWeekCourses;
  // You can add dynamic state setters here.
}

// Create the context.
const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Provider component.
export default function CalendarProvider({
  events,
  courses,
  children,
}: {
  events: StructuredEvents;
  courses: StructuredWeekCourses;
  children: React.ReactNode;
}) {
  // Any client-side state or logic can be handled here.
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

// Custom hook to consume context.
export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}
