'use client';

import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface ContinuousCalendarProps {
  onClick?: (_day: number, _month: number, _year: number) => void;
  // Optional events mapping by date key (format: "YYYY-MM-DD")
  events?: { [key: string]: Array<{ icon: string; color: string }> };
}

/* =============================
   HELPER FUNCTIONS
============================= */
interface DayObj {
  month: number;
  day: number;
}

const getDaysInYear = (year: number): DayObj[] => {
  const days: DayObj[] = [];
  const startDayOfWeek = new Date(year, 0, 1).getDay();

  // Fill in days from previous year if needed
  if (startDayOfWeek < 6) {
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ month: -1, day: 32 - startDayOfWeek + i });
    }
  }

  // Add all days for each month of the year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ month, day });
    }
  }

  // Fill the last week with extra days (from next month)
  const lastWeekDayCount = days.length % 7;
  if (lastWeekDayCount > 0) {
    const extraDaysNeeded = 7 - lastWeekDayCount;
    for (let day = 1; day <= extraDaysNeeded; day++) {
      days.push({ month: 0, day });
    }
  }

  return days;
};

const chunkDaysIntoWeeks = (days: DayObj[]): DayObj[][] => {
  const weeks: DayObj[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};

// Helper function to darken/lighten a hex color by a percent.
// Pass a negative percent to darken (for the bezel accent).
const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.min(255, Math.max(0, R + Math.round(2.55 * percent)));
  G = Math.min(255, Math.max(0, G + Math.round(2.55 * percent)));
  B = Math.min(255, Math.max(0, B + Math.round(2.55 * percent)));

  const RR = R.toString(16).padStart(2, '0');
  const GG = G.toString(16).padStart(2, '0');
  const BB = B.toString(16).padStart(2, '0');

  return `#${RR}${GG}${BB}`;
};

// Helper function to compute a date key for events mapping.
// Returns a string in the format "YYYY-MM-DD"
const computeDateKey = (dayObj: DayObj, currentYear: number): string => {
  let actualYear = currentYear;
  let actualMonth = dayObj.month;
  if (dayObj.month < 0) {
    actualYear = currentYear - 1;
    actualMonth = 11;
  }
  // Note: Extra days (from next month) aren’t adjusted here.
  return `${actualYear}-${(actualMonth + 1).toString().padStart(2, '0')}-${dayObj.day
    .toString()
    .padStart(2, '0')}`;
};

/* =============================
   DAY CELL COMPONENT
============================= */
interface EventIcon {
  icon: string;
  color: string;
}

interface DayCellProps {
  dayObj: DayObj;
  index: number;
  isNewMonth: boolean;
  isToday: boolean;
  onClick: (day: number, month: number, year: number) => void;
  dayRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  year: number;
  events?: EventIcon[];
}

