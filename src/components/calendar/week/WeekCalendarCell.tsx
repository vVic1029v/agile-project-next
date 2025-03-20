// WeekCalendarCell.tsx
import React from "react";
import { Event } from "@prisma/client";
import WeekCalendarCellWrapper from "./WeekCalendarCellWrapper";

export interface WeekCalendarCellProps {
  courseName?: string;
  events: Event[];
  onClick: () => void;
  color?: string | null;
  highlighted?: boolean;
  isWeekend?: boolean;
}

const WeekCalendarCell: React.FC<WeekCalendarCellProps> = ({
  courseName,
  events,
  onClick,
  color,
  highlighted = false,
  isWeekend,
}) => {
  return (
    <WeekCalendarCellWrapper onClick={onClick} highlighted={highlighted} isWeekend={isWeekend} isBlank={false} dayObj={{ month: -1, day: -1 }} isToday={false}>
      {/* <div
        onClick={onClick}
        className={`relative z-10 m-[-0.5px] group aspect-[4/3] w-full cursor-pointer font-medium transition-all rounded-3xl hover:z-20 hover:border-cyan-400
          ${highlighted ? "border-blue-700" : ""}
          md:size-[10vh] lg:size-[14vh] xl:size-[16vh]
        `}
      > */}
        {/* Tint overlay */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle, transparent 50%, ${color} 95%)`,
            opacity: 0.2,
          }}
        ></div>

        {/* Course Name */}
        <span className="absolute left-1 top-1 flex items-center justify-center text-sm">
          {courseName ? `${courseName}` : ""}
        </span>

        {/* Event Icons */}
        {events && events.length > 0 && (
          <div
            className="absolute bottom-[-2px] flex flex-wrap-reverse flex-row-reverse overflow-hidden w-full h-[90%] justify-start p-2 content-start"
            style={{
              WebkitMaskImage: "linear-gradient(to top, black 50%, transparent 80%)",
              maskImage: "linear-gradient(to top, black 50%, transparent 80%)",
            }}
          >
            {events.map((event, idx) => (
              <button
                key={idx}
                className="flex items-center justify-center w-[25%] aspect-square bg-gradient-to-bl from-cyan-500 to-blue-500 rounded-2xl hover:border-double border-white self-start"
                style={{ borderWidth: "0.2rem" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="m-auto"
                >
                  <path d="M12 2a10 10 0 1 1-10 10A10 10 0 0 1 12 2zm0 18a8 8 0 1 0-8-8 8 8 0 0 0 8 8zm1-13h-2v6h6v-2h-4z" />
                </svg>
              </button>
            ))}
          </div>
        )}
      {/* </div> */}
    </WeekCalendarCellWrapper>
  );
};

export default WeekCalendarCell;
