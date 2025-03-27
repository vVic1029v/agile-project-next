"use client";

import { useState, useEffect } from "react";
import { searchStudentsByEmail } from "@/lib/actions";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface StudentSearchModalProps {
  classId: string;
  onClose: () => void;
  onSelect: (student: Student) => void;
}

export default function StudentSearchModal({
  classId,
  onClose,
  onSelect,
}: StudentSearchModalProps) {
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email.trim()) {
      setStudents([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchStudentsByEmail(email, classId);
        setStudents(results);
      } catch (error) {
        console.error("Error searching students:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [email, classId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-neutral-100 p-6 rounded-lg shadow-lg w-96 ">
        <h2 className="text-lg font-semibold mb-4">Search and add Students</h2>

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by email"
          className="border p-2 w-full rounded-md bg-transparent focus:ring-neutral-500 transition duration-200"
        />

        <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
          {loading ? (
            <p className="p-2 text-blue-500">Searching...</p>
          ) : students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.id}
                onClick={() => onSelect(student)} 
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {student.firstName} {student.lastName} - {student.email}
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-500">No students found.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-400 text-white py-2 rounded-md bg-neutral-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}
