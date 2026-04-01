import { NextRequest, NextResponse } from "next/server";
import {
  generateTimesheet,
  getOutputFilename,
  saveTimesheet,
} from "@/lib/excel";
import { TimesheetEntry } from "@/lib/notion";

/**
 * Parse Notepad text (.txt) into TimesheetEntry[]
 * Supports multi-line tasks and flexible separators.
 */
function parseNotepadText(text: string): TimesheetEntry[] {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  if (lines.length < 2) {
    throw new Error("File harus memiliki minimal header dan satu baris data.");
  }

  const entries: TimesheetEntry[] = [];
  let currentEntry: TimesheetEntry | null = null;

  // Regex for date marker at start: digit/dayName
  const dateMarkerRe = /^(\d{1,2})\s*\/\s*([a-zA-Z]+)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const match = line.match(dateMarkerRe);

    if (match) {
      // New date entry found
      const day = parseInt(match[1], 10);
      const dayName = match[2].toLowerCase();

      // The task might be on the same line after the date marker
      // Find where the date marker ends
      const markerText = match[0];
      const taskOnThisLine = line.substring(markerText.length).trim();

      currentEntry = {
        day,
        dayName,
        tasks: taskOnThisLine
      };
      entries.push(currentEntry);
    } else if (currentEntry) {
      // Continuation of previous entry's task
      if (currentEntry.tasks) {
        currentEntry.tasks += "\n" + line;
      } else {
        currentEntry.tasks = line;
      }
    }
  }

  // Final sort just in case
  entries.sort((a, b) => a.day - b.day);
  return entries;
}

function parseDateCell(text: string): { day: number; dayName: string } | null {
  // Format: "2/senin" or "2 / senin" or "2/Senin"
  const match = text.match(/(\d{1,2})\s*\/\s*(\w+)/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const dayName = match[2].toLowerCase();

  if (isNaN(day) || day < 1 || day > 31) return null;
  return { day, dayName };
}

export async function POST(request: NextRequest) {
  try {
    const {
      notepadData,
      year,
      month,
      submitterName,
      submitterDate,
      submitterSignature,
      approverName,
      approverDate,
      templatePath,
      templateData,
      outputFilenameFormat,
      outputDir,
    } = await request.json();

    if (!notepadData || !year || !month) {
      return NextResponse.json(
        { error: "Missing required fields: notepadData, year, month" },
        { status: 400 }
      );
    }

    // 1. Parse notepad text data
    const entries = parseNotepadText(notepadData);

    if (entries.length === 0) {
      return NextResponse.json(
        {
          error:
            "No timesheet entries found. Make sure the file uses format: 1/senin [TAB] Task description",
        },
        { status: 404 }
      );
    }

    // 2. Generate Excel
    const templateBuffer = templateData
      ? Buffer.from(templateData.split(",")[1], "base64")
      : undefined;

    const buffer = await generateTimesheet(
      entries,
      year,
      month,
      {
        submitterName: submitterName || "",
        submitterDate: submitterDate || "",
        submitterSignature: submitterSignature || null,
        approverName: approverName || "",
        approverDate: approverDate || "",
        templatePath: templatePath || undefined,
        templateBuffer
      }
    );

    // 3. Save to output directory
    const savedPath = await saveTimesheet(buffer, year, month, outputDir, outputFilenameFormat);

    // 4. Also return the file as download
    const filename = `${getOutputFilename(year, month, outputFilenameFormat)}.xlsx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Saved-Path": savedPath,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate timesheet";
    console.error("Generate from file error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
