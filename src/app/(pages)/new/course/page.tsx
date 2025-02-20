import React from "react"
import NewCourse from "@/components/new/course/NewCourse";
import { auth } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";

export default async function CalendarPage(context: any) {
    const sess = await auth()
    if (sess) {
        return (
            <AuthContent>
                <SnackProvider>
                    <NewCourse />
                </SnackProvider>
            </AuthContent>
        )
    } else {
        return (
            <AuthContent tryingToAccess={"the calendar"} />
        )
    }
}
