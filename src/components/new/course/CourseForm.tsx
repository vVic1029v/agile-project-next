"use client";
import React, { useState } from "react";
import SearchHomeClassModal from "./SearchHomeClassModal";
import { ModalOverlay } from "@/components/ModalOverlay";
import { SelectedDate } from "@/components/calendar/useCalendarState";
import ModalWeekCalendar from "@/components/ModalWeekCalendar";
import { NewCourse } from "@/lib/actions";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

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

    const formData = new FormData();
    formData.set("query", courseName);
    formData.set("homeClassId", selectedHomeClass.id);
    formData.set("teacherEmail", professorEmail);
    formData.set("subject", courseName);
    formData.set("weekScheduleIdentifier", JSON.stringify(selectedTimeSlots));
    formData.set("color", color);
    const results = await NewCourse(formData);
    }
    catch (err: any) {
      setError(err.message);
  }finally {
    setLoading(false);
  }}

  return (
    <form className="p-6" onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block font-semibold text-gray-800">Course Name:</label>
        <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Enter course name" />
      </div>

      <div className="mb-4">
        <label className="block font-semibold text-gray-800">Professor's Email:</label>
        <input type="email" value={professorEmail} onChange={(e) => setProfessorEmail(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Enter professor's email" />
      </div>
      <div className="mb-4">
  <label className="block font-semibold text-gray-800">Select Color:</label>
  <input
    type="color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="w-full p-2 border rounded-md cursor-pointer"
  />
</div>
      <div className="flex items-center">
        <button type="button" className="px-4 py-2 bg-cyan-600 text-white rounded-md mt-5" onClick={() => setIsModalOpenSearchHomeClass(true)}>Select Class</button>
        {selectedHomeClass ? <p className="ml-5 text-cyan-800 mt-5">Selected Class: {selectedHomeClass.name}</p> : <p className="ml-5 text-gray-500 mt-5">No class selected.</p>}
      </div>

      <ModalOverlay onClose={() => setIsModalOpenSearchHomeClass(false)} isOpen={isModalOpenSearchHomeClass} title="Select a class">
        <SearchHomeClassModal onClose={() => setIsModalOpenSearchHomeClass(false)} onSelect={(item) => { setSelectedHomeClass(item); setIsModalOpenSearchHomeClass(false); }} />
      </ModalOverlay>

      <div className="flex items-center mt-5">
        <button type="button" className="px-4 py-2 bg-cyan-600 text-white rounded-md" onClick={() => setIsModalOpenPeriodSelect(true)}>Select Period</button>
      </div>

      <ModalOverlay onClose={() => setIsModalOpenPeriodSelect(false)} isOpen={isModalOpenPeriodSelect} title="Select a period">
        <ModalWeekCalendar selectedTimeSlots={selectedTimeSlots} handleSelectTimeSlot={handleSelectTimeSlot} />
      </ModalOverlay>

      {selectedTimeSlots.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Selected Time Slots:</h3>
          <ul className="mt-2 space-y-2">
            {selectedTimeSlots.map((slot, index) => (
              <li key={index} className="text-gray-700 flex justify-between">
                <span>{dayLabels[slot.dayWeek]}</span>
                <span>{`Period ${slot.period}`}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md mt-6" disabled={loading}>{loading ? "Creating..." : "Create Course"}</button>
    </form>
  );
};

export default CourseForm;
