'use client';
import React from "react";
import { daysOfWeek } from "@/lib/calendarUtils";

export interface CalendarHeaderProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onTodayClick: () => void;
  additionalButtonsLeft?: React.ReactNode;
  additionalButtonsRight?: React.ReactNode;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  onPrev,
  onNext,
  onTodayClick,
  additionalButtonsLeft,
  additionalButtonsRight,
}) => {
  return (
    <div className="sticky -top-px z-40 w-full rounded-t-2xl bg-white pt-7">
      <div
        className="sticky -top-px z-40 w-full rounded-t-2xl bg-white pt-7"
        style={{
          position: "absolute",
          top: 0,
          left: "-5vw",
          width: "calc(100% + 5vw)",
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
              Today
            </button>
            {additionalButtonsLeft}
          </div>
          <div className="flex w-fit items-center justify-between">
            {additionalButtonsRight}
            <button
              onClick={onPrev}
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
              {title}
            </h1>
            <button
              onClick={onNext}
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

export default CalendarHeader;