// /utils/calendarUtils.ts
export interface DayObj {
    month: number;
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
  
  export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  export const getDaysInYear = (year: number): DayObj[] => {
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
  
  export const chunkDaysIntoWeeks = (days: DayObj[]): DayObj[][] => {
    const weeks: DayObj[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };
  
  // Darken/lighten a hex color by a percent (negative percent darkens)
  export const shadeColor = (color: string, percent: number): string => {
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
  
  // Compute a date key for events mapping in the format "YYYY-MM-DD"
  export const computeDateKey = (dayObj: DayObj, currentYear: number): string => {
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
  