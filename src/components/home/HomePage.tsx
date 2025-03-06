"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import BigButton from '../Common/Buttons/BigButton';

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
        <BigButton
          onClick={() => router.push('/calendar/week')}
          iconPath="M8 7V3M16 7V3M4 11h16M4 19h16M4 15h16"
          label="Week Calendar"
          delay={0.2}
        />
        <BigButton
          onClick={() => router.push('/calendar/year')}
          iconPath="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
          label="Year Calendar"
          delay={0.4}
        />
        <BigButton
          onClick={() => router.push('/announcements')}
          iconPath="M11 5l6-3v16l-6-3H5a2 2 0 01-2-2V7a2 2 0 012-2h6zM19 9v6M15 12h4"
          label="Announcements"
          delay={0.6}
        />
        <BigButton
          onClick={() => router.push('/myaccount')}
          iconPath="M12 2C10.343 2 9 3.343 9 5s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM4 20c0-3.313 4-4 8-4s8 .687 8 4"
          label="My account"
          delay={0.8}
        />
      </div>
    </div>
  );
};

export default HomePage;