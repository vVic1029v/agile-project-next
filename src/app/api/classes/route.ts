import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/database";

// 🔹 GET: Obține toate clasele
export async function GET(req: NextRequest) {
  try {
    const classes = await prisma.homeClass.findMany();
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
