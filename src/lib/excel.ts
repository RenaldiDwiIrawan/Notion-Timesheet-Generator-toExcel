import ExcelJS from "exceljs";
import path from "path";
import { TimesheetEntry } from "./notion";

const MONTH_NAMES_ID: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const MONTH_NAMES_ID_UPPER: Record<number, string> = {
  1: "JANUARY",
  2: "FEBUARY",
  3: "MARCH",
  4: "APRIL",
  5: "MAY",
  6: "JUNE",
  7: "JULY",
  8: "AUGUST",
  9: "SEPTEMBER",
  10: "OCTOBER",
  11: "NOVEMBER",
  12: "DECEMBER",
};

// Approximate character width in points for Calibri 12
const CHAR_HEIGHT_PT = 15;

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Generates a filled timesheet Excel file from the template.
 */
export async function generateTimesheet(
  entries: TimesheetEntry[],
  year: number,
  month: number,
  signatures?: {
    submitterName: string;
    submitterDate: string;
    submitterSignature: string | null;
    approverName: string;
    approverDate: string;
    templatePath?: string;
  }
): Promise<Buffer> {
  const templatePath =
    signatures?.templatePath ||
    process.env.TEMPLATE_PATH ||
    "/mnt/d/XL/timesheet/Polosan Oke Mantapp.xlsx";

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(templatePath);

  const ws = wb.getWorksheet("Timesheet");
  if (!ws) throw new Error("Timesheet sheet not found in template");

  const daysInMonth = getDaysInMonth(year, month);

  // --- 1. Set the start date in B5 ---
  // Create the date in UTC to prevent timezone shifts pushing it backwards to the previous month
  const startDate = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0)); // 1st of the month at noon UTC
  const cellB5 = ws.getCell("B5");
  cellB5.value = startDate;

  // --- 2. Update period text in G3 ---
  const lastDay = daysInMonth.toString().padStart(2, "0");
  const monthName = MONTH_NAMES_ID[month];
  ws.getCell("G3").value = `01 ${monthName} - ${lastDay} ${monthName}`;

  // --- 3. Build a map of day -> tasks ---
  const taskMap = new Map<number, string>();
  for (const entry of entries) {
    if (taskMap.has(entry.day)) {
      // Merge multiple tasks for the same day with a newline
      const existing = taskMap.get(entry.day);
      taskMap.set(entry.day, `${existing}\n${entry.tasks}`);
    } else {
      taskMap.set(entry.day, entry.tasks);
    }
  }

  // Table spans columns A-J (1-10)
  const TABLE_COL_START = 1;
  const TABLE_COL_END = 10;

  // --- 4. Fill in tasks for each day (rows 5 to 5+daysInMonth-1) ---
  for (let dayIdx = 0; dayIdx < 31; dayIdx++) {
    const rowNum = 5 + dayIdx;
    const dayOfMonth = dayIdx + 1;
    const row = ws.getRow(rowNum);

    // If this is row 35 (the 31st day) and the template didn't have styles/formulas for it,
    // we need to copy them from row 34 (the 30th day)
    if (dayIdx === 30 && dayOfMonth <= daysInMonth) {
      const prevRow = ws.getRow(rowNum - 1);
      for (let col = TABLE_COL_START; col <= TABLE_COL_END; col++) {
        const currentCell = row.getCell(col);
        const prevCell = prevRow.getCell(col);

        // Copy style (borders, font, alignment)
        currentCell.style = { ...prevCell.style };

        // Copy formulas and adjust row references
        if (prevCell.type === ExcelJS.ValueType.Formula && prevCell.formula) {
          // A simple string replace to increment row numbers in the formula
          // e.g. E34-C34 -> E35-C35
          const newFormula = prevCell.formula.replace(new RegExp(`(\\w+)${rowNum - 1}`, 'g'), `$1${rowNum}`);
          currentCell.value = { formula: newFormula };
        } else if (col === 2) {
          // Column B is the date, we can explicitly set it just to be safe if there's no formula
          // Or we can let Excel calculate it if the formula copies over.
          // Let's set the exact date in UTC
          currentCell.value = new Date(Date.UTC(year, month - 1, dayOfMonth, 12, 0, 0));
        } else if (col === 1) {
          // Column A is the day name text
          currentCell.value = { formula: `TEXT(B${rowNum},"dddd")` };
        } else {
          // For static values like Time In (C), Time Break (D), Time Out (E), Location, etc.
          currentCell.value = prevCell.value;
        }
      }

      // Explicitly merge the same columns that were merged on row 34 (G through J)
      ws.mergeCells(`G${rowNum}:J${rowNum}`);
    }

    if (dayOfMonth <= daysInMonth) {
      const date = new Date(year, month - 1, dayOfMonth);
      const dayOfWeek = date.getDay(); // 0=Sunday, 6=Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Saturday & Sunday

      // Apply fill to table columns (A-J) using style clone to avoid ExcelJS shared style bugs
      for (let col = TABLE_COL_START; col <= TABLE_COL_END; col++) {
        const cell = row.getCell(col);
        const existingStyle = { ...cell.style };
        cell.style = {
          ...existingStyle,
          fill: isWeekend
            ? { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFFFFF00" } }
            : { type: "pattern" as const, pattern: "none" as const },
        };
      }

      // Only fill tasks on weekdays (Monday-Friday)
      const taskText = isWeekend ? "" : (taskMap.get(dayOfMonth) || "");
      const cellG = row.getCell(7); // Column G

      cellG.value = taskText;
      cellG.alignment = {
        horizontal: "left",
        vertical: "middle",
        wrapText: true,
      };
      cellG.font = { name: "Calibri", size: 12 };

      // Auto-resize row height based on number of lines
      if (taskText) {
        const lineCount = taskText.split("\n").length;
        const estimatedHeight = Math.max(21, lineCount * CHAR_HEIGHT_PT + 6);
        row.height = estimatedHeight;
      } else {
        row.height = 21;
      }
    } else {
      // Days beyond the month's length: clear the row data and color completely
      row.height = 21;

      for (let col = TABLE_COL_START; col <= TABLE_COL_END; col++) {
        const cell = row.getCell(col);

        // Clear value and formula completely
        cell.value = null;

        // Reset fill to none and clear borders so the table actually ends
        const existingStyle = { ...cell.style };
        cell.style = {
          ...existingStyle,
          fill: { type: "pattern" as const, pattern: "none" as const },
          border: {} // Removes the grid lines
        };
      }
    }
  }

  // --- 4.5. Fill Signature block in "Timesheet" sheet ---
  // Submitter Name
  const subNameStr = signatures?.submitterName || "";
  const subDateStr = signatures?.submitterDate || "";

  // Approver Name
  const appNameStr = signatures?.approverName || "";
  const appDateStr = signatures?.approverDate || "";

  // Create one large, single outline box spanning R45-R52, Cols 1-7 (A-G)
  for (let r = 45; r <= 52; r++) {
    for (let c = 1; c <= 7; c++) {
      const cell = ws.getCell(r, c);
      const existingStyle = { ...cell.style };

      // Clear all existing borders for these cells first
      const border: Partial<ExcelJS.Borders> = {};

      // Draw Top edge of the entire block
      if (r === 45) border.top = { style: "thin", color: { argb: "FF000000" } };

      // Draw Bottom edge of the entire block
      if (r === 52) border.bottom = { style: "thin", color: { argb: "FF000000" } };

      // Draw Left edge of the entire block
      if (c === 1) border.left = { style: "thin", color: { argb: "FF000000" } };

      // Draw Separator between Submitted by and Approved by Leader (Column D)
      if (c === 4) border.left = { style: "thin", color: { argb: "FF000000" } };

      // Draw Right edge of the entire block (Column G)
      if (c === 7) border.right = { style: "thin", color: { argb: "FF000000" } };

      cell.style = { ...existingStyle, border };
    }

    // Also, clear out borders for columns 8-10 (H-J) in rows 45-52 so we don't have stray gridlines there
    for (let c = 8; c <= 10; c++) {
      const cell = ws.getCell(r, c);
      const existingStyle = { ...cell.style };
      cell.style = { ...existingStyle, border: {} };
    }
  }

  // Helper to safely write to a cell while preserving its new clean style
  const writeCell = (row: number, col: number, text: string) => {
    const cell = ws.getCell(row, col);
    cell.value = text;
  };

  // Submitter Block (Left side - Col 1 / A)
  writeCell(45, 1, "Submitted by :");
  writeCell(50, 1, `Name : ${subNameStr}`);
  writeCell(51, 1, `Date : ${subDateStr}`);

  // Approver Block (Right side - Moved 2 cols left to Col 4 / D)
  writeCell(45, 4, "Approved by Leader :");
  writeCell(50, 4, `Name : ${appNameStr}`);
  writeCell(51, 4, `Date : ${appDateStr}`);

  // Delete any existing signature images in the template (so we have a clean slate)
  // In ExcelJS, images are stored in a private array called _media on the worksheet object.
  if ((ws as any)._media) {
    (ws as any)._media = (ws as any)._media.filter((mediaItem: any) => {
      // Check if this image falls in the signature block (rows 43-55)
      const startRow = mediaItem.range?.tl?.nativeRow;
      if (startRow !== undefined && startRow >= 43 && startRow <= 55) {
        return false; // Remove this image (the original signature from the template)
      }
      return true; // Keep everything else (like company logos at the top)
    });
  }

  // Insert Submitter Signature Image if provided
  if (signatures?.submitterSignature) {
    // The base64 string includes 'data:image/png;base64,' so we must split it
    const base64Data = signatures.submitterSignature.split(",")[1];

    // Determine the extension (jpeg or png)
    const extMatch = signatures.submitterSignature.match(/data:image\/(png|jpeg|jpg);base64/);
    const ext = extMatch ? (extMatch[1] === 'jpg' ? 'jpeg' : extMatch[1]) : 'png';

    const imageId = wb.addImage({
      base64: base64Data,
      extension: ext as "png" | "jpeg",
    });

    // Center the signature in the "Submitted by" block (Columns A to C)
    // We want the image placed in the block R46C2 - R49C3
    // Note: ExcelJS coordinates are 0-indexed for positioning ranges.
    // The "Submitted by :" block spans from Col 1 to Col 3 (index 0 to 2, width of 3)
    // To center it, we can offset it slightly.
    // Ensure the image doesn't overlap the name text which is on row 50 (index 49)
    // Resize slightly smaller by pulling in both top-left and bottom-right edges
    ws.addImage(imageId, {
      tl: { col: 0.8, row: 45.6 }, // Push down and right slightly
      br: { col: 2.2, row: 48.6 }, // Pull up and left slightly to shrink and avoid name
      editAs: "oneCell"
    } as any);
  }

  // --- 4.6. Fill Signature block in "Project Based Delivery" sheet ---
  const wsProject = wb.getWorksheet("Project Based Delivery");
  if (wsProject) {
    // Fill Submitter Name (Row 44, Col 1 is "Name : ")
    // We update C1 (which corresponds to "Submitted by:")
    const nameCell = wsProject.getCell(44, 1);
    nameCell.value = `Name : ${subNameStr}`;

    const dateCell = wsProject.getCell(45, 1);
    dateCell.value = `Date : ${subDateStr}`;
  }

  // --- 5. Write to buffer ---
  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/**
 * Generate the output filename
 */
export function getOutputFilename(year: number, month: number, format?: string): string {
  const monthUpper = MONTH_NAMES_ID_UPPER[month];
  if (format) {
    return format
      .replace(/{MM}/g, month.toString().padStart(2, "0"))
      .replace(/{MMM}/g, monthUpper)
      .replace(/{YYYY}/g, year.toString());
  }
  return `ADL_RENALDI_DWI_IRAWAN_TIMESHEET_${monthUpper}_${year}`;
}

/**
 * Save the generated timesheet to the output directory
 */
export async function saveTimesheet(
  buffer: Buffer,
  year: number,
  month: number,
  outputDirOverride?: string,
  filenameFormat?: string
): Promise<string> {
  const fs = await import("fs/promises");
  const outputDir = outputDirOverride || process.env.OUTPUT_DIR || "";
  
  if (!outputDir) return ""; // Skip if no directory is specified

  const filename = `${getOutputFilename(year, month, filenameFormat)}.xlsx`;
  const outputPath = path.join(outputDir, filename);

  await fs.writeFile(outputPath, buffer);
  return outputPath;
}
