import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"; // Importăm UploadApiResponse pentru tipizare
import streamifier from "streamifier"; // Importăm streamifier pentru conversia fluxului
import { Readable } from 'stream'; // Importăm Readable pentru manipularea fluxurilor Node.js

// Configurarea Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Funcție pentru a converti ReadableStream într-un Buffer
function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    const reader = stream.getReader();
    const pump = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          resolve(Buffer.concat(chunks)); // Concatenează și returnează Buffer-ul complet
        } else {
          chunks.push(value);
          pump(); // Continuă citirea
        }
      }).catch(reject);
    };
    pump();
  });
}

// Funcție pentru a încărca un fișier folosind stream
async function uploadFileBuffer(buffer: Buffer, userId: string): Promise<UploadApiResponse> { // Așteptăm Buffer, nu ReadableStream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `user_uploads/${userId}`,
        public_id: `${userId}-${Date.now()}`,
        resource_type: "auto", // Permite încărcarea oricărui tip de fișier
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result!); // Asigurăm că rezultatul nu va fi null sau undefined
      }
    );

    // Folosim Buffer-ul pentru a încărca datele
    uploadStream.end(buffer); // Folosim `end()` pentru a trimite Buffer-ul la Cloudinary
  });
}

// API pentru încărcarea pozelor pe Cloudinary
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // Fișierul trimis din client
    const userId = formData.get("userId") as string | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "No userId provided" }, { status: 400 });
    }

    // Convertirea Blob într-un ReadableStream
    const fileStream = file.stream();

    // Convertește ReadableStream într-un Buffer
    const buffer = await streamToBuffer(fileStream);

    // Încărcarea fișierului pe Cloudinary
    const uploadResponse = await uploadFileBuffer(buffer, userId);

    // Returnează URL-ul fișierului încărcat pe Cloudinary
    return NextResponse.json({ imageUrl: uploadResponse.secure_url, userId }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
