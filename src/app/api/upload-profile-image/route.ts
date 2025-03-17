import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/database/database";

export const config = {
  api: {
    bodyParser: false, // Dezactivăm bodyParser-ul implicit
  },
};

export async function POST(req: NextRequest) {
  try {
    // Folosim formData() în loc de formidable
    const formData = await req.formData();
    const file = formData.get("file"); // "file" trebuie să fie numele input-ului în frontend
    const userId = formData.get("userId") as string | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "No userId provided" }, { status: 400 });
    }

    // Convertim fișierul într-un buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${file.name}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: imageUrl },
    });
    return NextResponse.json({ imageUrl, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "No userId provided" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.profileImage && user.profileImage !== "/uploads/default.jpg") {
      const filePath = path.join(process.cwd(), "public", user.profileImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: "/uploads/default.jpg" },
    });

    return NextResponse.json({ message: "Profile image removed", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error removing profile image:", error);
    return NextResponse.json({ error: "Error removing profile image" }, { status: 500 });
  }
}