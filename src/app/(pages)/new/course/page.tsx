import React from "react"
import NewCourse from "@/components/new/course/NewCourse";
import { authMiddleware } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import { getCalendarData } from "@/lib/database/getCalendarData";

export default async function NewCoursePage(context: any) {
    const session = await authMiddleware();
    const userId = session.user.id;

    // Fetch calendar data on the server
    const { events, courses } = await getCalendarData(userId);
    return (
        <CalendarProvider events={events} courses={courses}>
            <NewCourse />
        </CalendarProvider>
    )
}
