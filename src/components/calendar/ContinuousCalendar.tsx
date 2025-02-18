// /components/Calendar/ContinuousCalendar.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { monthNames } from '@/lib/calendarUtils';

export interface ContinuousCalendarProps {
  onClick?: (_day: number, _month: number, _year: number) => void;
  // Optional events mapping by date key (format: "YYYY-MM-DD")
  events?: { [key: string]: Array<{ icon: string; color: string }> };
}

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({ onClick, events }) => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: `${index}`,
  }));

  /* -----------------------------
     EVENT HANDLERS & SCROLLING
  ------------------------------ */
  const scrollToDay = (monthIndex: number, dayIndex: number) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) =>
        ref &&
        ref.getAttribute('data-month') === `${monthIndex}` &&
        ref.getAttribute('data-day') === `${dayIndex}`
    );
    const targetElement = dayRefs.current[targetDayIndex];

    if (targetDayIndex !== -1 && targetElement) {
      const container = document.querySelector('.calendar-container');
      const elementRect = targetElement.getBoundingClientRect();
      const is2xl = window.matchMedia('(min-width: 1536px)').matches;
      const offsetFactor = is2xl ? 3 : 2.5;

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset =
          elementRect.top -
          containerRect.top -
          containerRect.height / offsetFactor +
          elementRect.height / 2;
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: 'smooth',
        });
      } else {
        const offset =
          window.scrollY +
          elementRect.top -
          window.innerHeight / offsetFactor +
          elementRect.height / 2;
        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }
    }
  };

  const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setYear((prevYear) => prevYear + 1);
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
    scrollToDay(monthIndex, 1);
  };
  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };
  const handleDayClick = (day: number, month: number, year: number) => {
    if (!onClick) return;
    if (month < 0) {
      onClick(day, 11, year - 1);
    } else {
      onClick(day, month, year);
    }
  };

  /* -----------------------------
     INTERSECTION OBSERVER
  ------------------------------ */
  useEffect(() => {
    // Scroll to today on initial load
    handleTodayClick();

    const calendarContainer = document.querySelector('.calendar-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(
              entry.target.getAttribute('data-month')!,
              10
            );
            setSelectedMonth(month);
          }
        });
      },
      {
        root: calendarContainer,
        rootMargin: '-75% 0px -25% 0px',
        threshold: 0,
      }
    );

    dayRefs.current.forEach((ref) => {
      if (ref && ref.getAttribute('data-day') === '15') {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
      <CalendarHeader
        selectedMonth={selectedMonth}
        monthOptions={monthOptions}
        onMonthChange={handleMonthChange}
        onTodayClick={handleTodayClick}
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
        year={year}
      />
      <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">
        <CalendarGrid
          year={year}
          onDayClick={handleDayClick}
          dayRefs={dayRefs}
          events={events}
        />
      </div>
    </div>
  );
};

export default ContinuousCalendar;
