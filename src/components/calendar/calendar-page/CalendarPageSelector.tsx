import { getCalendarData } from "@/lib/database/getCalendarData";
import { authMiddleware } from "@/lib/auth";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import UserYearCalendar from "@/components/calendar/year/UserYearCalendar";
import ScrollPanels from "@/components/calendar/calendar-page/ScrollPanels";
import { useCalendarState } from "../useCalendarState";
import CalendarStateProvider from "../CalendarStateProvider";
import UserWeekCalendar from "../week/UserWeekCalendar";

export default async function CalendarPageSelector() {
    const session = await authMiddleware();

    return (
        <CalendarStateProvider isWeekView={true}>
            <ScrollPanels>
                <UserYearCalendar />
                <UserWeekCalendar />
            </ScrollPanels>
        </CalendarStateProvider>
    );
}