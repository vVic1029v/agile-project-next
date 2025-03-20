import { getCalendarData } from "@/lib/database/getCalendarData";
import { authMiddleware } from "@/lib/auth";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import UserYearCalendar from "@/components/calendar/year/UserYearCalendar";
import ScrollPanels from "@/components/calendar/calendar-page/ScrollPanels";
import { useCalendarState } from "../useCalendarState";
import CalendarStateProvider from "../CalendarStateProvider";
import UserWeekCalendar from "../week/UserWeekCalendar";
import Panel from "./Panel";

export default async function CalendarPageSelector() {
    const session = await authMiddleware();

    return (
        <CalendarStateProvider isWeekView={true}>
            <ScrollPanels>
                <Panel width="w-[80%]">
                    <UserYearCalendar />
                </Panel>
                <Panel width="w-[110%]">
                    <UserWeekCalendar />
                </Panel>
            </ScrollPanels>
        </CalendarStateProvider>
    );
}