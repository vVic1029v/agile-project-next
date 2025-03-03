import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 GET: Obține toate anunțurile
export async function GET(req: NextRequest) {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { homeClasses: true },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

// 🔹 POST: Creează un anunț nou
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

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
