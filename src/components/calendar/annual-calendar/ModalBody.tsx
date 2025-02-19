import React from "react";
import { YearCell } from "../useCalendar";
import { EventTimeSlot } from "calendar-types";


interface ModalBodyProps {
  selectedDate: {
    year: number,
    month: number
    yearWeek: number,
    day: number
  }
  timeCells: Record<number, YearCell>;
}

const ModalBody: React.FC<ModalBodyProps> = ({ selectedDate, timeCells }) => {
  const events: EventTimeSlot[] = timeCells[selectedDate.year]?.[selectedDate.yearWeek]?.[selectedDate.day] || [];
  console.log(timeCells, selectedDate.year, selectedDate.yearWeek, selectedDate.day)

  return (
    <div className="p-5 sm:p-6">
      {/* Selected Date Header */}
      <h2 className="text-lg font-semibold text-gray-900">{selectedDate.day}</h2>

      {/* Event List - Scrollable */}
      <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-3 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-800">{event.title}</p>
              <p className="text-xs text-gray-600">{event.timeSlot.dayOfWeek}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No events for this day.</p>
        )}
      </div>
    </div>
  );
};

export default ModalBody;
