import { NextResponse } from "next/server";
import { getTimeSlot, postEvent } from "@/lib/database";
import { auth, isAuthorized } from "@/lib/auth";
import { getDateRangeFromTimeSlot } from "@/lib/timeSlots";

export async function POST(request: Request) {
    const { userId, eventData } = await request.json();

    // Authorize the user
    // const session = await auth();
    // if (!isAuthorized(session, userId)) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    if (!userId || !eventData) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const { title, type, courseId, timeSlotId, yearNumber, weekNumber, startTime, endTime } = eventData;
    // Validate required fields
    if (!title || !type || !courseId || (timeSlotId === undefined && (!startTime || !endTime))) {
        return NextResponse.json({ error: "Missing event data fields" }, { status: 400 });
    }

    let finalStartTime: Date | undefined;
    let finalEndTime: Date | undefined;

    if (timeSlotId) {
        const timeSlot = await getTimeSlot(timeSlotId);
        if (!timeSlot) {
            return NextResponse.json({ error: "Invalid TimeSlot ID" }, { status: 400 });
        }
        const { startDate, endDate } = getDateRangeFromTimeSlot(timeSlot, yearNumber, weekNumber);
        finalStartTime = startDate
        finalEndTime = endDate
    } else {
        finalStartTime = startTime
        finalEndTime = endTime
    }

    // Proceed to create event with the calculated week number
    try {
        const newEvent = await postEvent({
            ...eventData,
            startTime: finalStartTime,
            endTime: finalEndTime
        });
        
        if (newEvent) {
            return NextResponse.json({ message: "Event created successfully", event: newEvent }, { status: 201 });
        } else {
            return NextResponse.json({ message: "Failed to create event" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error during event creation:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
