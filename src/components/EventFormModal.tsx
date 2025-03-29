'use client';

import React, { useState, useEffect } from 'react';
import { getTimeSlot, getTimeSlots, getUserCourses, postEventAction } from '@/lib/database/database'; // Server action pentru API
import { useSession} from "next-auth/react";
import { daysOfWeek } from '@/lib/calendarUtils';
import { AlltimeSlots, userCourses } from '@/lib/actions';
import { useCalendarStateContext } from './calendar/CalendarStateProvider';
interface EventFormProps {
  selectedDate: { year: number; month: number; day: number; week: number };
  onClose: () => void;
 
}
interface TimeSlot {
    id: string;
    homeClassId: string | null;
    dayOfWeek: number;
    periodOfDay: number | null;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    courseId: string;
  }
  
  interface Course {
    id: string;
    name: string;
    timeSlots: TimeSlot[];
  }
    interface EventData {
        title: string;
        type: string;
        courseId: string;
        timeSlotId?: string;
        yearNumber: number;
        weekNumber: number;
        dayOfWeek: number;
        startHour?: number;
        startMinute?: number;
        endHour?: number;
        endMinute?: number;
    }  

const EventFormModal= ({ selectedDate, onClose}: EventFormProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [courseId, setCourseId] = useState('');
  const [timeSlotId, setTimeSlotId] = useState<string | undefined>(undefined);
  const [startHour, setStartHour] = useState<number | undefined>();
  const [startMinute, setStartMinute] = useState<number | undefined>();
  const [endHour, setEndHour] = useState<number | undefined>();
  const [endMinute, setEndMinute] = useState<number | undefined>();
  const [courses, setCourses] = useState<{ id: string; }[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const { setSelectedDate, updateUrl, isModalOpen, setIsModalOpen } = useCalendarStateContext();
  const { data: session } = useSession();
    useEffect(() => {
     async function fetchData() {
            if(!session) return;
            const userId = session.user.id;
            const userType= session.user.userType;
          // Fetch existing courses and time slots
          const courseRes = await userCourses(userId);
          const timeSlotRes = await AlltimeSlots(courseId);
          const formattedCourses = courseRes.map(course => ({
            id: course.id, // Adaugă un fallback pentru nume
          
        }));
        
     if (courseRes) setCourses(formattedCourses);
     if (timeSlotRes) {
        const formattedTimeSlots = timeSlotRes.map((slot: TimeSlot) => ({
        id: slot.id,
        label: `${daysOfWeek[slot.dayOfWeek]} ${slot.startHour}:${String(slot.startMinute).padStart(2, '0')} - ${slot.endHour}:${String(slot.endMinute).padStart(2, '0')}`,
        }));
        setTimeSlots(formattedTimeSlots);
    }
    }
    fetchData();
})
  , [courseId, session] ;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const eventData = {
      title,
      type,
      courseId,
      timeSlotId,
      yearNumber: selectedDate.year,
      weekNumber: selectedDate.week,
      dayOfWeek: selectedDate.day,
      startHour: timeSlotId ? undefined : startHour,
      startMinute: timeSlotId ? undefined : startMinute,
      endHour: timeSlotId ? undefined : endHour,
      endMinute: timeSlotId ? undefined : endMinute,
    };

    const response = await postEventAction(eventData);
    if (response.success) {
      alert('Event created successfully!');
      onClose();
    } else {
      alert('Failed to create event');
    }
    setLoading(false);
  };

  return (
   
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-4">Add Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          className="w-full border p-2 rounded mb-2"
          required
        />
        
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded mb-2">
          <option value="">Select Type</option>
          <option value="lecture">Lecture</option>
          <option value="seminar">Seminar</option>
        </select>
        
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full border p-2 rounded mb-2">
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.id}</option>
          ))}
        </select>
        
        <select value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value || undefined)} className="w-full border p-2 rounded mb-2">
          <option value="">Select Time Slot (Optional)</option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>{slot.label}</option>
          ))}
        </select>

        {/* {!timeSlotId && (
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={startHour || ''} onChange={(e) => setStartHour(Number(e.target.value))} placeholder="Start Hour" min="0" max="23" className="border p-2 rounded" required />
            <input type="number" value={startMinute || ''} onChange={(e) => setStartMinute(Number(e.target.value))} placeholder="Start Minute" min="0" max="59" className="border p-2 rounded" required />
            <input type="number" value={endHour || ''} onChange={(e) => setEndHour(Number(e.target.value))} placeholder="End Hour" min="0" max="23" className="border p-2 rounded" required />
            <input type="number" value={endMinute || ''} onChange={(e) => setEndMinute(Number(e.target.value))} placeholder="End Minute" min="0" max="59" className="border p-2 rounded" required />
          </div>
        )} */}
         <input
                type="time" 
                onChange={(e => {
                    const [hour, minute] = e.target.value.split(':');
                    setStartHour(Number(hour));
                    setStartMinute(Number(minute));
                    setEndHour(Number(hour));
                    setEndMinute(Number(minute));
                })}
                className="w-full border p-2 rounded mb-2"
                />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4" disabled={loading}>
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default EventFormModal;
