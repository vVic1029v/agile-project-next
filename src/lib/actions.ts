"use server";

import { getHomeClassesByName, HomeClassSearchResult,getUserCourses, postNewCourse, getCheapUserByEmail, postNewHomeClass, postNewAnnouncement, getAllAnnouncements, getExpensiveUserByEmail, getHomeClassDetails, ChangeProfilePicture, DeleteProfilePicture, prisma } from "@/lib/database/database";
import { UserType,Course, User } from "@prisma/client";
import { get } from "http";
import { auth, isAuthorized } from "@/lib/auth";
import { SelectedDate } from "@/components/calendar/useCalendarState";
import { WeekScheduleIdentifier } from "./database/timeSlots";
import { sendEmail } from "./email";


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
      homeclassId: homeClass.id,
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

export async function ChangePicture(userId:string,profileImage:string){
  const session = await auth();
  if (!userId) return null;
  if (!isAuthorized(session, userId)) return null;
  ChangeProfilePicture(userId,profileImage);

}
export async function RemovePicture(userId:string){
  const session = await auth();
  if (!userId) return null;
  if (!isAuthorized(session, userId)) return null;
DeleteProfilePicture(userId );
}

export async function AllUsersEmails(): Promise<string[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true, // Selectăm doar câmpul email
      },
    });
    
    // Extragem email-urile din obiectele de tip User
    return users.map((user: { email: string }) => user.email); // Aici extragem doar email-ul
  } catch (error) {
    console.error("Eroare la obținerea email-urilor tuturor utilizatorilor:", error);
    throw new Error("Nu s-au putut obține email-urile.");
  }
}
export async function HomeClassEmails(allUsers: boolean, homeClassIds: string[]): Promise<string[]> {
  try {
    if (allUsers) {
      return await AllUsersEmails(); // Dacă se dorește pentru toți utilizatorii
    }

    // Filtrăm utilizatorii care sunt în clasele selectate
    const users = await prisma.student.findMany({
      where: {
        homeClassId: {
          in: homeClassIds, // Filtrăm pe baza homeClassId
        },
      },
      select: {
        user: {
          select: {
            email: true, // Obținem email-ul utilizatorului
          },
        },
      },
    });

    // Extragem email-urile din rezultatele obținute
    return users.map(student => student.user.email);
  } catch (error) {
    console.error("Eroare la obținerea email-urilor pentru clasele selectate:", error);
    throw new Error("Nu s-au putut obține email-urile pentru clasele selectate.");
  }
}
export async function searchStudentsByEmail(email: string, classId: string) {
  try {
    const students = await prisma.student.findMany({
      where: {
        user: {
          email: {
            contains: email, // Căutare în timp real
            mode: "insensitive", // Ignoră litere mari/mici
          },
        },
      },
      include: {
        user: true,
      },
      take: 5, // Limităm la 5 rezultate pentru performanță
    });

    return students.map((student) => ({
      id: student.id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
    }));
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    return [];
  }
}

// Funcția de adăugare a studentului într-o clasă
export async function addStudentToClass(email: string, classId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true },
    });

    if (!user || !user.student) {
      throw new Error("Student not found");
    }

    await prisma.student.update({
      where: { id: user.student.id },
      data: { homeClassId: classId },
    });

    return { success: true, message: "Student added successfully" };
  } catch (error) {
    console.error("❌ Error adding student:", error);
    return { success: false, message: error };
  }
}

export const createNews = async (data: {
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  date: string;
}) => {
  try {
    // Crearea unui news în baza de date
    const news = await prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        date:new Date(),
      },
    });
    return news;
  } catch (error) {
    throw new Error("Failed to create news: " + error);
  }
};

export const getAllNews = async () => {
  try {
    // Preluarea tuturor noutăților
    const news = await prisma.news.findMany({
      include: {
        author: true, // Include autorul în rezultat pentru a-l folosi pe frontend
      },
      orderBy: {
        date: "desc", // Sortare după data noutății
      },
    });
    return news;
  } catch (error) {
    throw new Error("Failed to fetch news: " + error);
  }
};

export const getAuthorNameById = async (userId: string): Promise<string | null> => {
  try {
    // Căutăm utilizatorul după ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // presupunem că 'id' este câmpul de identificare al utilizatorului
      },
      select: {
        firstName: true,  // Selectăm și prenumele
        lastName: true,   // Selectăm și numele
      },
    });

    // Dacă utilizatorul există, returnăm numele complet
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return null;  // Dacă utilizatorul nu există, returnăm null
  } catch (error) {
    console.error("Error fetching author name: ", error);
    return null;
  }
};