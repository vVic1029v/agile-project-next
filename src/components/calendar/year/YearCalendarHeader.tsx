'use client';
import React from 'react';
import Select from '../../Common/Select';
import { useRouter } from 'next/navigation';
import CalendarHeader from '../CalendarHeader';
import { SelectedDate } from '../useCalendarState';
import Checkbox from '@/components/Common/Checkbox';
import { ScrollPanelsRef } from '../calendar-page/ScrollPanels';
export interface YearCalendarHeaderProps {
  selectedDay: SelectedDate;
  monthOptions: { name: string; value: string }[];
  onMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onTodayClick: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onShowMonthHeadersChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  monthHeaders: boolean;
  
}

const YearCalendarHeader: React.FC<YearCalendarHeaderProps> = ({
  selectedDay,
  monthOptions,
  onMonthChange,
  onTodayClick,
  onPrevYear,
  onNextYear,
  onShowMonthHeadersChange,
  monthHeaders,
}) => {
  const router = useRouter();
function handleNewEvent() {

  
}
  return (
    <CalendarHeader
      title={`${selectedDay.year}`}
      onPrev={onPrevYear}
      onNext={onNextYear}
      onTodayClick={onTodayClick}
      additionalButtonsLeft={
        <>
          <button // TODO: This should be a SmallButton
            
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            Open This Week
          </button>
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => handleNewEvent()}>
              Add new Event
            </button>
          <Checkbox
            name="monthHeaders"
            checked={monthHeaders}
            label="Show Month Headers"
            onChange={onShowMonthHeadersChange}
            className="ml-4"
          />
        </>
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