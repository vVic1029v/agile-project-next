"use server";

import { getHomeClassesByName, HomeClassSearchResult,getUserCourses, postNewCourse, getCheapUserByEmail, postNewHomeClass, postNewAnnouncement, getAllAnnouncements, getExpensiveUserByEmail, getHomeClassDetails } from "@/lib/database/database";
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


  const homeClassId = formData.get("homeClassId") as string;
  const teacherEmail = formData.get("teacherEmail") as string;
  const subject = formData.get("subject") as string;
  const weekScheduleIdentifierRaw = formData.get("weekScheduleIdentifier") as string; 
  const color = formData.get("color") as string;
  const weekScheduleIdentifierStr = formData.get("weekScheduleIdentifier") as string;
const weekScheduleIdentifierss = JSON.parse( weekScheduleIdentifierStr) as SelectedDate[];
console.log(weekScheduleIdentifierss);
  if (!homeClassId || !teacherEmail || !subject || !weekScheduleIdentifierRaw || !color) {
    throw new Error("Missing required fields in formData");
  }

  const weekScheduleIdentifiers: WeekScheduleIdentifier[] = weekScheduleIdentifierss.map((date: SelectedDate) => {
    if (date.dayWeek === undefined || date.period === undefined) {
      throw new Error("Invalid weekScheduleIdentifier format");
    }
    return { day: date.dayWeek, period: date.period }; // Folosim dayWeek în loc de day
  });
  

  console.log("weekScheduleIdentifierRaw:", weekScheduleIdentifierRaw);
  console.log("weekScheduleIdentifiers:", weekScheduleIdentifiers);

  const weekScheduleIdentifier = weekScheduleIdentifiers; 
  if (!weekScheduleIdentifier) {
    throw new Error("No valid weekScheduleIdentifier found");
  }

  const results = await postNewCourse(homeClassId, teacherEmail, subject, weekScheduleIdentifier, color);
  return { results };
}

export async function NewHomeClass(formData: FormData){
  const teacherEmail = formData.get("teacherEmail") as string;
  const startYear = formData.get("startYear") as string;
  const nameLetter = formData.get("nameLetter") as string;
  if (!teacherEmail || !startYear || !nameLetter) {
    throw new Error("Missing required fields in formData");
  }
  const assignedTeacher = await getCheapUserByEmail(teacherEmail);
  if (!assignedTeacher) {
    throw new Error("User does not exist");
  }
  if (assignedTeacher.userType !== UserType.FACULTYMEMBER) {
    throw new Error("User is not a faculty member");
  }
  const newClass = await postNewHomeClass(assignedTeacher.id, Number(startYear), nameLetter);
   if (!newClass) {
     throw new Error("Failed to create new HomeClass");
   }
   return { newClass };
}
export async function newAnnouncement(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const date = formData.get("date") as string;
  const allUsers = formData.get("allUsers") === "true";
  const homeClassIds = formData.get("homeClassIds") ? JSON.parse(formData.get("homeClassIds") as string) : undefined;
  console.log(homeClassIds);
  if (!title || !content || !date) {
    throw new Error("Missing required fields in formData");
  }

  const newAnnouncement = await postNewAnnouncement(title, content, date, allUsers, homeClassIds);
  return { newAnnouncement };
}
export async function getAnnouncements(userId: string) {
  const session = await auth();
  if (!userId) return null;
  if (!isAuthorized(session, userId)) return null;

  const announcements = await getAllAnnouncements(userId);

  return { announcements };
}
export async function getClassProfile(userId: string) {
  try {
    const { homeClass } = await getHomeClassDetails(userId);

    if (!homeClass) {
      throw new Error("Home class not found");
    }

    const homeClassProfile = {
      className: homeClass.name || "Unknown Class",

      homeroomTeacher: homeClass.homeroomFacultyMember?.user
        ? {
            name: `${homeClass.homeroomFacultyMember.user.firstName || "Unknown"} ${homeClass.homeroomFacultyMember.user.lastName || "Name"}`,
            email: homeClass.homeroomFacultyMember.user.email || "N/A",
          }
        : { name: "No homeroom teacher", email: "N/A" },

      students: (homeClass.students || []).map((student) => ({
        name: `${student.user?.firstName || "Unknown"} ${student.user?.lastName || "Student"}`,
        email: student.user?.email || "N/A",
      })),

      facultyMembers: Array.from(
        new Map(
          (homeClass.courses || [])
            .filter((course) => course.facultyMember?.user) // Asigură-te că există user
            .map((course) => [
              course.facultyMember.user.email, // Cheia unică
              {
                name: `${course.facultyMember.user.firstName || "Unknown"} ${course.facultyMember.user.lastName || "Faculty"}`,
                email: course.facultyMember.user.email,
                subject: course.subject || "Unknown Subject",
              },
            ])
        ).values()
      ),
    };

    return homeClassProfile;
  } catch (error) {
    console.error("Error fetching home class profile:", error);
    throw new Error("Error fetching home class profile");
  }
}
