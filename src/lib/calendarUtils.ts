import { TimeSlot } from "@prisma/client";

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

// Helper function to get the first Monday of the year
function getFirstMondayOfYear(year: number): Date {
  const firstDay = new Date(year, 0, 1);
  const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  return new Date(year, 0, firstDay.getDate() - firstDayIndex);
}

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

export function getWeekAndDay(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const firstMonday = getFirstMondayOfYear(year);
  const dateDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

  const pastDays = (date.getTime() - firstMonday.getTime()) / 86400000;
  const week = Math.ceil((pastDays + 1) / 7);

  return { week: week-1, dayWeek: dateDayIndex };
}

// week calendar

export function getWeekStartDate(date: Date): Date {
  const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

export function getWeekStartDateFromYearWeek(year: number, weekIndex: number): Date {
  const firstMonday = getFirstMondayOfYear(year);
  const weekStart = new Date(firstMonday);
  weekStart.setDate(firstMonday.getDate() + weekIndex * 7);
  return weekStart;
}

// conversions
export function convertTimeSlotYearWeekToDate(timeSlot: TimeSlot, year: number, week: number): { startDate: Date, endDate: Date } {
  const firstMonday = getFirstMondayOfYear(year);
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
  const firstMonday = getFirstMondayOfYear(year);
  const pastDays = (date.getTime() - firstMonday.getTime()) / 86400000;
  const week = Math.ceil((pastDays + 1) / 7);

  const timeSlot: Partial<TimeSlot> = {
    dayOfWeek: date.getDay() === 0 ? 7 : date.getDay(),
    startHour: date.getHours(),
    startMinute: date.getMinutes(),
    endHour: date.getHours(), // Assuming endHour is the same as startHour for simplicity
    endMinute: date.getMinutes() // Assuming endMinute is the same as startMinute for simplicity
  };

  return { timeSlot, year, week };
}

// New function to get the number of weeks in a year
export function getWeeksInYear(year: number): number {
  const firstMonday = getFirstMondayOfYear(year);
  const lastDay = new Date(year, 11, 31);
  const pastDays = (lastDay.getTime() - firstMonday.getTime()) / 86400000;
  return Math.ceil((pastDays + 1) / 7);
}