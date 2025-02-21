import { TimeSlot } from "@prisma/client";

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

  let week = 0;

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


export function getWeekAndDay(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const firstDay = new Date(year, 0, 1);

  // Adjust firstDay to make Monday the first day of the week
  const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const dateDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

  // Calculate how many days have passed since the first Monday of the year
  const pastDays = (date.getTime() - firstDay.getTime()) / 86400000;
  const week = Math.ceil((pastDays + firstDayIndex + 1) / 7);

  return { week, dayWeek: dateDayIndex };
}

// week calendar

export function getWeekStartDate(date: Date): Date {
  // Adjust so that Monday is day 0. If date.getDay() returns 0 (Sunday), use 6.
  const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

export function getWeekStartDateFromYearWeek(year: number, weekIndex: number): Date {
  // Get the first Monday of the year.
  const firstDay = new Date(year, 0, 1);
  // Adjust firstDay to Monday: if firstDay is not Monday, compute the difference.
  const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const diff = firstDayIndex; // days to subtract to reach Monday (could be 0 if already Monday)
  const firstMonday = new Date(year, 0, firstDay.getDate() - diff);
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + weekIndex * 7);
  return weekStart;
}

export function getWeeksInYear(year: number): number {
  // This function depends on getWeekAndDay. Ensure getWeekAndDay is updated as well.
  return getWeekAndDay(year, 12, 31).week;
}




// conversions
export function convertTimeSlotYearWeekToDate(timeSlot: TimeSlot, year: number, week: number): { startDate: Date, endDate: Date } {
  const firstDay = new Date(year, 0, 1);
  const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const firstMonday = new Date(year, 0, firstDay.getDate() - firstDayIndex);
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + (week - 1) * 7 + (timeSlot.dayOfWeek - 1));

  const startDate = new Date(weekStart);
  startDate.setHours(timeSlot.startHour, timeSlot.startMinute, 0, 0);

  const endDate = new Date(weekStart);
  endDate.setHours(timeSlot.endHour, timeSlot.endMinute, 0, 0);

  return { startDate, endDate };
}

export function convertDateToTimeSlotYearWeek(date: Date): { timeSlot: Partial<TimeSlot>, year: number, week: number } {
  const year = date.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const pastDays = (date.getTime() - firstDay.getTime()) / 86400000;
  const week = Math.ceil((pastDays + firstDayIndex + 1) / 7);

  const timeSlot: Partial<TimeSlot> = {
    dayOfWeek: date.getDay() === 0 ? 7 : date.getDay(),
    startHour: date.getHours(),
    startMinute: date.getMinutes(),
    endHour: date.getHours(), // Assuming endHour is the same as startHour for simplicity
    endMinute: date.getMinutes() // Assuming endMinute is the same as startMinute for simplicity
  };

  return { timeSlot, year, week };
}