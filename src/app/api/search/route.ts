import { NextResponse } from "next/server";

import { searchMulti } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = (searchParams.get("query") ?? "").trim();
  const query = rawQuery.toLowerCase();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchMulti(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API failed", error);
    return NextResponse.json(
      { error: "Unable to fetch search results" },
      { status: 500 },
    );
  }
}



