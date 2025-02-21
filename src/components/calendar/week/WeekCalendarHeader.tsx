'use client';
import React from "react";
import { SelectedWeekDate } from "./UserWeekCalendar";
import CalendarHeader from "../CalendarHeader";

export interface WeekCalendarHeaderProps {
  selectedDate: SelectedWeekDate | null;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onTodayClick: () => void;
}

const WeekCalendarHeader: React.FC<WeekCalendarHeaderProps> = ({
  selectedDate,
  onPrevWeek,
  onNextWeek,
  onTodayClick,
}) => {
  return (
    <CalendarHeader
      title={`Week ${selectedDate ? selectedDate.week + 1 : ''} – ${selectedDate ? selectedDate.year : ''}`}
      onPrev={onPrevWeek}
      onNext={onNextWeek}
      onTodayClick={onTodayClick}
      additionalButtonsLeft={
        <button
          type="button"
          className="whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 sm:rounded-xl lg:px-5 lg:py-2.5"
        >
          + Add Event
        </button>
      }
    />
  );
};

export default WeekCalendarHeader;