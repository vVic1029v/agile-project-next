"use server";


import { getHomeClassesByName, HomeClassSearchResult,getUserCourses, postNewCourse } from "@/lib/database/database";
import { UserType,Course } from "@prisma/client";
import { get } from "http";
import { auth, isAuthorized } from "@/lib/auth";
import { SelectedDate } from "@/components/calendar/useCalendarState";
import { WeekScheduleIdentifier } from "./database/timeSlots";

export async function SearchHomeClasses(formData: FormData): Promise<{ results: HomeClassSearchResult[] }> {
  const query = formData.get("query") as string;

  if (!query) return { results: [] };

  const results = await getHomeClassesByName(query);

  return { results };
}

export async function getCourses(userId: string,usertype:UserType): Promise<Course[] | null>
{
  const session = await auth();
  if(!userId) return null;
  if(!isAuthorized(session, userId)) return null;
   let courses: Course[] | null = null
  if (session?.user.userType === "FACULTYMEMBER")
     {
         courses = await getUserCourses(userId, "FACULTYMEMBER");
     }
     else if (session?.user.userType === "STUDENT")
     {
         courses = await getUserCourses(userId, "STUDENT");
     }
     if (courses && courses.length > 0) {
          return courses;
        } else {
          return null;
        }
}
export async function NewCourse(formData: FormData) {
  const query = formData.get("query") as string;
  if (!query) return { results: [] };

  const homeClassId = formData.get("homeClassId") as string;
  const teacherEmail = formData.get("teacherEmail") as string;
  const subject = formData.get("subject") as string;
  const weekScheduleIdentifierRaw = formData.get("weekScheduleIdentifier") as string; // Assuming it's serialized
  const color = formData.get("color") as string;

  if (!homeClassId || !teacherEmail || !subject || !weekScheduleIdentifierRaw || !color) {
    throw new Error("Missing required fields in formData");
  }

  const weekScheduleIdentifiers: WeekScheduleIdentifier[] = JSON.parse(weekScheduleIdentifierRaw).map((date: SelectedDate) => {
    if (date.day === undefined || date.period === undefined) {
      throw new Error("Invalid weekScheduleIdentifier format");
    }
    return { day: date.day, period: date.period };
  });

  const weekScheduleIdentifier = weekScheduleIdentifiers[0];
  if (!weekScheduleIdentifier) {
    throw new Error("No valid weekScheduleIdentifier found");
  }

  const results = await postNewCourse(homeClassId, teacherEmail, subject, weekScheduleIdentifier, color);
  return { results };
}
