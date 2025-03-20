"use client";

import { useRef, useState, useEffect, ReactNode, Fragment } from 'react';
import Panel from './Panel'; // Import the new Panel component

interface ScrollPanelsProps {
  children: ReactNode[];
}

export default function ScrollPanels({ children }: ScrollPanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const totalPanels = children.length;

  // Handle scroll events
  const handleScroll = () => {
    if (containerRef.current && !isManualScroll) {
      const scrollLeft = containerRef.current.scrollLeft;
      const containerWidth = containerRef.current.clientWidth;
      const panelWidth = containerWidth * 0.8; // 80% width for each panel
      const newIndex = Math.round(scrollLeft / panelWidth);
      setActiveIndex(newIndex);
    }
  };

  // Scroll to specific panel with animation
  const scrollToPanel = (index: number) => {
    if (containerRef.current) {
      setIsManualScroll(true);
      const containerWidth = containerRef.current.clientWidth;
      const panelWidth = containerWidth * 0.8;
      const targetScroll = index * panelWidth;
      
      containerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      // Update active index after animation completes
      setTimeout(() => {
        setActiveIndex(index);
        setIsManualScroll(false);
      }, 500);
    }
  };

  // Optional: Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollToPanel(activeIndex - 1);
      if (e.key === 'ArrowRight') scrollToPanel(activeIndex + 1);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeIndex]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="gap-x-[10vw] flex h-full w-full snap-x snap-mandatory overflow-visible scroll-smooth pl-[10%] pr-[10%]"
      >
        {/* Panels */}
        <>
          {children.map((child, index) => (
            <Fragment key={index}>{child}</Fragment>
          ))}
        </>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scrollToPanel(activeIndex - 1)}
        disabled={activeIndex === 0}
        className="fixed left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-4 backdrop-blur-lg transition-all hover:bg-white/50 disabled:opacity-0"
      >
        ←
      </button>
      <button
        onClick={() => scrollToPanel(activeIndex + 1)}
        disabled={activeIndex === totalPanels - 1}
        className="fixed right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-4 backdrop-blur-lg transition-all hover:bg-white/50 disabled:opacity-0"
      >
        →
      </button>
    </div>
  );
}