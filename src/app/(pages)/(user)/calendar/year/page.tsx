import { NextResponse } from "next/server";
import React from "react"
import UserCalendar from "@/components/calendar/annual-calendar/UserCalendar"
import { getServerSession } from "next-auth/next"
import {auth, authOptions} from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";
import { SessionProvider } from "next-auth/react";
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";

export default async function CalendarPage(context: any) {
    const sess = await getServerSession(authOptions)

    if (sess)
    {
        return(
            <SessionProviderWrapper>
                <SnackProvider>
                        <UserCalendar/>
                </SnackProvider>
            </SessionProviderWrapper>
        )
    } else {
        return(
            <AuthContent tryingToAccess={"the calendar"}/>
        )
    }
}
  