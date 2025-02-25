"use server";

import { getHomeClassesByName, HomeClassSearchResult } from "@/lib/database/database";

export async function SearchHomeClasses(formData: FormData): Promise<{ results: HomeClassSearchResult[] }> {
  const query = formData.get("query") as string;

  if (!query) return { results: [] };

  const results = await getHomeClassesByName(query);

  console.log(results);
  return { results };
}



export async function NewCourse(formData: FormData) {
  
}
