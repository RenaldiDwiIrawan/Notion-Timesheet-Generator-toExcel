import { NextResponse } from "next/server";
import { searchTimesheetPages } from "@/lib/notion";

export async function GET() {
  try {
    const pages = await searchTimesheetPages();
    return NextResponse.json({ pages });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch pages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
