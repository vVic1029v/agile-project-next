"use client";

import { useState } from "react";
import StudentSearchModal from "./StudentSearchModal";
import { addStudentToClass } from "@/lib/actions";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ClientStudentSearchProps {
  classId: string;
}

export default function ClientStudentSearch({ classId }: ClientStudentSearchProps) {
  const [showModal, setShowModal] = useState(false);

  const handleAddStudent = async (student: Student) => { // 🔥 Acum primește `Student`
    try {
      const result = await addStudentToClass(student.email, classId);
      if (!result.success) throw new Error("Eroare la adăugare");

      alert("Student added successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Failed to add student.");
    }
  };

  return (
    <div className="mt-4 bg-neutral-100">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-neutral-700 hover:bg-neutral-900 text-white rounded-md ml-5"
      >
        Add Student
      </button>

      {showModal && (
        <StudentSearchModal
          classId={classId}
          onClose={() => setShowModal(false)}
          onSelect={handleAddStudent} // ✅ Acum primește direct `Student`
        />
      )}
    </div>
  );
}
