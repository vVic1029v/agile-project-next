import React, { useRef, useState, useEffect, ReactNode } from 'react';
import Panel from './Panel'; // Import the new Panel component

interface ScrollPanelsProps {
  children: ReactNode[];
  onActiveIndexChange: (index: number) => void;
}

export type ScrollPanelsRef = {
  scrollToPanel: (index: number) => void;
};

const ScrollPanels = React.forwardRef<ScrollPanelsRef, ScrollPanelsProps>(({ children, onActiveIndexChange }, ref) => {
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

      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        onActiveIndexChange(newIndex); // Call the callback here
      }
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
        onActiveIndexChange(index);
        
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

  // Expose the scrollToPanel function through the ref
  React.useImperativeHandle(ref, () => ({
    scrollToPanel
  }));

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Scroll Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-visible scroll-smooth scrollbar-hide"
      >
        {/* Panels */}
        {children.map((child, index) => (
          <Panel key={index}>{child}</Panel>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
  onClick={() => scrollToPanel(activeIndex - 1)}
  disabled={activeIndex === 0}
  className="fixed left-18 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-4 backdrop-blur-lg transition-all hover:bg-white/50 disabled:opacity-0 z-50"
>
  ←
</button>
<button
  onClick={() => scrollToPanel(activeIndex + 1)}
  disabled={activeIndex === totalPanels - 1}
  className="fixed right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-4 backdrop-blur-lg transition-all hover:bg-white/50 disabled:opacity-0 z-50"
>
  →
</button>
    </div>
  );
});
ScrollPanels.displayName = 'ScrollPanels'; // Set display name for debugging
export default ScrollPanels;
