'use client';

import React, { useEffect, useRef, useState } from 'react';
import YearCalendarGrid from './YearCalendarGrid';
import { monthNames } from '@/lib/calendarUtils';
import { YearCell } from '../useCalendar';

export interface YearCalendarProps {
  onClick?: (dayMonth: number, month: number, week: number, year: number, dayWeek: number) => void;
  events: Record<number, YearCell>;
  year: number;
}

export const YearCalendar: React.FC<YearCalendarProps> = ({ onClick, events, year }) => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: index.toString(),
  }));

  /* -----------------------------
     EVENT HANDLERS & SCROLLING
  ------------------------------ */
  const scrollToDay = (monthIndex: number, dayIndex: number) => {
    const targetElement = dayRefs.current.find(
      (ref) =>
        ref?.getAttribute('data-month') === monthIndex.toString() &&
        ref?.getAttribute('data-day') === dayIndex.toString()
    );

    if (targetElement) {
      const container = document.querySelector('.calendar-container');
      const elementRect = targetElement.getBoundingClientRect();
      const is2xl = window.matchMedia('(min-width: 1536px)').matches;
      const offsetFactor = is2xl ? 3 : 2.5;

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset = elementRect.top - containerRect.top - containerRect.height / offsetFactor + elementRect.height / 2;
        container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
      } else {
        const offset = window.scrollY + elementRect.top - window.innerHeight / offsetFactor + elementRect.height / 2;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
    scrollToDay(monthIndex, 1);
  };

  const handleTodayClick = () => {
    scrollToDay(today.getMonth(), today.getDate());
  };

  const handleDayClick = (dayMonth: number, month: number, year: number, week: number, dayWeek: number) => {
    if (onClick) {
      onClick(dayMonth, month < 0 ? 11 : month, month < 0 ? 0 : week, month < 0 ? year - 1 : year, dayWeek);
    }
  };

  /* -----------------------------
     INTERSECTION OBSERVER
  ------------------------------ */
  useEffect(() => {
    handleTodayClick();
    const calendarContainer = document.querySelector('.calendar-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(entry.target.getAttribute('data-month') || '0', 10);
            setSelectedMonth(month);
          }
        });
      },
      { root: calendarContainer, rootMargin: '-75% 0px -25% 0px', threshold: 0 }
    );

    dayRefs.current.forEach((ref) => {
      if (ref?.getAttribute('data-day') === '15') {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (

    <YearCalendarGrid onDayClick={handleDayClick} dayRefs={dayRefs} events={events} year={year} />
  );
};

export default YearCalendar;