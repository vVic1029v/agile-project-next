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
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/uploads/frontyard.webp')] px-4 z[-2]">
        <div className="absolute inset-0 bg-black bg-opacity-70 z[-1]"></div>
        <div className="p-6 rounded-lg bg-red-100 border-2 border-red-500 text-center max-w-lg w-full z-10">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-xl text-gray-700">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-stone-100 bg-cover bg-center bg-[url('/uploads/frontyard.webp')] px-4 z[-2]" >
  
   <div className="absolute inset-0 bg-black bg-opacity-70 z[-1]"></div>
      <motion.div className="p-6 rounded-2xl bg-neutral-100 shadow-lg max-w-lg w-full z-10"
       initial={{ opacity: 0 }} 
       animate={{ opacity: 1 }}
       transition={{ duration: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-extrabold  text-neutral-700">Create a New Course</h1>
        <CourseForm />
      </motion.div>
    </motion.div>
  );
}
