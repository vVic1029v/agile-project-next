import { NextResponse } from "next/server";
import { UserType } from "@prisma/client";
import { getCheapUserByEmail, postNewHomeClass } from "@/lib/database/database";

export async function POST(req: Request) {
  try {
    // const session = await auth();
    // if (!session) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
    // if (session.user.role ) { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

    const { teacherEmail, startYear, nameLetter } = await req.json();

    const assingedTeacher = await getCheapUserByEmail(teacherEmail)
    if (!assingedTeacher) return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    if (assingedTeacher.userType !== UserType.FACULTYMEMBER) return NextResponse.json({ error: "User is not a faculty member" }, { status: 400 });

    const newClass = await postNewHomeClass(assingedTeacher.id, startYear, nameLetter);

    return NextResponse.json({ message: "HomeClass created", class: newClass }, { status: 201 });
  } catch (error) {
    console.error("Error during HomeClass creation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
