import React from "react"
import { auth } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

import AuthContent from "@/components/auth/AuthContent";
import NewHomeClass from "@/components/new/home-class/NewHomeClass";

export default async function NewHomeClassPage(context: any) {
    const sess = await auth()
    if (sess) {
        return (
            <AuthContent>
                <SnackProvider>
                    <NewHomeClass />
                </SnackProvider>
            </AuthContent>
        )
    } else {
        return (
            <AuthContent tryingToAccess={"the calendar"} />
        )
    }
}
