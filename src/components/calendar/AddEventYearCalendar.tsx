import React, { useState } from "react";
import { ModalOverlay } from "@/components/ModalOverlay";
import { SelectedDate } from "./useCalendarState";

interface AddEventButtonProps {
  selectedDate: SelectedDate;
}

const AddEventButton: React.FC<AddEventButtonProps> = ({ selectedDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYearCalendarModalOpen, setIsYearCalendarModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleOpenYearCalendarModal = () => {
    // Închide modalul curent și deschide doar YearCalendar
    setIsModalOpen(true);
    setIsYearCalendarModalOpen(true);
  };
 
  return (
    <>
     <button
      
      type="button"
      onClick={(e) => {
        e.stopPropagation(); // Previi ca click-ul să ajungă la handler-ul de click al zilei
        handleOpenYearCalendarModal(); // Deschide doar YearCalendar
      }}
      className="flex absolute right-2 top-2 rounded-full opacity-0 transition-all focus:opacity-100 group-hover:opacity-100 z-50"
    >
      <svg
        className="size-8 scale-90 text-blue-500 transition-all hover:scale-100 group-focus:scale-100"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fillRule="evenodd"
          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
      <ModalOverlay isOpen={isModalOpen} onClose={handleCloseModal} title="Add Event">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              value={`${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              placeholder="Enter event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
              placeholder="Enter event description"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-cyan-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </ModalOverlay>
    </>
  );
};

export default AddEventButton;