import { NextResponse } from "next/server";
import { getUserEvents } from "@/lib/database";
import { auth, isAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const session = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  if (!isAuthorized(session, userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const events = await getUserEvents(userId);
    if (events && events.length > 0) {
      return NextResponse.json({ message: "User events fetched successfully", events }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No events found for this user" }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
