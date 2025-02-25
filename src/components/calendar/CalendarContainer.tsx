import React from 'react';

interface CalendarContainerProps {
  children: React.ReactNode;
  isModalOpen?: boolean;
}

const CalendarContainter = ({ children, isModalOpen=false }: CalendarContainerProps) => (
  <div
    className={`relative flex h-screen max-h-screen w-full flex-col gap-4 items-center justify-center ${isModalOpen ? "pointer-events-none" : ""}`}>
    <div className="relative h-full w-full overflow-auto mt-[1vh]">
      {children}
    </div>
  </div>
);

export default CalendarContainter;