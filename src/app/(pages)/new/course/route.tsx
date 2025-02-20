import React from "react"
import { auth } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";
import NewCourse from "@/components/new/course/NewCourse";

export default async function NewCoursePage(context: any) {
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
