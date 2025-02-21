// app/calendar/page.tsx (server component)
import { redirect } from "next/navigation";
import { getCalendarData } from "@/lib/getCalendarData";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import UserYearCalendar from "@/components/calendar/year/UserYearCalendar";

export default async function CalendarPage() {
  const session = await auth();
  if (!session || !session.user?.id) {
    // Redirect to login if no session is found
    redirect("/login");
  }
  const userId = session.user.id;

  // Fetch calendar data on the server
  const { timeCells, courses } = await getCalendarData(userId);

  return (
      <CalendarProvider timeCells={timeCells} courses={courses}>
        <UserYearCalendar/>
      </CalendarProvider>
  
);
}
