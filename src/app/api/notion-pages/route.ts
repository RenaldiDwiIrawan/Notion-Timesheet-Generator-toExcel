import { NextRequest, NextResponse } from "next/server";
import { searchTimesheetPages } from "@/lib/notion";

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-notion-api-key") || undefined;
    const pages = await searchTimesheetPages(apiKey);
    return NextResponse.json({ pages });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch pages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
