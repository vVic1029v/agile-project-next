import React from "react";
import { SelectedDate } from "../components/calendar/useCalendarState";

export interface ModalWeekCalendarProps {
  selectedTimeSlots: SelectedDate[];
  handleSelectTimeSlot: (slot: SelectedDate) => void;
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = Array.from({ length: 8 }, (_, i) => i + 1);

const ModalWeekCalendar: React.FC<ModalWeekCalendarProps> = ({
  selectedTimeSlots,
  handleSelectTimeSlot,
}) => {
  return (
    <div className="p-6 w-full bg-white rounded-lg shadow-lg">
      {/* Header: Days of the Week */}
      <div className="grid grid-cols-5 text-center font-semibold text-gray-800 mb-4 gap-x-6">
        {dayLabels.map((label, index) => (
          <div key={index} className="p-2 bg-blue-100 rounded-lg text-sm">{label}</div>
        ))}
      </div>

      {/* Time slots grid */}
      {periods.map((period) => (
        <div key={period} className="flex w-full mb-3 gap-x-6">
          {Array.from({ length: 5 }, (_, dayWeek) => {
            const isSelected = selectedTimeSlots.some(
              (slot) => slot.dayWeek === dayWeek && slot.period === period
            );

            return (
              <div
                key={dayWeek}
                onClick={() =>
                  handleSelectTimeSlot({
                    day: dayWeek, // Placeholder value
                    month: 0, // Placeholder value
                    year: 0, // Placeholder value
                    week: 0, // Placeholder value
                    dayWeek,
                    period,
                  })
                }
                className={`w-12 h-12 border-2 border-gray-300 flex items-center justify-center rounded-md cursor-pointer transition duration-200 transform hover:bg-blue-300 hover:scale-105 ${
                  isSelected ? "bg-blue-500 text-white" : "text-gray-700"
                }`}
              >
                {isSelected && (
                  <span className="text-lg font-bold text-white">✔</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ModalWeekCalendar;
