import { NextRequest, NextResponse } from "next/server";
import { fetchTimesheetFromPage } from "@/lib/notion";
import {
  generateTimesheet,
  getOutputFilename,
  saveTimesheet,
} from "@/lib/excel";

export async function POST(request: NextRequest) {
  try {
    const {
      pageId,
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
      notionApiKey
    } = await request.json();

    if (!pageId || !year || !month) {
      return NextResponse.json(
        { error: "Missing required fields: pageId, year, month" },
        { status: 400 }
      );
    }

    // 1. Fetch data from Notion
    const entries = await fetchTimesheetFromPage(pageId, notionApiKey);

    if (entries.length === 0) {
      return NextResponse.json(
        {
          error:
            "No timesheet entries found. Make sure the Notion page has a table with tanggal/hari column.",
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
        submitterName: submitterName || "Renaldi Dwi Irawan",
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
    console.error("Generate error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
