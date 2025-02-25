import { NextResponse } from "next/server";
import { getCheapUserByEmail, postNewCourse } from "@/lib/database/database";
import { UserType } from "@prisma/client";

// POST request handler
export async function POST(req: Request) {
  try {
    // Extract the request body
    const { homeClassId, teacherEmail, subject, weekScheduleIdentifier, color } = await req.json();

    // Get the teacher details from the database by email
    const teacher = await getCheapUserByEmail(teacherEmail);
    if (!teacher) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }
    if (teacher.userType !== UserType.FACULTYMEMBER) {
      return NextResponse.json({ error: "User is not a faculty member" }, { status: 400 });
    }

    // Create the course by passing necessary details to the function
    const course = await postNewCourse(homeClassId, teacher.id, subject, weekScheduleIdentifier, color);
    if (!course) {
      return NextResponse.json({ error: "Course creation failed" }, { status: 500 });
    }

    // Return success message with the created course details
    return NextResponse.json({ message: "Course created", course }, { status: 201 });

  } catch (error) {
    console.error("Error during course creation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
