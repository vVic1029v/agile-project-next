import React from "react";
import { auth } from "@/lib/auth";
import CourseForm from "@/components/new/course/CourseForm";  // Separate form component

export default async function NewCourse() {
  const sess = await auth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 rounded-2xl bg-white shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Create a New Course</h1>
        {sess ? (
          <CourseForm />
        ) : (
          <p className="text-gray-600">You must be logged in to create a course.</p>
        )}
      </div>
    </div>
  );
}
