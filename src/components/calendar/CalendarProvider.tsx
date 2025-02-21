// components/calendar/CalendarProvider.tsx
'use client';
import React, { createContext, useContext, useState } from "react";
import type { Course } from "@prisma/client";
import type { YearCell } from "@/lib/getCalendarData";

// Define the context type.
interface CalendarContextType {
  timeCells: Record<number, YearCell>;
  courses: Course[];
  // You can add dynamic state setters here.
}

// Create the context.
const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Provider component.
export default function CalendarProvider({
  timeCells,
  courses,
  children,
}: {
  timeCells: Record<number, YearCell>;
  courses: Course[];
  children: React.ReactNode;
}) {
  // Any client-side state or logic can be handled here.
  const [stateTimeCells] = useState(timeCells);
  const [stateCourses] = useState(courses);

  return (
    <CalendarContext.Provider
      value={{
        timeCells: stateTimeCells,
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
