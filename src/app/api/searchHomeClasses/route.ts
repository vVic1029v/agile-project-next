import { auth } from "@/lib/auth";
import { getHomeClassesByName, HomeClassSearchResult } from "@/lib/database/database";

// const query = formData.get("query") as string;

//   if (!query) return { results: [] };

//   const results = await getHomeClassesByName(query);

//   console.log(results);
//   return { results };

export async function GET(request: Request) {
    // with authentification
    const session = await auth();
  
}
