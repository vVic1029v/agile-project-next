import { NextResponse } from "next/server";
import { postEventTimeSlot, postEventFloating } from "@/lib/database/database";
import {Event} from "@prisma/client";

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

    const { title, type, courseId, timeSlotId, yearNumber, weekNumber, dayOfWeek, startHour, startMinute, endHour, endMinute, description } = eventData;

    if (!title || !type || !courseId || (timeSlotId === undefined && (!dayOfWeek || !startHour || !startMinute || !endHour || !endMinute))) {
        return NextResponse.json({ error: "Missing event data fields" }, { status: 400 });
    }
    
    try {
        let newEvent: Event | null = null;
        if (timeSlotId === undefined) {
            newEvent = await postEventFloating(dayOfWeek, startHour, startMinute, endHour, endMinute, {
                ...eventData,
                description, // Asigură-te că `description` este inclus
            });
        } else {
            newEvent = await postEventTimeSlot({
                ...eventData,
                description, // Adaugă `description` și aici
            });
        }
    
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
