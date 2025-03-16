import React from "react";
import { StructuredEvents } from "@/lib/database/getCalendarData";
import { SelectedDate } from "../useCalendarState";

interface CalendarDayModalProps {
  selectedDate: SelectedDate;
  events: StructuredEvents;
}

function formatSelectedDate(selectedDate: SelectedDate) {
  const { day, month, year, dayWeek } = selectedDate;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  return `${weekDayNames[dayWeek]}, ${monthNames[month]} ${day}, ${year}`;
}

const CalendarDayModal: React.FC<CalendarDayModalProps> = ({ selectedDate, events }) => {
  const dayEvents = events[selectedDate.year]?.[selectedDate.week]?.[selectedDate.dayWeek] || {};
  const dayTimeSlots = Object.values(dayEvents).flatMap(timeSlotCell => timeSlotCell);
  const modalEvents = dayTimeSlots.flatMap(timeSlotCell => timeSlotCell.events);

  return (
    <div className="p-5">
      {/* Selected Date Header */}
      <h2 className="text-lg font-semibold text-gray-900">{formatSelectedDate(selectedDate)}</h2>

      {/* Event List - Scrollable */}
      <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
        {modalEvents.length > 0 ? (
          modalEvents.map((event) => (
            <div key={event.id} className="p-3 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-800">{event.title}</p>
              <p className="text-xs text-gray-600">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No events for this day.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarDayModal;