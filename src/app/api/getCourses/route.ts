import { NextResponse } from "next/server";
import { getUserCourses } from "@/lib/database";
import { auth, isAuthorized } from "@/lib/auth";
import { Course } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const session = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  if (!isAuthorized(session, userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
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
      return NextResponse.json({ message: "User courses fetched successfully", courses }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No courses found for this user" }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
