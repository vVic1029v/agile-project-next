"use client";
import React, { useState } from "react";
import SearchHomeClassModal from "./SearchHomeClassModal";
import { ModalOverlay } from "@/components/ModalOverlay";
import Form from "next/form";
import { NewCourse } from "@/lib/actions";
import PeriodSelectWeekCalendar from "@/components/calendar/week/PeriodSelectWeekCalendar";
import { SelectedDate } from "@/components/calendar/useCalendarState";

const CourseForm: React.FC = () => {
  const [isModalOpenSearchHomeClass, setIsModalOpenSearchHomeClass] = useState(false);
  const [isModalOpenPeriodSelect, setIsModalOpenPeriodSelect] = useState(false);
  const [selectedHomeClass, setSelectedHomeClass] = useState<{ id: string; name: string } | null>(null);

  // Period Select
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<SelectedDate[]>([]);
  function handleSelectTimeSlot(date: SelectedDate): void {
      setSelectedTimeSlots(prevSlots => {
          const isSelected = prevSlots.some(slot => slot.dayWeek === date.dayWeek && slot.period === date.period);
          if (isSelected) {
              return prevSlots.filter(slot => !(slot.dayWeek === date.dayWeek && slot.period === date.period));
          } else {
              return [...prevSlots, date];
          }
      });
  }

  return (
    <Form className="p-6" action={(formData: FormData ) => {formData.append("homeClassId", selectedHomeClass?.id || ""); NewCourse(formData) }}>
      <span className="flex">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md size-[5vh] w-[20vh] min-h-10 min-w-10 max-w-30 max-h-20"
          onClick={() => setIsModalOpenSearchHomeClass(true)}
        >
          Select Class
        </button>
        {selectedHomeClass ? (
          <div className="bg-blue-50 border border-blue-200 rounded-md text-center items-center justify-center ml-5 flex size-[5vh] w-[30vh] min-h-10 min-w-30 max-w-50 max-h-20">
            <p className="texmb-t-sm text-blue-800 px-3">Selected Class: {selectedHomeClass.name}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 ml-5 mt-2">No class selected.</p>
        )}

        {/* Modal */}
        <ModalOverlay onClose={() => setIsModalOpenSearchHomeClass(false)} isOpen={isModalOpenSearchHomeClass} title={"Select a class"}>
          <SearchHomeClassModal
            onClose={() => setIsModalOpenSearchHomeClass(false)}
            onSelect={(item) => {
              setSelectedHomeClass(item);
              setIsModalOpenSearchHomeClass(false);
            }}
          />
        </ModalOverlay>
      </span>

      {/* Period Select Week Calendar */}
      <span className="flex">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-md size-[5vh] w-[20vh] min-h-10 min-w-10 max-w-30 max-h-20 mt-5"
          onClick={() => setIsModalOpenPeriodSelect(true)}
        >
          Select Period
        </button>
        <div className="mt-6 ">
          <ModalOverlay onClose={() => setIsModalOpenPeriodSelect(false)} isOpen={isModalOpenPeriodSelect} title={"Select a period"}>

            <PeriodSelectWeekCalendar selectedTimeSlots={selectedTimeSlots} handleSelectTimeSlot={handleSelectTimeSlot} />
          </ModalOverlay>
        </div>
      </span>

      {/* Submit Button */}
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md mt-6 size-[5vh] w-[20vh] min-h-11 min-w-10 max-w-26 max-h-20">
        Create Course
      </button>
    </Form>
  );
};

export default CourseForm;