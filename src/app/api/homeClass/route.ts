import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // ✅ Import corect

const prisma = new PrismaClient(); // ✅ Inițializează Prisma corect

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Obține sesiunea utilizatorului
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    // ✅ Obține user-ul logat împreună cu homeClassId-ul lui
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        facultyMember: {
          include: { homeroomClass: true },
        },
      },
    });

    const homeClassId = user?.student?.homeClassId || user?.facultyMember?.homeroomClass?.id;

    if (!homeClassId) {
      return res.status(404).json({ error: "User is not associated with any HomeClass" });
    }

    // ✅ Obține HomeClass + utilizatorii din ea
    const homeClass = await prisma.homeClass.findUnique({
      where: { id: homeClassId },
      include: {
        homeroomFacultyMember: {
          include: { user: true }, // Dirigintele
        },
        students: {
          include: { user: true }, // Elevii
        },
        courses: {
          include: { facultyMember: { include: { user: true } } }, // Profesorii
        },
      },
    });

    if (!homeClass) {
      return res.status(404).json({ error: "HomeClass not found" });
    }

    // ✅ Structurare răspuns API
    const responseData = {
      className: homeClass.name,
      homeroomTeacher: {
        name: `${homeClass.homeroomFacultyMember.user.firstName} ${homeClass.homeroomFacultyMember.user.lastName}`,
        email: homeClass.homeroomFacultyMember.user.email,
      },
      students: homeClass.students.map((student) => ({
        name: `${student.user.firstName} ${student.user.lastName}`,
        email: student.user.email,
      })),
      facultyMembers: homeClass.courses.map((course) => ({
        name: `${course.facultyMember.user.firstName} ${course.facultyMember.user.lastName}`,
        email: course.facultyMember.user.email,
        subject: course.subject,
      })),
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect(); // ✅ Evită conexiuni deschise la Prisma
  }
}
