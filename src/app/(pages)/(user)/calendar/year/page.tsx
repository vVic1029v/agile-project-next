import { NextResponse } from "next/server";
import React from "react"
import UserYearCalendar from "@/components/calendar/annual-calendar/UserYearCalendar"
import { getServerSession } from "next-auth/next"
import { auth, authOptions } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";

export default async function CalendarPage(context: any) {
    const sess = await getServerSession(authOptions)
    if (sess) {
        return (
            <SessionProviderWrapper>
                <SnackProvider>
                    <UserYearCalendar />
                </SnackProvider>
            </SessionProviderWrapper>
        )
    } else {
        return (
            <AuthContent tryingToAccess={"the calendar"} />
        )
    }
}
