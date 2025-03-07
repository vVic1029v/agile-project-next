"use client"
import React from 'react';
import { motion } from 'framer-motion';

interface BigButtonProps {
  onClick?: () => void;
  iconPath: string;
  label: string;
  delay: number;
}

const BigButton: React.FC<BigButtonProps> = ({ onClick, iconPath, label, delay }) => {
  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full py-4 px-8 cursor-pointer border-2 border-transparent hover:border-cyan-400 rounded-xl shadow-md flex items-center justify-center bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <svg
        className="w-14 h-14 mr-4 text-cyan-500 group-hover:text-cyan-600 transition-colors"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
      <span className="text-xl font-semibold text-gray-800 text-shadow-md">{label}</span>
    </motion.button>
  );
};

export default BigButton;