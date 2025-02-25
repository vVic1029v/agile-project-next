'use client';

import React, { useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useCalendarContext } from "../CalendarProvider";
import { ModalOverlay } from "@/components/ModalOverlay";
import WeekCalendarHeader from "@/components/calendar/week/WeekCalendarHeader";
import WeekCalendar from "@/components/calendar/week/WeekCalendar";
import CalendarDayModal from "../event-modal/CalendarDayModal";
import CalendarContainter from "../CalendarContainer";
import { getWeekAndDay, getWeeksInYear } from "@/lib/calendarUtils";
import { getToday, SelectedDate, useCalendarState } from "../useCalendarState";

interface CalendarContainerProps {
    children: ReactNode;
    isModalOpen: boolean;
}

export default function PeriodSelectWeekCalendar() {
    const { events, courses } = useCalendarContext();

    const [selectedTimeSlots, setSelectedTimeSlots] = useState<SelectedDate[]>([]);

    function handleCellClick(date: SelectedDate): void {
        // add date to selectedTimeSlots or remove if already selected
        setSelectedTimeSlots(prevSlots => {
            const index = prevSlots.indexOf(date);
            if (index === -1) {
                return [...prevSlots, date];
            } else {
                return prevSlots.filter(slot => slot !== date);
            }
        });
    }

    return (
        <WeekCalendar onClick={handleCellClick} courses={courses} showAllPeriods={true} highlightedPeriods={selectedTimeSlots}/>
    );
}

const WeekCalendarContainer = ({ children, isModalOpen }: CalendarContainerProps) => (
    <CalendarContainter isModalOpen={isModalOpen}>
        <div className="w-full px-[5vw] pt-4">{children}</div>
    </CalendarContainter>
);