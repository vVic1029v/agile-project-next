'use client';

import React, { useEffect, useRef } from 'react';
import YearCalendarGrid from './YearCalendarGrid';
import { StructuredEvents } from '@/lib/getCalendarData';
import { SelectedDate } from '../useCalendarState';

export interface YearCalendarProps {
  onClick?: (selected: SelectedDate) => void;
  events: StructuredEvents;
  selectedDay: SelectedDate;
}

export const YearCalendar: React.FC<YearCalendarProps> = ({ onClick, events, selectedDay }) => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        const offset =
          elementRect.top -
          containerRect.top -
          containerRect.height / offsetFactor +
          elementRect.height / 2;
        container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
      } else {
        const offset =
          window.scrollY +
          elementRect.top -
          window.innerHeight / offsetFactor +
          elementRect.height / 2;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  };

  // Now receives a SelectedDay object directly
  const handleDayClick = (selected: SelectedDate) => {
    if (onClick) {
      onClick(selected);
    }
  };

  // Scroll to today's date on mount
  useEffect(() => {
    scrollToDay(today.getMonth(), today.getDate());
  }, []);

  // Scroll to the selected day whenever it changes
  useEffect(() => {
    scrollToDay(selectedDay.month, selectedDay.day);
  }, [selectedDay]);

  return (
    <YearCalendarGrid
      onDayClick={handleDayClick}
      dayRefs={dayRefs}
      events={events}
      year={selectedDay.year}
    />
  );
};

export default YearCalendar;
