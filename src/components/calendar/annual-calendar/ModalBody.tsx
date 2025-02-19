import React from "react";
import { YearCell } from "../useCalendar";
import { EventTimeSlot } from "calendar-types";
import { getWeekAndDay } from "@/lib/calendarUtils";


interface ModalBodyProps {
  selectedDate: { dayMonth: number; month: number; year: number; week: number; dayWeek: number}
  timeCells: Record<number, YearCell>;
}

const ModalBody: React.FC<ModalBodyProps> = ({ selectedDate, timeCells }) => {
  const events: EventTimeSlot[] = timeCells[selectedDate.year]?.[selectedDate.week]?.[selectedDate.dayWeek] || [];
  console.log(timeCells, selectedDate)

  return (
    <div className="p-5 sm:p-6">
      {/* Selected Date Header */}
      <h2 className="text-lg font-semibold text-gray-900">{selectedDate.dayMonth}</h2>

      {/* Event List - Scrollable */}
      <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-3 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-800">{event.title}</p>
              <p className="text-xs text-gray-600">{event.title}</p>
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
