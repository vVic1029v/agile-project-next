import { TimeCell } from "calendar-types";

// /utils/calendarUtils.ts
export interface DayObj {
  month: number;
  week: number;
  day: number;
}

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

export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


// CALENDAR GRID 

export const getDaysInYear = (year: number): DayObj[] => {
  const days: DayObj[] = [];
  let startDayOfWeek = new Date(year, 0, 1).getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek; // Convert Sunday (0) to 7

  let week = 1;

  // Fill in days from the previous year if needed
  if (startDayOfWeek > 1) {
    for (let i = startDayOfWeek - 2; i >= 0; i--) {
      days.push({ month: -1, week: 0, day: 31 - i });
    }
  }

  // Add all days for the year
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ month, week, day });
      if (days.length % 7 === 0) week++;
    }
  }

  // Fill last week with extra days from the next year if needed
  const lastWeekDayCount = days.length % 7;
  if (lastWeekDayCount > 0) {
    const extraDaysNeeded = 7 - lastWeekDayCount;
    for (let day = 1; day <= extraDaysNeeded; day++) {
      days.push({ month: 0, week, day });
    }
  }

  return days;
};

export const chunkDaysIntoWeeks = (days: DayObj[]): DayObj[][] => {
  const weeks: DayObj[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};

/* STARTING WITH SUNDAY
  export const getDaysInYear = (year: number): DayObj[] => {
    const days: DayObj[] = [];
    const startDayOfWeek = new Date(year, 0, 1).getDay();
    let week = 1;
  
    // Fill in days from previous year if needed
    if (startDayOfWeek < 6) {
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ month: -1, week: 0, day: 32 - startDayOfWeek + i });
      }
    }
  
    // Add all days for each month of the year
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({ month, week, day });
        if (days.length % 7 === 0) week++;
      }
    }
  
    // Fill the last week with extra days (from next month)
    const lastWeekDayCount = days.length % 7;
    if (lastWeekDayCount > 0) {
      const extraDaysNeeded = 7 - lastWeekDayCount;
      for (let day = 1; day <= extraDaysNeeded; day++) {
        days.push({ month: 0, week, day });
      }
    }
  
    return days;
};
  
  export const chunkDaysIntoWeeks = (days: DayObj[]): DayObj[][] => {
    const weeks: DayObj[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };
*/



export function getTimeCellDates(timeCell: TimeCell) {
  const { timeSlot, yearNumber, weekNumber } = timeCell;
  const firstDayOfYear = new Date(yearNumber, 0, 1);
  const dayOffset = (weekNumber - 1) * 7 + timeSlot.dayOfWeek;
  const startDate = new Date(firstDayOfYear);
  startDate.setDate(firstDayOfYear.getDate() + dayOffset);
  startDate.setHours(timeSlot.startHour, timeSlot.startMinute, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(timeSlot.endHour, timeSlot.endMinute, 0, 0);

  return { startDate, endDate };
}


export function getWeekAndDay(year: number, month: number, day: number): { week: number, dayWeek: number } {
  // Create a Date object from the input
  const date = new Date(year, month - 1, day);

  // Calculate the day of the week, making Monday 0 and Sunday 6
  const dayWeek = (date.getDay() + 6) % 7;

  // Calculate week number based on ISO week date system
  const jan4 = new Date(date.getFullYear(), 0, 4);
  const startOfYear = new Date(jan4.getFullYear(), 0, 1);
  const daysSinceStartOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const firstWeekDay = (jan4.getDay() + 6) % 7;
  const week = Math.floor((daysSinceStartOfYear + firstWeekDay) / 7) + 1;

  return { week, dayWeek };
}