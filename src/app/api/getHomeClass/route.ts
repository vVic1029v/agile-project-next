import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/database/database";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // console.log("Session Data: ", session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user and their home class (student or facultyMember)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: { include: { homeClass: true } },
        facultyMember: { include: { homeroomClass: true } },
      },
    });

    // console.log("User Data: ", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Determine home class (for student or facultyMember)
    const homeClassId = user?.student?.homeClass?.id || user?.facultyMember?.homeroomClass?.id;

    if (!homeClassId) {
      return NextResponse.json({ error: "User is not assigned to a home class" }, { status: 404 });
    }

    // Fetch home class details
    const homeClass = await prisma.homeClass.findUnique({
      where: { id: homeClassId },
      include: {
        homeroomFacultyMember: { include: { user: true } },
        students: { include: { user: true } },
        courses: { include: { facultyMember: { include: { user: true } } } },
      },
    });

    // console.log("HomeClass Data: ", homeClass);

    if (!homeClass) {
      return NextResponse.json({ error: "Home class not found" }, { status: 404 });
    }

    // Construct response with optional chaining and fallback values
    const responseData = {
      homeClassId,
      className: homeClass.name ?? "Unknown Class",
      homeroomTeacher: homeClass.homeroomFacultyMember
        ? {
            name: `${homeClass.homeroomFacultyMember.user?.firstName ?? "Unknown"} ${homeClass.homeroomFacultyMember.user?.lastName ?? "Unknown"}`,
            email: homeClass.homeroomFacultyMember.user?.email ?? "No email",
          }
        : { name: "No homeroom teacher", email: "N/A" },
      students: homeClass.students.map((student) => ({
        name: `${student.user?.firstName ?? "Unknown"} ${student.user?.lastName ?? "Unknown"}`,
        email: student.user?.email ?? "No email",
      })),
      facultyMembers: homeClass.courses.map((course) => ({
        name: `${course.facultyMember.user?.firstName ?? "Unknown"} ${course.facultyMember.user?.lastName ?? "Unknown"}`,
        email: course.facultyMember.user?.email ?? "No email",
        subject: course.subject ?? "Unknown Subject",
      })),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
