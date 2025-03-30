import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useCalendarStateContext } from './calendar/CalendarStateProvider';
import { userCourses, AlltimeSlots} from '@/lib/actions';
import emailjs from '@emailjs/browser';
import { getCourseUserEmails } from '@/lib/actions';
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
  description?: string;
}

const EventFormModal = ({ selectedDate, onClose }: EventFormProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [courseId, setCourseId] = useState('');
  const [timeSlotId, setTimeSlotId] = useState<string | undefined>(undefined);
  const [startHour, setStartHour] = useState<number | undefined>();
  const [startMinute, setStartMinute] = useState<number | undefined>();
  const [endHour, setEndHour] = useState<number | undefined>();
  const [endMinute, setEndMinute] = useState<number | undefined>();
  const [description, setDescription] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      const userId = session.user.id;
      const userType = session.user.userType;
      const courseRes = await userCourses(userId);
    
      if (courseRes) {
        // Transform the data to match the Course interface
        const courses = courseRes.map((course) => ({
          id: course.id, // Ensure the `id` is present in the response
          name: course.subject || "Unnamed Course", // Add a fallback for `name`
          timeSlots: course.timeSlots,
        }));
  
        setCourses(courses);
      }
    }
    fetchData();
  }, [session]);
  

  useEffect(() => {

    async function fetchTimeSlots() {
      if (courseId) {
        const timeSlotRes = await AlltimeSlots(courseId);
        if (timeSlotRes) {
          setTimeSlots(timeSlotRes.map((slot: TimeSlot) => ({
            id: slot.id,
            label: `${slot.startHour}:${String(slot.startMinute).padStart(2, '0')} - ${slot.endHour}:${String(slot.endMinute).padStart(2, '0')}`,
          })));
        }
      }
    }
    fetchTimeSlots();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const emailsUser= await getCourseUserEmails(courseId);
    if (!emailsUser) {
      alert("No emails found for the selected course.");
      setLoading(false);
      return;
    }
    const eventData: EventData = {
      title,
      type: type === "PROJECT" ? "MISC" : type,
      courseId,
      timeSlotId,
      yearNumber: selectedDate.year,
      weekNumber: selectedDate.week,
      dayOfWeek: selectedDate.day,
      startHour: timeSlotId ? undefined : startHour,
      startMinute: timeSlotId ? undefined : startMinute,
      endHour: timeSlotId ? undefined : endHour,
      endMinute: timeSlotId ? undefined : endMinute,
      description,
    };

    const response = await fetch('/api/newEvent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session?.user.id, eventData }),
    });

   
  if (response.ok) {
    alert('Event created successfully!');
    try {
     const recipients = await getCourseUserEmails(courseId);
      const templateParams = {
        title:eventData.title,
        type: eventData.type,
        description: eventData.description,
        startHour: eventData.startHour,
        startMinute: eventData.startMinute,
        endHour: eventData.endHour,
        endMinute: eventData.endMinute,
        email_from: "info.application255@gmail.com",
        to_email: recipients.join(',')
      };
      await emailjs.send("service_n98pet1", "template_h9s309t", templateParams, "8mP7DE5cZlsMFWHWO");
    } catch (error) {
      console.error("Error sending email notifications:", error);
    }
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
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event Description"
          className="w-full border p-2 rounded mb-2"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border p-2 rounded mb-2">
          <option value="">Select Type</option>
          <option value="HOMEWORK">Homework</option>
          <option value="TEST">Test</option>
          <option value="PROJECT">Project</option>
        </select>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full border p-2 rounded mb-2">
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        <select value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value || undefined)} className="w-full border p-2 rounded mb-2">
          <option value="">Select Time Slot</option>
          {timeSlots.map((slot) => (
            <option key={slot.id} value={slot.id}>{slot.label}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4" disabled={loading}>
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default EventFormModal;
