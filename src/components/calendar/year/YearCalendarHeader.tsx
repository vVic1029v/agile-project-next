'use client';
import React, { useState } from 'react';
import Select from '../../Common/Select';
import { useRouter } from 'next/navigation';
import CalendarHeader from '../CalendarHeader';
import { SelectedDate } from '../useCalendarState';
import Checkbox from '@/components/Common/Checkbox';
import { Modal } from '@/components/Modal';
import EventFormModal from '@/components/EventFormModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(selectedDay);

  const handleNewEvent = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <CalendarHeader
        title={`${selectedDay.year}`}
        onPrev={onPrevYear}
        onNext={onNextYear}
        onTodayClick={onTodayClick}
        additionalButtonsLeft={
          <>
            {/* <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Open This Week
            </button> */}
            {/* <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
              onClick={handleNewEvent}
            >
              Add new Event
            </button> */}
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

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <EventFormModal onClose={closeModal} selectedDate={selectedDate} />
      </Modal>
    </>
  );
};

export default YearCalendarHeader;
