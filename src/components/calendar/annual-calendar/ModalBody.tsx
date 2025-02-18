import React from "react";


interface ModalBodyProps {
  selectedDate: string;
  events: { id: string; title: string; type: string; description: string | null; startTime: string; endTime: string; timeSlotId: string | null; weekNumber: number | null; yearNumber: number | null; courseId: string; }[];
}

/* OLD MODAL
{ Modal Component }
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
<h2 className="text-xl font-bold z-50">Selected Date</h2>
{selectedDate && (
  <p>
    {monthNames[selectedDate.month]} {selectedDate.day}, {selectedDate.year}
  </p>
)}
</Modal>
*/

const ModalBody: React.FC<ModalBodyProps> = ({ selectedDate, events }) => {
  console.log(events)
  return (
    <div className="p-5 sm:p-6">
      {/* Selected Date Header */}
      <h2 className="text-lg font-semibold text-gray-900">{selectedDate}</h2>

      {/* Event List - Scrollable */}
      <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-3 bg-gray-100 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-800">{event.title}</p>
              <p className="text-xs text-gray-600">{selectedDate}</p>
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
