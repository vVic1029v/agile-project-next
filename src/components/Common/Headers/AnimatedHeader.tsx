"use client"
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHeaderProps {
  text: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ text }) => {
  return (
    <motion.h1
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-8"
    >
      {text}
    </motion.h1>
  );
};

export default AnimatedHeader;