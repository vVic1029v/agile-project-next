'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/Modal';
import { getCourses } from '@/lib/actions'; // Importă server action-ul
import { getWeekAndDay } from '@/lib/calendarUtils';
import { Event ,TimeSlot} from '@/components/calendar/week/UserWeekCalendar'; // Asigură-te că ai importat corect tipul Event
import EventFormModal from './EventFormModal';
interface DayEventsModalProps {
  selectedDate: { year: number; month: number; day: number; week: number };
  isOpen: boolean;
  events: Event[]; 
  onClose: () => void;
}

interface Course {
    subject: string;
  id: string;

}

const DayEventsModal: React.FC<DayEventsModalProps> = ({ selectedDate, isOpen, onClose,  }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const closeModal = () => {
      setIsModalOpen(false);
    };
  const handleNewEvent = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    async function fetchData() {
      if (!session || !selectedDate || !isOpen) return;
  
      const userId = session.user.id;
  
      // Fetch events
      const eventsResponse = await fetch(`/api/getEvents?userId=${userId}`);
      const eventsData = await eventsResponse.json();
      console.log('Fetched events:', eventsData);
  
      // Fetch courses
      const userType = session.user.userType;
      const coursesData = await getCourses(userId, userType);
      const selectedDayOfWeek = new Date(selectedDate.year, selectedDate.month, selectedDate.day).getDay() -1;
      console.log("Computed Day of Week:", selectedDayOfWeek);
        console.log("Selected Date:", selectedDate);      
      const { week } = getWeekAndDay(selectedDate.year, selectedDate.month + 1, selectedDate.day); // Obține numărul săptămânii
      
      const filteredEvents = eventsData.events.filter((event: Event) => {
          return (
              event.timeSlot.dayOfWeek === selectedDayOfWeek && // Compara corect cu ziua săptămânii
              event.yearNumber === selectedDate.year &&
              event.weekNumber === week // Folosim săptămâna corectă
          );
      });
      
        console.log("Filtered events:", filteredEvents);
      
        setEvents(filteredEvents);
        setCourses(coursesData ?? []);
      
      
    }
  
    fetchData();
  }, [session, selectedDate, isOpen]);
  
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          Events on {selectedDate.day}/{selectedDate.month + 1}/{selectedDate.year}
        </h2>
        {events.length > 0 ? (
      <ul className="space-y-3">
      {events.map((event) => {
        const course = courses.find((course) => course.id === event.courseId);
        return (
          <li key={event.id} className="p-4 bg-gray-100 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-md text-white text-sm font-semibold ${
                event.type === "MISC" ? "bg-purple-500" : "bg-blue-500"
              }`}>
                {event.type === "MISC" ? "PROJECT" : event.type}
              </span>
              <span className="text-gray-500 text-sm">
                {event.timeSlot.startHour}:{String(event.timeSlot.startMinute).padStart(2, '0')} - 
                {event.timeSlot.endHour}:{String(event.timeSlot.endMinute).padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-lg font-bold mt-2">{course ? course.subject : "Unknown Course"}</h3>
            {event.description && (
              <p className="text-sm text-gray-700 mt-1 italic">{event.description}</p>
            )}
          </li>
        );
      })}
    </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>
      <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 mt-6 "
              onClick={handleNewEvent}
            >
              Add new Event
            </button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
        <EventFormModal onClose={closeModal} selectedDate={selectedDate} />
      </Modal>
    </Modal>
  );
};

export default DayEventsModal;
