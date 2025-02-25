"use client";
import React, { useState } from "react";
import SearchHomeClassModal from "./SearchHomeClassModal";
import { ModalOverlay } from "@/components/ModalOverlay";
import Form from "next/form";
import { NewCourse } from "@/lib/actions";

const CourseForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomeClass, setSelectedHomeClass] = useState<{ id: string; name: string } | null>(null);


  return (
    <Form className="p-6" action={(formData: FormData ) => {formData.append("homeClassId", selectedHomeClass?.id || ""); NewCourse(formData) }}>

      {/* Selected Home Class Display */}
      {selectedHomeClass ? (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">Selected Class: {selectedHomeClass.name}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">No class selected.</p>
      )}

      {/* Button to Open Modal */}
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={() => setIsModalOpen(true)}
      >
        Select Class
      </button>

      {/* Modal */}
      <ModalOverlay onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} title={"Select a class"}>
        <SearchHomeClassModal
          onClose={() => setIsModalOpen(false)}
          onSelect={(item) => {
            setSelectedHomeClass(item);
            setIsModalOpen(false);
          }}
        />
      </ModalOverlay>
      
      {/* Submit Button */}
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
        Create Course
      </button>
    </Form>
  );
};

export default CourseForm;
