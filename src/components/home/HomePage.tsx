"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const quotes = [
  { text: "You don’t have to be great to start, but you have to start to be great.", author: "– Zig Ziglar" },
  { text: "There are no shortcuts to any place worth going.", author: "– Beverly Stills" },
  { text: "The best way to predict your future is to create it.", author: "– Abraham Lincoln" },
  { text: "In a world where you can be anything, be kind.", author: "– Jennifer Dukes Lee" },
  { text: "None of us is as smart as all of us.", author: "– Ken Blanchard" },
  { text: "Learn from yesterday. Live for today. Hope for tomorrow.", author: "- Albert Einstein" },
  { text: "Motivation is what gets you started. Habit is what keeps you going", author: " – Jim Ryun" },
  { text: "Success is the sum of small efforts, repeated.", author: "— R. Collier" },
  { text: "Don’t let what you cannot do interfere with what you can do.", author: "- John Wooden" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "- B.B. King" },
];

const HomePage: React.FC = () => {
  const [quote, setQuote] = useState<{ text: string; author: string }>({ text: '', author: '' });

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/uploads/frontyard.webp')] px-4">
      <div className="absolute inset-0 bg-black bg-opacity-70 z[-5]"></div>
      <div className="absolute top-4 right-4 space-y-4 hidden sm:block z-50">
        <a href="https://classroom.google.com/" className="block transform transition duration-300 hover:scale-110 ">
          <img src="/uploads/classroom.jpg" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" alt="Logo 1" />
        </a>
        <a href="https://www.24edu.ro/" className="block transform transition duration-300 hover:scale-110">
          <img src="/uploads/24edu.jpg" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" alt="Logo 2" />
        </a>
      </div>
      <motion.div className="relative z-10 bg-black bg-opacity-60 p-6 sm:p-10 text-center text-white w-full max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-wide drop-shadow-2xl leading-tight sm:leading-snug text-transparent bg-neutral-100 bg-clip-text">
          Welcome to your <span className="text-neutral-100">Frontyard!</span>
        </h1>
        
        {/* Logo centrat între titlu și citat */}
        <div className='flex flex-wrap justify-center gap-4 sm:gap-6  w-full'>
      
        <div className="flex justify-center my-6">
          <img src="/uploads/logo.jpg" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" alt="Logo" />
        </div>
       
        </div>
      
        
        <p className="mt-4 text-xl sm:text-2xl italic text-gray-300 font-serif relative">
          <span className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-500 opacity-20 blur-xl rounded-lg -z-10"></span>
          <span className="text-2xl sm:text-3xl">“</span>{quote.text}
          <span className="text-xl sm:text-2xl">”</span>
        </p>
        <p className="mt-4 text-lg sm:text-xl text-gray-400">
          {quote.author}
        </p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 w-full">
          {[ 
            { href: '/calendar', icon: 'fa-calendar-alt', label: 'Calendar' },
            { href: '/myclass', icon: 'fa-school', label: 'Homeclass' },
            { href: '/announcements', icon: 'fa-bullhorn', label: 'Announcements' },
            { href: '/myaccount', icon: 'fa-user', label: 'My Account' }
          ].map(({ href, icon, label }) => (
            <Link key={href} href={href} passHref>
              <button className="flex flex-col items-center justify-center gap-2 p-6 sm:p-8 w-48 sm:w-64 h-28 sm:h-32 bg-neutral-800 hover:bg-neutral-900 transition shadow-lg rounded-xl">
                <span className={`fas ${icon} text-3xl sm:text-4xl`}></span>
                <span className="text-sm sm:text-lg font-semibold text-white">{label}</span>
              </button>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
