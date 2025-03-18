import { getCalendarData } from "@/lib/database/getCalendarData";
import { authMiddleware } from "@/lib/auth";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import UserYearCalendar from "@/components/calendar/year/UserYearCalendar";

export default async function YearCalendarPage() {
  const session = await authMiddleware();
  const { events, courses } = await getCalendarData(session.user.id);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <CalendarProvider events={events} courses={courses}>
        <UserYearCalendar />
      </CalendarProvider>
    </div>
  );
}