
import React, { ReactNode } from "react";
import { SelectedWeekDate } from "../week/UserWeekCalendar";


interface CalendarDayModalProps {
  selectedDate: SelectedWeekDate
  timeCells: Record<number, YearCell>;
}

function formatSelectedDate(selectedDate: SelectedWeekDate) {
  const { day, month, year, week, dayWeek } = selectedDate;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Define weekday names
  const weekDayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  // Get formatted date string
  return `${weekDayNames[dayWeek]}, ${monthNames[month]} ${day}, ${year}`; //  (Week ${week})
}


const CalendarDayModal: React.FC<CalendarDayModalProps> = React.memo(({ selectedDate, timeCells }) => {
  const events: EventTimeSlot[] = timeCells[selectedDate.year]?.[selectedDate.week]?.[selectedDate.dayWeek] || [];
  console.log("Rendering ModalBody", events);

  return (
      <div className="p-5">
        {/* Selected Date Header */}
        <h2 className="text-lg font-semibold text-gray-900">{formatSelectedDate(selectedDate)}</h2>

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
});



export default CalendarDayModal;

