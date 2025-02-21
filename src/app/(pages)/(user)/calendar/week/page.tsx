import { NextResponse } from "next/server";
import React from "react"
import { getServerSession } from "next-auth/next"
import { auth } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";
import UserWeekCalendar from "@/components/calendar/week/UserWeekCalendar";

export default async function CalendarPage(context: any) {
    const sess = await auth()
    if (sess) {
        return (
            <AuthContent>
                <SnackProvider>
                    <UserWeekCalendar />
                </SnackProvider>
            </AuthContent>
        )
    } else {
        return (
            <AuthContent tryingToAccess={"the calendar"} />
        )
    }
}
