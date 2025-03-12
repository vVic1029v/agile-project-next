import { NextResponse } from "next/server";
import { getCheapUserByEmail, postNewCourse } from "@/lib/database/database";
import { UserType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { homeClassId, teacherEmail, subject, weekScheduleIdentifier, color } = await req.json();


    const teacher = await getCheapUserByEmail(teacherEmail);
    if (!teacher) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }
    if (teacher.userType !== UserType.FACULTYMEMBER) {
      return NextResponse.json({ error: "User is not a faculty member" }, { status: 400 });
    }

    const course = await postNewCourse(homeClassId, teacher.id, subject, weekScheduleIdentifier, color);
    if (!course) {
      return NextResponse.json({ error: "Course creation failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Course created", course }, { status: 201 });

  } catch (error) {
    console.error("Error during course creation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
