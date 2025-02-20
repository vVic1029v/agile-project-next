import React from "react"
import UserYearCalendar from "@/components/calendar/annual-calendar/UserYearCalendar"
import { auth } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";

export default async function CalendarPage(context: any) {
    const sess = await auth()
    if (sess) {
        return (
            <AuthContent>
                <SnackProvider>
                    <UserYearCalendar />
                </SnackProvider>
            </AuthContent>
        )
    } else {
        return (
            <AuthContent tryingToAccess={"the calendar"} />
        )
    }
}
