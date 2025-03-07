import { auth } from "@/lib/auth";
import { getHomeClassesByName, HomeClassSearchResult } from "@/lib/database/database";


export async function GET(request: Request) {
    // with authentification
    const session = await auth();
  
}