const DayCell: React.FC<DayCellProps> = ({
  dayObj,
  index,
  isNewMonth,
  isToday,
  onClick,
  dayRefs,
  year,
  events,
}) => {
  return (
    <div
      ref={(el) => {
        dayRefs.current[index] = el;
      }}
      data-month={dayObj.month}
      data-day={dayObj.day}
      onClick={() => onClick(dayObj.day, dayObj.month, year)}
      className="relative z-10 m-[-0.5px] group aspect-square w-full grow cursor-pointer rounded-xl border font-medium transition-all hover:z-20 hover:border-cyan-400 sm:-m-px sm:size-20 sm:rounded-2xl sm:border-2 lg:size-36 lg:rounded-3xl 2xl:size-40"
    >
      <span
        className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${
          isToday ? 'bg-blue-500 font-semibold text-white' : ''
        } ${dayObj.month < 0 ? 'text-slate-400' : 'text-slate-800'}`}
      >
        {dayObj.day}
      </span>
      {isNewMonth && (
        <span className="absolute bottom-0.5 left-0 w-full truncate px-1.5 text-sm font-semibold text-slate-300 sm:bottom-0 sm:text-lg lg:bottom-2.5 lg:left-3.5 lg:-mb-1 lg:w-fit lg:px-0 lg:text-xl 2xl:mb-[-4px] 2xl:text-2xl">
          {monthNames[dayObj.month]}
        </span>
      )}
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full opacity-0 transition-all focus:opacity-100 group-hover:opacity-100"
      >
        <svg
          className="size-8 scale-90 text-blue-500 transition-all hover:scale-100 group-focus:scale-100"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {/* Render event icons at bottom right if events exist */}
      {events && events.length > 0 && (
        <div className="absolute bottom-0.5 right-0.5 flex space-x-1">
          {events.map((event, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: event.color,
                border: `1px solid ${shadeColor(event.color, -20)}`,
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full"
            >
              <img src={"https://www.flaticon.com/free-icons/homework"} alt="event icon" className="h-8 w-8" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =============================
   WEEK ROW COMPONENT
============================= */
interface WeekRowProps {
  week: DayObj[];
  weekIndex: number;
  days: DayObj[];
  onDayClick: (day: number, month: number, year: number) => void;
  dayRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  year: number;
  events?: { [key: string]: Array<{ icon: string; color: string }> };
}

const WeekRow: React.FC<WeekRowProps> = ({
  week,
  weekIndex,
  days,
  onDayClick,
  dayRefs,
  year,
  events,
}) => {
  const now = new Date();

  return (
    <div className="flex w-full" key={`week-${weekIndex}`}>
      {week.map((dayObj, dayIndex) => {
        const index = weekIndex * 7 + dayIndex;
        const isNewMonth =
          index === 0 || days[index - 1].month !== dayObj.month;
        const isToday =
          dayObj.month === now.getMonth() &&
          dayObj.day === now.getDate() &&
          now.getFullYear() === year;
        const dateKey = computeDateKey(dayObj, year);
        const dayEvents = events ? events[dateKey] : undefined;
        return (
          <DayCell
            key={`${dayObj.month}-${dayObj.day}-${index}`}
            dayObj={dayObj}
            index={index}
            isNewMonth={isNewMonth}
            isToday={isToday}
            onClick={onDayClick}
            dayRefs={dayRefs}
            year={year}
            events={dayEvents}
          />
        );
      })}
    </div>
  );
};

/* =============================
   CALENDAR GRID COMPONENT
============================= */
interface CalendarGridProps {
  year: number;
  onDayClick: (day: number, month: number, year: number) => void;
  dayRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  events?: { [key: string]: Array<{ icon: string; color: string }> };
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  onDayClick,
  dayRefs,
  events,
}) => {
  const days = useMemo(() => getDaysInYear(year), [year]);
  const weeks = useMemo(() => chunkDaysIntoWeeks(days), [days]);

  return (
    <>
      {weeks.map((week, weekIndex) => (
        <WeekRow
          key={weekIndex}
          week={week}
          weekIndex={weekIndex}
          days={days}
          onDayClick={onDayClick}
          dayRefs={dayRefs}
          year={year}
          events={events}
        />
      ))}
    </>
  );
};

/* =============================
   CALENDAR HEADER COMPONENT
============================= */
interface CalendarHeaderProps {
  selectedMonth: number;
  monthOptions: { name: string; value: string }[];
  onMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onTodayClick: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  year: number;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedMonth,
  monthOptions,
  onMonthChange,
  onTodayClick,
  onPrevYear,
  onNextYear,
  year,
}) => {
  return (
    <div className="sticky -top-px z-40 w-full rounded-t-2xl bg-white px-5 pt-7 sm:px-8 sm:pt-8">
      <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Select
            name="month"
            value={`${selectedMonth}`}
            options={monthOptions}
            onChange={onMonthChange}
          />
          <button
            onClick={onTodayClick}
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 lg:px-5 lg:py-2.5"
          >
            Today
          </button>
          <button
            type="button"
            className="whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 sm:rounded-xl lg:px-5 lg:py-2.5"
          >
            + Add Event
          </button>
        </div>
        <div className="flex w-fit items-center justify-between">
          <button
            onClick={onPrevYear}
            className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
          >
            <svg
              className="size-5 text-slate-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m15 19-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="min-w-16 text-center text-lg font-semibold sm:min-w-20 sm:text-xl">
            {year}
          </h1>
          <button
            onClick={onNextYear}
            className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
          >
            <svg
              className="size-5 text-slate-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m9 5 7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid w-full grid-cols-7 justify-between text-slate-500">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="w-full border-b border-slate-200 py-2 text-center font-semibold"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =============================
   CONTINUOUS CALENDAR COMPONENT
============================= */
export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({
  onClick,
  events,
}) => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: `${index}`,
  }));

  /* -----------------------------
     EVENT HANDLERS & SCROLLING
  ------------------------------ */
  const scrollToDay = (monthIndex: number, dayIndex: number) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) =>
        ref &&
        ref.getAttribute('data-month') === `${monthIndex}` &&
        ref.getAttribute('data-day') === `${dayIndex}`
    );
    const targetElement = dayRefs.current[targetDayIndex];

    if (targetDayIndex !== -1 && targetElement) {
      const container = document.querySelector('.calendar-container');
      const elementRect = targetElement.getBoundingClientRect();
      const is2xl = window.matchMedia('(min-width: 1536px)').matches;
      const offsetFactor = is2xl ? 3 : 2.5;

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset =
          elementRect.top -
          containerRect.top -
          containerRect.height / offsetFactor +
          elementRect.height / 2;
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: 'smooth',
        });
      } else {
        const offset =
          window.scrollY +
          elementRect.top -
          window.innerHeight / offsetFactor +
          elementRect.height / 2;
        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      }
    }
  };

  const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setYear((prevYear) => prevYear + 1);
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
    scrollToDay(monthIndex, 1);
  };
  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };
  const handleDayClick = (day: number, month: number, year: number) => {
    if (!onClick) return;
    if (month < 0) {
      onClick(day, 11, year - 1);
    } else {
      onClick(day, month, year);
    }
  };

  /* -----------------------------
     INTERSECTION OBSERVER
  ------------------------------ */
  useEffect(() => {
    // Scroll to today on initial load
    handleTodayClick();

    const calendarContainer = document.querySelector('.calendar-container');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(
              entry.target.getAttribute('data-month')!,
              10
            );
            setSelectedMonth(month);
          }
        });
      },
      {
        root: calendarContainer,
        rootMargin: '-75% 0px -25% 0px',
        threshold: 0,
      }
    );

    dayRefs.current.forEach((ref) => {
      if (ref && ref.getAttribute('data-day') === '15') {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
      <CalendarHeader
        selectedMonth={selectedMonth}
        monthOptions={monthOptions}
        onMonthChange={handleMonthChange}
        onTodayClick={handleTodayClick}
        onPrevYear={handlePrevYear}
        onNextYear={handleNextYear}
        year={year}
      />
      <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">
        <CalendarGrid
          year={year}
          onDayClick={handleDayClick}
          dayRefs={dayRefs}
          events={events}
        />
      </div>
    </div>
  );
};

/* =============================
   SELECT COMPONENT
============================= */
export interface SelectProps {
  name: string;
  value: string;
  label?: string;
  options: { name: string; value: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const Select = ({
  name,
  value,
  label,
  options = [],
  onChange,
  className,
}: SelectProps) => (
  <div className={`relative ${className}`}>
    {label && (
      <label htmlFor={name} className="mb-2 block font-medium text-slate-800">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="cursor-pointer rounded-lg border border-gray-300 bg-white py-1.5 pl-2 pr-6 text-sm font-medium text-gray-900 hover:bg-gray-100 sm:rounded-xl sm:py-2.5 sm:pl-3 sm:pr-8"
      required
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-1 sm:pr-2">
      <svg
        className="size-5 text-slate-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  </div>
);
