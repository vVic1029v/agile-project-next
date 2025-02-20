'use client';
import React from "react";
import { daysOfWeek } from "@/lib/calendarUtils";
import { SelectedWeekDate } from "./UserWeekCalendar";

export interface WeekCalendarHeaderProps {
  selectedDate: SelectedWeekDate | null
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
    <div className="sticky -top-px z-40 w-full rounded-t-2xl bg-white pt-7">
      <div
        className="sticky -top-px z-40 w-full rounded-t-2xl bg-white pt-7"
        style={{
          position: "absolute",
          top: 0,
          left: -30,
          width: "calc(100% + 30px)",
          height: "100%",
          zIndex: -1,
        }}
      />
      <div>
        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={onTodayClick}
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 lg:px-5 lg:py-2.5"
            >
              This Week
            </button>
            <button
              type="button"
              className="whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 sm:rounded-xl lg:px-5 lg:py-2.5"
            >
              + Add Event
            </button>
          </div>
          <div className="flex w-fit items-center justify-between">
            <button
              onClick={onPrevWeek}
              className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
            >
              <svg
                className="size-5 text-slate-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
              </svg>
            </button>
            <h1 className="min-w-40 text-center text-lg font-semibold sm:min-w-40 sm:text-xl">
              Week {selectedDate && selectedDate.week + 1} – {selectedDate && selectedDate.year}
            </h1>
            <button
              onClick={onNextWeek}
              className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
            >
              <svg
                className="size-5 text-slate-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid w-full grid-cols-7 justify-between text-slate-500">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="w-full border-b border-slate-200 py-2 text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekCalendarHeader;
