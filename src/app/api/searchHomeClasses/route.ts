import { auth } from "@/lib/auth";
import { getHomeClassesByName, HomeClassSearchResult } from "@/lib/database/database";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET(req: Request) {
    try {
      const session = await auth();
      if (!session?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
      }
  
      // Obține toate clasele disponibile
      const homeClasses = await prisma.homeClass.findMany({
        select: {
          id: true,
          name: true,
        },
      });
  
      return new Response(JSON.stringify(homeClasses), { status: 200 });
    } catch (error) {
      console.error("Error fetching home classes:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }