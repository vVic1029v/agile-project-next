'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import YearCalendarGrid from './YearCalendarGrid';
import { StructuredEvents } from '@/lib/getCalendarData';
import { SelectedDate } from '../useCalendarState';

export interface YearCalendarProps {
  onClick?: (selected: SelectedDate) => void;
  events: StructuredEvents;
  selectedDay: SelectedDate;
}

export const YearCalendar: React.FC<YearCalendarProps> = ({ onClick, events, selectedDay }) => {
  const today = useMemo(() => new Date(), []);
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToDay = useCallback((monthIndex: number, dayIndex: number) => {
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

      const offset =
        elementRect.top - 
        (container ? container.getBoundingClientRect().top : window.scrollY) - 
        (container ? container.getBoundingClientRect().height : window.innerHeight) / offsetFactor + 
        elementRect.height / 2;

      if (container) {
        container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.scrollY + offset, behavior: 'smooth' });
      }
    }
  }, []);

  const handleDayClick = useCallback((selected: SelectedDate) => {
    if (onClick) {
      onClick(selected);
    }
  }, [onClick]);

  // useEffect(() => {
  //   scrollToDay(today.getMonth(), today.getDate());
  // }, [scrollToDay, today]);

  useEffect(() => {
    scrollToDay(selectedDay.month, selectedDay.day);
  }, [scrollToDay, selectedDay]);

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