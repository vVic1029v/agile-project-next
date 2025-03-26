'use client';
import React from "react";
import { auth } from "@/lib/auth";
import CourseForm from "@/components/new/course/CourseForm";  // Separate form component
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function NewCourse() {
 
  const { data: session } = useSession();
  
  if (!session || session.user.userType !== "FACULTYMEMBER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-300">
        <div className="p-6 rounded-lg bg-red-100 border-2 border-red-500 text-center max-w-lg w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-xl text-gray-700">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-stone-100"
  
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}>
      <div className="p-6 rounded-2xl bg-white shadow-lg max-w-lg w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold  text-neutral-700">Create a New Course</h1>
        <CourseForm />
      </div>
    </motion.div>
  );
}
