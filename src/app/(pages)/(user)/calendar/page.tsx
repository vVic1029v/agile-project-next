"use client"

import { useRef, useState, useEffect } from 'react';

export default function ScrollPanels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const totalPanels = 3;

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
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth pl-[10%] pr-[10%]"
      >
        {/* Panels */}
        {[...Array(totalPanels)].map((_, index) => (
          <section
            key={index}
            className="h-full w-[80%] shrink-0 snap-center bg-gray-100 p-8 transition-transform duration-500 ease-in-out"
          >
            <h1 className="text-4xl font-bold">Panel {index + 1}</h1>
            <p className="mt-4 text-gray-600">Content goes here</p>
          </section>
        ))}
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