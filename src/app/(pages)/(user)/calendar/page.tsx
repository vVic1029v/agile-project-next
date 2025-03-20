import { getCalendarData } from "@/lib/database/getCalendarData";
import { authMiddleware } from "@/lib/auth";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import UserYearCalendar from "@/components/calendar/year/UserYearCalendar";
import ScrollPanels from "@/components/calendar/calendar-page/ScrollPanels";
import CalendarPageSelector from "@/components/calendar/calendar-page/CalendarPageSelector";
import CalendarStateProvider from "@/components/calendar/CalendarStateProvider";

export default async function CalendarPage() {
  const session = await authMiddleware();
  const { events, courses } = await getCalendarData(session.user.id);

  return (
    <CalendarStateProvider>
      <CalendarProvider events={events} courses={courses}>
        <CalendarPageSelector />
      </CalendarProvider>
    </CalendarStateProvider>
  );
}