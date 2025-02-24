import React from "react"
import { authMiddleware } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";
import NewHomeClass from "@/components/new/home-class/NewHomeClass";

export default async function NewHomeClassPage(context: any) {
    const session = await authMiddleware();
    return (
        <SnackProvider>
            <NewHomeClass />
        </SnackProvider>
    )
}
