import { NextResponse } from "next/server";
import { UserType } from "@prisma/client";
import { getCheapUserByEmail, postNewHomeClass } from "@/lib/database/database";

export async function POST(req: Request) {
  try {
    const { teacherEmail, startYear, nameLetter } = await req.json();

    if (!teacherEmail || !startYear || !nameLetter) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const assignedTeacher = await getCheapUserByEmail(teacherEmail);
    if (!assignedTeacher) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    if (assignedTeacher.userType !== UserType.FACULTYMEMBER) {
      return NextResponse.json({ error: "User is not a faculty member" }, { status: 403 });
    }

    const newClass = await postNewHomeClass(assignedTeacher.id, Number(startYear), nameLetter);

    if (!newClass) {
      console.error("postNewHomeClass returned null or undefined");
      throw new Error("Failed to create new HomeClass");
    }

    return NextResponse.json({ message: "HomeClass created successfully", class: newClass }, { status: 201 });

  } catch (error) {
    console.error("Error during HomeClass creation:", error);
    return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
  }
}
