'use client';
import React from "react";
import CalendarHeader from "../CalendarHeader";
import { SelectedDate } from "../useCalendarState";
import AddEventButton from "../AddEventButton";
import { getWeekStartDateFromYearWeek, daysOfWeek } from "../../../lib/calendarUtils";

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
  const getDayOfWeek = (week: number, year: number, dayIndex: number) => {
    const weekStartDate = getWeekStartDateFromYearWeek(year, week);
    const dayOfWeek = new Date(weekStartDate);
    dayOfWeek.setDate(weekStartDate.getDate() + dayIndex);
    return {
      weekday: dayOfWeek.toLocaleDateString('en-US', { weekday: 'short' }),
      date: dayOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  return (
    <CalendarHeader
      title={`Week ${selectedDate ? selectedDate.week + 1 : ''} – ${selectedDate ? selectedDate.year : ''}`}
      onPrev={onPrevWeek}
      onNext={onNextWeek}
      onTodayClick={onTodayClick}
      additionalButtonsLeft={selectedDate && <AddEventButton selectedDate={selectedDate} />}
      dayOfWeek={({ day, index }) => (
        <div className="w-full border-b border-slate-200 py-2 text-center font-semibold">
          {selectedDate ? (
            <>
              <div>{getDayOfWeek(selectedDate.week, selectedDate.year, index).weekday}</div>
              <div>{getDayOfWeek(selectedDate.week, selectedDate.year, index).date}</div>
            </>
          ) : (
            daysOfWeek[index]
          )}
        </div>
      )}
    />
  );
};

export default WeekCalendarHeader;