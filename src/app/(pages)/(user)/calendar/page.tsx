import { NextResponse } from "next/server";
import React from "react"
import CalendarComp from "@/components/calendar/Calendar"
import { getSession } from 'next-auth/react';
import { getServerSession } from "next-auth/next"
import {auth, authOptions} from "@/lib/auth"

export default async function CalendarPage(context: any) {
    const sess = await getServerSession(authOptions)
    sess?.user?.email

    if (sess)
    {
        return(
            <div className="">
                <CalendarComp/>
            </div>
        )
    } else {
        return(
            <>
                <div className="">


                </div>
            </>
        )
    }
    
    
}
  