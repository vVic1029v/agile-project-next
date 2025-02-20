"use client";
import React, { useState } from "react";
import SearchHomeClassModal from "./SearchHomeClassModal";
import { ModalOverlay } from "@/components/calendar/event-modal/ModalOverlay";

const CourseForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomeClass, setSelectedHomeClass] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create Course</h2>

      {/* Selected Home Class Display */}
      {selectedHomeClass ? (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">Selected Home Class: {selectedHomeClass.name}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">No home class selected.</p>
      )}

      {/* Button to Open Modal */}
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={() => setIsModalOpen(true)}
      >
        Select Home Class
      </button>

      {/* Modal */}
      <ModalOverlay onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
        <SearchHomeClassModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(item) => {
            setSelectedHomeClass(item);
            setIsModalOpen(false);
          }}
        />
      </ModalOverlay>
    </div>
  );
};

export default CourseForm;
