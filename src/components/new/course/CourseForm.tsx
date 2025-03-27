"use client";
import React, { useState } from "react";
import SearchHomeClassModal from "./SearchHomeClassModal";
import { ModalOverlay } from "@/components/ModalOverlay";
import { SelectedDate } from "@/components/calendar/useCalendarState";
import ModalWeekCalendar from "@/components/ModalWeekCalendar";
import { NewCourse } from "@/lib/actions";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const subjects = [
  "English",
  "French",
  "Romanian",
  "Chemistry",
  "Physics",
  "Math",
  "Sports",
  "Religion",
  "Economy",
  "Psychology",
  "Sociology",
  "Logical Thinking",
  "Informatics",
  "History",
  "Geography",
  "Holocaust History",
  "Drawing",
  "Biology",
  "Latin"
];

const CourseForm: React.FC = () => {
  const [isModalOpenSearchHomeClass, setIsModalOpenSearchHomeClass] = useState(false);
  const [isModalOpenPeriodSelect, setIsModalOpenPeriodSelect] = useState(false);
  const [selectedHomeClass, setSelectedHomeClass] = useState<{ id: string; name: string } | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<SelectedDate[]>([]);
  const [courseName, setCourseName] = useState(""); 
  const [professorEmail, setProfessorEmail] = useState("");
  const [color, setColor] = useState("#000000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelectTimeSlot(date: SelectedDate): void {
    setSelectedTimeSlots((prevSlots) => {
      const isSelected = prevSlots.some(
        (slot) => slot.dayWeek === date.dayWeek && slot.period === date.period
      );
      return isSelected
        ? prevSlots.filter((slot) => !(slot.dayWeek === date.dayWeek && slot.period === date.period))
        : [...prevSlots, date];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!selectedHomeClass) {
      setError("Please select a class.");
      setLoading(false);
      return;
    }
    if (!professorEmail) {
      setError("Please enter a professor's email.");
      setLoading(false);
      return;
    }
  
    try {
      const parsedWeekScheduleIdentifier = JSON.stringify(selectedTimeSlots);
      console.log("weekScheduleIdentifierRaw:", parsedWeekScheduleIdentifier);
   
      const formData = new FormData();
      formData.set("query", courseName);
      formData.set("homeClassId", selectedHomeClass.id);
      formData.set("teacherEmail", professorEmail);
      formData.set("subject", courseName);
      formData.set("weekScheduleIdentifier", parsedWeekScheduleIdentifier); 
      formData.set("color", color);
  
      const results = await NewCourse(formData);
      alert("Course created successfully!");
      setCourseName("");
      setProfessorEmail("");
      setSelectedHomeClass(null);
      setSelectedTimeSlots([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="p-6" onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block font-semibold text-neutral-700">Course Name:</label>
        <select
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full p-2 border rounded-md text-neutral-900 bg-transparent focus:ring-neutral-500 transition duration-200"
        >
          <option value="">Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject} className="bg-trasnparent">
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-neutral-900">Professor's Email:</label>
        <input 
          type="email" 
          value={professorEmail} 
          onChange={(e) => setProfessorEmail(e.target.value)} 
          className="w-full p-2 border rounded-md text-neutral-900 bg-transparent focus:ring-neutral-500 transition duration-200" 
          placeholder="Enter professor's email" 
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-neutral-900">Select Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full p-2 border rounded-md cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <button 
          type="button" 
          className="px-6 py-2 mr-2 bg-neutral-800 text-white rounded-md mt-5 hover:bg-neutral-900 transition" 
          onClick={() => setIsModalOpenSearchHomeClass(true)}
        >
          Select Class
        </button>
        {selectedHomeClass ? (
          <p className="ml-5 text-neutral-700 mt-5">Selected Class: {selectedHomeClass.name}</p>
        ) : (
          <p className="ml-5 text-gray-500 mt-5">No class selected.</p>
        )}
      </div>

      <ModalOverlay onClose={() => setIsModalOpenSearchHomeClass(false)} isOpen={isModalOpenSearchHomeClass} title="Select a class">
        <SearchHomeClassModal onClose={() => setIsModalOpenSearchHomeClass(false)} onSelect={(item) => { setSelectedHomeClass(item); setIsModalOpenSearchHomeClass(false); }} />
      </ModalOverlay>

      <div className="flex items-center mt-5">
        <button 
          type="button" 
          className="px-5 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-900 transition" 
          onClick={() => setIsModalOpenPeriodSelect(true)}
        >
          Select Period
        </button>
      </div>

      <ModalOverlay onClose={() => setIsModalOpenPeriodSelect(false)} isOpen={isModalOpenPeriodSelect} title="Select a period">
        <ModalWeekCalendar selectedTimeSlots={selectedTimeSlots} handleSelectTimeSlot={handleSelectTimeSlot} />
      </ModalOverlay>

      {selectedTimeSlots.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-neutral-900">Selected Time Slots:</h3>
          <ul className="mt-2 space-y-2">
            {selectedTimeSlots
              .filter((slot) => slot && typeof slot.dayWeek === "number" && typeof slot.period === "number")
              .map((slot, index) => (
                <li key={index} className="text-neutral-900 flex justify-between">
                  <span>{dayLabels[slot.dayWeek]}</span>
                  <span>{`Period ${slot.period}`}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      <button 
        type="submit" 
        className="px-4 py-2 bg-neutral-600 text-white rounded-md mt-6 hover:bg-neutral-800 transition" 
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
};

export default CourseForm;
