import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../../lib/email";

const prisma = new PrismaClient();

// Funcția de întârziere (delay)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const { title, content, date, allUsers, homeClassIds } = await req.json();

    if (!title || !content || !date) {
      return NextResponse.json({ error: "Title, content, and date are required" }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        date: new Date(date),
        allUsers,
        homeClasses: homeClassIds?.length
          ? { connect: homeClassIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { homeClasses: true },
    });

    let usersToNotify: { email: string }[] = [];

    if (allUsers) {
      usersToNotify = await prisma.user.findMany({
        select: { email: true },
      });
    } else if (homeClassIds?.length) {
      usersToNotify = await prisma.user.findMany({
        where: {
          student: { homeClassId: { in: homeClassIds } },
        },
        select: { email: true },
      });
    }

    const emailPromises = usersToNotify.map(async (user, index) => {
      if (index > 0) {
        await delay(500); 
      }
      await sendEmail(user.email, `New Announcement: ${title}`, content);
    });

    await Promise.all(emailPromises);

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { homeClasses: true },
    });

    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}
