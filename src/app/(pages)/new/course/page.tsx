import React from "react"
import NewCourse from "@/components/new/course/NewCourse";
import { authMiddleware } from "@/lib/auth"
import { SnackProvider } from "@/app/SnackProvider";

export default async function NewCoursePage(context: any) {
    const session = await authMiddleware();
    return (
        <SnackProvider>
            <NewCourse />
        </SnackProvider>
    )
}
