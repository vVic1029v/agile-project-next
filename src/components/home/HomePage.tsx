"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-50">
      {/* Week Calendar Button */}
      <button
        onClick={() => router.push('/calendar/week')}
        className="group relative w-full max-w-md aspect-square cursor-pointer border-2 font-medium transition-all hover:z-20 hover:border-cyan-400 rounded-3xl size-[15vh] flex flex-col items-center justify-center bg-white shadow-lg"
      >
        <svg
          className="w-16 h-16 mb-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* This icon represents a calendar with a week view */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3M16 7V3M4 11h16M4 19h16M4 15h16" />
        </svg>
        <span className="text-2xl font-semibold text-gray-800">Week Calendar</span>
      </button>

      {/* Year Calendar Button */}
      <button
        onClick={() => router.push('/calendar/year')}
        className="group relative w-full max-w-md aspect-square cursor-pointer border-2 font-medium transition-all hover:z-20 hover:border-cyan-400 rounded-3xl size-[15vh] flex flex-col items-center justify-center bg-white shadow-lg"
      >
        <svg
          className="w-16 h-16 mb-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {/* This icon represents a full calendar grid (year view) */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
        </svg>
        <span className="text-2xl font-semibold text-gray-800">Year Calendar</span>
      </button>


      <button
        onClick={() => router.push('/announcements')}
        className="group relative w-full max-w-md aspect-square cursor-pointer border-2 font-medium transition-all hover:z-20 hover:border-cyan-400 rounded-3xl size-[15vh] flex flex-col items-center justify-center bg-white shadow-lg"
      >
        <svg
  className="w-16 h-16 mb-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l6-3v16l-6-3H5a2 2 0 01-2-2V7a2 2 0 012-2h6z" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9v6" />
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h4" />
</svg>

          {/* This icon represents a full calendar grid (year view) */}
      
        <span className="text-2xl font-semibold text-gray-800 -mt-3">Announcements</span>
      </button>
    </div>
  );
};

export default HomePage;
