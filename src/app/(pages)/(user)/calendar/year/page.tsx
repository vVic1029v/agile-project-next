// app/calendar/page.tsx (server component)
import { redirect } from "next/navigation";
import { getCalendarData } from "@/lib/getCalendarData";
import { authMiddleware } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import UserYearCalendar from "@/components/calendar/year/UserYearCalendar";

export default async function CalendarPage() {
  const session = await authMiddleware();

  // Fetch calendar data on the server
  const { timeCells, courses } = await getCalendarData(session.user.id);

  return (
    <CalendarProvider timeCells={timeCells} courses={courses}>
      <UserYearCalendar/>
    </CalendarProvider>
);
}
