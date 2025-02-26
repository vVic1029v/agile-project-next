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
}

interface PeriodSelectWeekCalendarProps {
    selectedTimeSlots: SelectedDate[];
    handleSelectTimeSlot: (slots: SelectedDate) => void;
}

export default function PeriodSelectWeekCalendar({ selectedTimeSlots, handleSelectTimeSlot }: PeriodSelectWeekCalendarProps) {
    const { events, courses } = useCalendarContext();
    return (
        <div className="grid grid-cols-7 gap-2 p-2 w-[410px] h-[400px] overflow-auto">
            <WeekCalendarContainer>
                <WeekCalendar onClick={handleSelectTimeSlot} courses={courses} showAllPeriods={true} highlightedPeriods={selectedTimeSlots}/>
            </WeekCalendarContainer>
        </div>

        );
}

const WeekCalendarContainer = ({ children }: CalendarContainerProps) => (
    <div className="h-[200px]">{children}</div>
);