'use client';

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ContinuousCalendar } from "@/components/calendar/ContinuousCalendar";
import ModalBody from "./ModalBody";
import { useSession } from "next-auth/react";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function UserCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);
  // This state will hold all events for the user.
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      type: string;
      description: string | null;
      startTime: string;
      endTime: string;
      timeSlotId: string | null;
      weekNumber: number | null;
      yearNumber: number | null;
      courseId: string;
    }[]
  >([]);

  // Fetch all events for the user once the session is available.
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchAllEvents = async () => {
      try {
        const res = await fetch(`/api/getEvents?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        // Assumes your API returns { events: [...] } with each event including a `startTime` field.
        console.log(data.events);
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching all events:", error);
        setEvents([]);
      }
    };

    fetchAllEvents();
  }, [session?.user?.id]);

  // Compute a mapping from date keys (YYYY-MM-DD) to an array of event icons.
  // For now, we hard code the icon and the color for every event.
  const eventIconsMapping = useMemo(() => {
    return events.reduce<Record<string, Array<{ icon: string; color: string }>>>(
      (acc, event) => {
        const eventDate = new Date(event.startTime);
        const key = `${eventDate.getFullYear()}-${String(
          eventDate.getMonth() + 1
        ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;
        // Hard-coded icon and color.
        const icon = "http://www.w3.org/2000/svg"; // Replace with your SVG path
        const color = "#ff5733"; // Replace with your desired color
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({ icon, color });
        return acc;
      },
      {}
    );
  }, [events]);

  // If there's a query param for date, open the modal for that date.
  useEffect(() => {
    if (!session?.user?.id) return;

    const dateParam = searchParams.get("date");
    if (dateParam) {
      const [year, month, day] = dateParam.split("-").map(Number);
      setSelectedDate({ day, month: month - 1, year });
      setIsModalOpen(true);
    }
  }, [searchParams, session?.user?.id]);

  // When a day is clicked, update the URL and state.
  const handleDayClick = (day: number, month: number, year: number) => {
    if (!session?.user?.id) return;

    // Adjust month if needed.
    if (month < 0) {
      month = 11;
      year -= 1;
    }

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    router.push(`${pathname}?date=${dateString}`, { scroll: false });

    setSelectedDate({ day, month, year });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    router.push(pathname, { scroll: false });
    setIsModalOpen(false);
  };

  // Only show modal events for the selected date.
  const filteredEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.startTime);
        return (
          eventDate.getFullYear() === selectedDate.year &&
          eventDate.getMonth() === selectedDate.month &&
          eventDate.getDate() === selectedDate.day
        );
      })
    : [];

  if (status === "loading") return null;
  if (!session?.user) return null;

  return (
    <div>
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <ModalBody
              selectedDate={`${monthNames[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`}
              events={filteredEvents}
            />
          </div>
        </div>
      )}

      <div
        className={`relative flex h-screen max-h-screen w-full flex-col gap-4 px-4 pt-4 items-center justify-center ${
          isModalOpen ? "pointer-events-none" : ""
        }`}
      >
        <div className="relative h-full w-4/6 overflow-auto mt-20">
          <ContinuousCalendar
            onClick={handleDayClick}
            events={eventIconsMapping}
          />
        </div>
      </div>
    </div>
  );
}
