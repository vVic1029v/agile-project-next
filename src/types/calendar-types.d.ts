import { TimeSlot, Event, Prisma } from "@prisma/client";

declare module "calendar-types" {
    export type EventTimeSlot = Prisma.EventGetPayload<{ include: { timeSlot: true } }>
    export interface TimeCell {
        timeSlot: TimeSlot,
        yearNumber: number,
        weekNumber: number,
        events: Event[],
    }
}