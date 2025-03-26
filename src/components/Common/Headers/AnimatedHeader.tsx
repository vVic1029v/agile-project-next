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
      className="text-4xl sm:text-5xl  font-extrabold  text-neutral-800 ml-4"
      style={{ lineHeight: '1.5' }}
    >
      {text}
    </motion.h1>
  );
};

export default AnimatedHeader;