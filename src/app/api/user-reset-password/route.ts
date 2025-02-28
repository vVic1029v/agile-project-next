import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resetUserPassword } from "@/lib/database/database";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
   

    const authHeader = req.headers.get("authorization");
    console.log("Authorization Header:", authHeader);
    const session = await getServerSession(authOptions);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token:", token);

    console.log("Session:", session);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = session.user.id;

   
    const { newPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json({ error: "Missing new password" }, { status: 400 });
    }

   
    const result = await resetUserPassword(userId, newPassword);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ message: result.message }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
