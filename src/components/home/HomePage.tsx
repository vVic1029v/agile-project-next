"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 bg-gradient-to-br from-white via-blue-50 to-blue-300">

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-8"
      >
        Welcome to Your Calendar Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.button
          onClick={() => router.push('/calendar/week')}
          className="group relative w-full py-4 px-8 cursor-pointer border-2 border-transparent hover:border-cyan-400 rounded-xl shadow-md flex items-center justify-center bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg
            className="w-14 h-14 mr-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3M16 7V3M4 11h16M4 19h16M4 15h16" />
          </svg>
          <span className="text-xl font-semibold text-gray-800 text-shadow-md">Week Calendar</span>
        </motion.button>

        <motion.button
          onClick={() => router.push('/calendar/year')}
          className="group relative w-full py-4 px-8 cursor-pointer border-2 border-transparent hover:border-cyan-400 rounded-xl shadow-md flex items-center justify-center bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <svg
            className="w-14 h-14 mr-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
          </svg>
          <span className="text-xl font-semibold text-gray-800 text-shadow-md">Year Calendar</span>
        </motion.button>

        <motion.button
          onClick={() => router.push('/announcements')}
          className="group relative w-full py-4 px-8 cursor-pointer border-2 border-transparent hover:border-cyan-400 rounded-xl shadow-md flex items-center justify-center bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }} 
        >
          <svg
            className="w-14 h-14 mr-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l6-3v16l-6-3H5a2 2 0 01-2-2V7a2 2 0 012-2h6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9v6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h4" />
          </svg>
          <span className="text-xl font-semibold text-gray-800 text-shadow-md">Announcements</span>
        </motion.button>

      
        <motion.button
          onClick={() => router.push('/myaccount')}
          className="group relative w-full py-4 px-8 cursor-pointer border-2 border-transparent hover:border-cyan-400 rounded-xl shadow-md flex items-center justify-center bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <svg
            className="w-14 h-14 mr-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C10.343 2 9 3.343 9 5s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM4 20c0-3.313 4-4 8-4s8 .687 8 4" />
          </svg>
          <span className="text-xl font-semibold text-gray-800 text-shadow-md">My account</span>
        </motion.button>

      </div>
    </div>
  );
};

export default HomePage;
