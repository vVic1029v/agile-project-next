'use client';
import React from 'react';
import Select from '../../Common/Select';
import { useRouter } from 'next/navigation';
import type { SelectedDay } from "@/components/calendar/year/UserYearCalendar"; // adjust path as needed
import CalendarHeader from '../CalendarHeader';

export interface YearCalendarHeaderProps {
  selectedDay: SelectedDay;
  monthOptions: { name: string; value: string }[];
  onMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onTodayClick: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
}

const YearCalendarHeader: React.FC<YearCalendarHeaderProps> = ({
  selectedDay,
  monthOptions,
  onMonthChange,
  onTodayClick,
  onPrevYear,
  onNextYear,
}) => {
  const router = useRouter();

  return (
    <CalendarHeader
      title={`${selectedDay.year}`}
      onPrev={onPrevYear}
      onNext={onNextYear}
      onTodayClick={onTodayClick}
      additionalButtonsLeft={
        <button
          onClick={() => router.push('/calendar/week')}
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 lg:px-5 lg:py-2.5"
        >
          Open This Week
        </button>
      }
      additionalButtonsRight={
        <Select
          className="mx-5"
          name="month"
          value={`${selectedDay.month}`}
          options={monthOptions}
          onChange={onMonthChange}
        />
      }
    />
  );
};

export default YearCalendarHeader;