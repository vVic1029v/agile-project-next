import { TimeSlot } from "@prisma/client";

export type DaySchedule = {
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
}[];

export type WeekSchedule = DaySchedule[];

export type WeekScheduleIdentifier = {
  day: number;
  period: number;
};

export const daySchedule: DaySchedule = [
  { start: { hour: 7, minute: 30 }, end: { hour: 8, minute: 15 } }, // 7:30–8:15
  { start: { hour: 8, minute: 20 }, end: { hour: 9, minute: 0o5 } }, // 8:20–9:05 (5 min break, then 10 min)
  { start: { hour: 9, minute: 15 }, end: { hour: 10, minute: 0 } }, // 9:15–10:00
  { start: { hour: 10, minute: 5 }, end: { hour: 10, minute: 50 } }, // 10:05–10:50
  { start: { hour: 11, minute: 0 }, end: { hour: 11, minute: 45 } }, // 11:00–11:45
  { start: { hour: 11, minute: 50 }, end: { hour: 12, minute: 35 } }, // 11:50–12:35
  { start: { hour: 12, minute: 50 }, end: { hour: 13, minute: 35 } }, // 12:50–13:35
  { start: { hour: 13, minute: 40 }, end: { hour: 14, minute: 25 } }, // 13:40–14:25
  { start: { hour: 14, minute: 35 }, end: { hour: 15, minute: 20 } }, // 14:35–15:20
  { start: { hour: 15, minute: 25 }, end: { hour: 16, minute: 10 } }, // 15:25–16:10
  { start: { hour: 16, minute: 20 }, end: { hour: 17, minute: 5 } }, // 16:20–17:05
  { start: { hour: 17, minute: 10 }, end: { hour: 17, minute: 55 } }, // 17:10–17:55 // 5 min break again ->
  { start: { hour: 18, minute: 0 }, end: { hour: 18, minute: 45 } }, // 18:00–18:45
];

const weekSchedule: WeekSchedule = [
  daySchedule, // Monday
  daySchedule, // Tuesday
  daySchedule, // Wednesday
  daySchedule, // Thursday
  daySchedule, // Friday
  daySchedule, // Saturday
  daySchedule, // Sunday
];

export function getTimesOfIndentifier(
  weekScheduleId: WeekScheduleIdentifier
): {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}[] {
  const times: {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }[] = [];

  // Verificăm dacă weekScheduleId este array, altfel îl punem într-un array
  const identifiers = Array.isArray(weekScheduleId)
    ? weekScheduleId
    : [weekScheduleId];

  for (const { day, period } of identifiers) {
    const daySchedule = weekSchedule[day];

    if (!daySchedule || period < 0 || period >= daySchedule.length) {
      throw new Error(
        `Invalid period value (${period}) or day (${day}) in WeekScheduleIdentifier`
      );
    }

    const session = daySchedule[period];

    times.push({
      startHour: session.start.hour,
      startMinute: session.start.minute,
      endHour: session.end.hour,
      endMinute: session.end.minute,
    });
  }

  return times;
}

export function getDateRangeFromTimeSlot(
  timeSlot: TimeSlot,
  year: number,
  weekNumber: number
): { startDate: Date; endDate: Date } {
  // Find the first Thursday of the year (ISO 8601 standard)
  const firstThursday = new Date(Date.UTC(year, 0, 4));

  // Get the Monday of that first week
  const firstMonday = new Date(firstThursday);
  firstMonday.setUTCDate(
    firstThursday.getUTCDate() - ((firstThursday.getUTCDay() + 6) % 7)
  );

  // Get the target date (Monday of the given week) for start and end times
  const startDate = new Date(firstMonday);
  startDate.setUTCDate(
    firstMonday.getUTCDate() + (weekNumber - 1) * 7 + timeSlot.dayOfWeek
  );
  startDate.setUTCHours(timeSlot.startHour, timeSlot.startMinute, 0, 0);

  const endDate = new Date(startDate);
  endDate.setUTCHours(timeSlot.endHour, timeSlot.endMinute, 0, 0);

  return { startDate, endDate };
}

// for new course
export function createScheduleTimeSlots(
  weekScheduleId: WeekScheduleIdentifier,
  courseId: string,
  homeClassId?: string
) {
  const timeSlots = getTimesOfIndentifier(weekScheduleId);
  console.log("ceva", timeSlots);
  return timeSlots.map((timeSlot, index) => {
    console.log(timeSlot, index,weekScheduleId,weekScheduleId);
    return {
      dayOfWeek: weekScheduleId.day, // zero-indexed, no change needed
      periodOfDay: weekScheduleId.period, // zero-indexed, no change needed
      startHour: timeSlot.startHour, // Using relative start time
      startMinute: timeSlot.startMinute, // Using relative start time
      endHour: timeSlot.endHour, // Using relative end time
      endMinute: timeSlot.endMinute, // Using relative end time
      courseId: courseId, // Connect the course to the time slot
      homeClassId: homeClassId,
    };
  });
}

// for event without TimeSlot
export function createTimeSlot(
  courseId: string,
  weekTime: {
    dayOfWeek: number;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }
) {
  return {
    dayOfWeek: weekTime.dayOfWeek, // zero-indexed, no change needed
    startHour: weekTime.startHour, // Using relative start time
    startMinute: weekTime.startMinute, // Using relative start time
    endHour: weekTime.endHour, // Using relative end time
    endMinute: weekTime.endMinute, // Using relative end time
    courseId: courseId, // Connect the course to the time slot
  };
}
