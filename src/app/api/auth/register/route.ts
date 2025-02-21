import { NextResponse } from "next/server";
import { getCheapUserByEmail, postNewUser } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, userType } = await req.json();

    // Check if the user already exists
    const existingUser = await getCheapUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the new user
    const newUser = await postNewUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      userType);
      

    return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error during user creation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
