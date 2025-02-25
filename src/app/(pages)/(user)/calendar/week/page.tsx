// app/calendar/page.tsx (server component)
import { redirect } from "next/navigation";
import { getCalendarData } from "@/lib/database/getCalendarData";
import UserWeekCalendar from "@/components/calendar/week/UserWeekCalendar";
import { authMiddleware } from "@/lib/auth";
import CalendarProvider from "@/components/calendar/CalendarProvider";

export default async function CalendarPage() {
  const session = await authMiddleware();
  const userId = session.user.id;

  // Fetch calendar data on the server
  const { events, courses } = await getCalendarData("64c4013d-37f8-4e04-aae0-fcfdee4b8c78");

  return (
      <CalendarProvider events={events} courses={courses}>
        <UserWeekCalendar/>
      </CalendarProvider>
  
);
}
