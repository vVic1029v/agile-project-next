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

export default function PeriodSelectWeekCalendar() {
    const { events, courses } = useCalendarContext();

    const [selectedTimeSlots, setSelectedTimeSlots] = useState<SelectedDate[]>([]);

    function handleCellClick(date: SelectedDate): void {
        setSelectedTimeSlots(prevSlots => {
            const isSelected = prevSlots.some(slot => slot.dayWeek === date.dayWeek && slot.period === date.period);
            if (isSelected) {
                return prevSlots.filter(slot => !(slot.dayWeek === date.dayWeek && slot.period === date.period));
            } else {
                return [...prevSlots, date];
            }
        });
    }

    return (
        <WeekCalendarContainer>
            <WeekCalendar onClick={handleCellClick} courses={courses} showAllPeriods={true} highlightedPeriods={selectedTimeSlots}/>
        </WeekCalendarContainer>
    );
}

const WeekCalendarContainer = ({ children }: CalendarContainerProps) => (
    <div className="">{children}</div>
);