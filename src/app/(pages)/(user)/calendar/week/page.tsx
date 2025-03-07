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
  const { events, courses } = await getCalendarData(userId);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <CalendarProvider events={events} courses={courses}>
        <UserWeekCalendar />
      </CalendarProvider>
    </div>
  );
}