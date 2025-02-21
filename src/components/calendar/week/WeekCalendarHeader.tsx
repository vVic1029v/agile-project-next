'use client';
import React from "react";
import CalendarHeader from "../CalendarHeader";
import { SelectedDate } from "../useCalendarState";
import AddEventButton from "../AddEventButton";

export interface WeekCalendarHeaderProps {
  selectedDate: SelectedDate | null;
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
      additionalButtonsLeft={selectedDate && <AddEventButton selectedDate={selectedDate} />}
    />
  );
};

export default WeekCalendarHeader;