import { NextResponse } from "next/server";
import { auth, isAuthorized } from "@/lib/auth";  
import { prisma } from "@/lib/database/database";


export async function GET(request: Request) {




  const session = await auth();

  const userId = session?.user.id;
  if (!userId) {
    console.log("Unauthorized access")
    return NextResponse.json({ error: "Unauthorized access" }, { status: 400 });
  }

  
  if (!session || !isAuthorized(session, userId)) {
    console.log("Error: Unauthorized access for userId:", userId);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userType: true,
        profileImage:true,
      },
    });

    if (!user) {
      console.log("Error: User not found for userId:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

 
    return NextResponse.json({ message: "User fetched successfully", user }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
