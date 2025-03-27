"use client"

import { getCalendarData } from "@/lib/database/getCalendarData";
import { authMiddleware } from "@/lib/auth";
import CalendarProvider from "@/components/calendar/CalendarProvider";
import UserYearCalendar from "@/components/calendar/year/UserYearCalendar";
import ScrollPanels from "@/components/calendar/calendar-page/ScrollPanels";
import { useCalendarState } from "../useCalendarState";
import CalendarStateProvider from "../CalendarStateProvider";
import UserWeekCalendar from "../week/UserWeekCalendar";
import Panel from "./Panel";
import { useRef, useState } from "react";

export default function CalendarPageSelector() {
    // const session = await authMiddleware();

    const onActiveIndexChange = (index: number) => {
        console.log("Active index changed to:", index);
    };

    return (
        
        <ScrollPanels onActiveIndexChange={onActiveIndexChange} >
            <Panel width="w-[80%]">
                <UserYearCalendar />
            </Panel>
            
            <Panel width="w-[80%]">
                <UserWeekCalendar />
            </Panel>
        </ScrollPanels>
    );
}