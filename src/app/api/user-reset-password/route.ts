import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth, isAuthorized } from "@/lib/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      console.log("Unauthorized access");
      return NextResponse.json({ error: "Unauthorized access" }, { status: 400 });
    }

    if (!session || !isAuthorized(session, userId)) {
      console.log("Error: Unauthorized access for userId:", userId);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await request.json();
    if (!newPassword) {
      return NextResponse.json({ error: "Missing new password" }, { status: 400 });
    }

    // Hash the new password before saving it to the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password successfully updated" }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
