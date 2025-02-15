import { NextResponse } from "next/server";
import React from "react"
import DemoWrapper from "@/components/calendar/DemoWrapper"
import { getServerSession } from "next-auth/next"
import {auth, authOptions} from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";

export default async function CalendarPage(context: any) {
    const sess = await getServerSession(authOptions)

    if (sess)
    {
        return(
            <SnackProvider>
                <DemoWrapper/>
            </SnackProvider>
        )
    } else {
        return(
            <AuthContent tryingToAccess={"the calendar"}/>
        )
    }
}
  