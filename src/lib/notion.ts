import { Client } from "@notionhq/client";

export interface TimesheetEntry {
  day: number; // day of month (1-31)
  dayName: string; // e.g. "senin", "selasa"
  tasks: string; // the full task text
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

/**
 * Raw fetch helper for Notion API (SDK v5 doesn't expose databases.query)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function notionFetch(path: string, body?: object): Promise<any> {
  const resp = await fetch(`${NOTION_API_BASE}/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(
      `Notion API error: ${data.message || resp.statusText} (${data.code})`
    );
  }
  return data;
}

/**
 * Fetches timesheet data from a Notion database.
 * Supports databases with "tanggal/hari" (title) and "i do" (rich_text) columns.
 */
export async function fetchTimesheetFromPage(
  pageId: string
): Promise<TimesheetEntry[]> {
  // First, determine if this is a database or a page
  const type = await detectType(pageId);

  if (type === "database") {
    return fetchFromDatabase(pageId);
  }

  // If it's a page, look for a child database or table inside it
  return fetchFromPageBlocks(pageId);
}

/**
 * Detect whether the given ID is a database or a page.
 */
async function detectType(id: string): Promise<"database" | "page"> {
  try {
    await notionFetch(`databases/${id}`);
    return "database";
  } catch {
    return "page";
  }
}

/**
 * Fetch timesheet data from a Notion database.
 * Properties: "tanggal/hari" (title), "i do" (rich_text)
 */
async function fetchFromDatabase(dbId: string): Promise<TimesheetEntry[]> {
  const entries: TimesheetEntry[] = [];
  let hasMore = true;
  let startCursor: string | undefined;

  while (hasMore) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = { page_size: 100 };
    if (startCursor) body.start_cursor = startCursor;

    const data = await notionFetch(`databases/${dbId}/query`, body);

    for (const row of data.results) {
      const props = row.properties;

      // Find the title property (tanggal/hari)
      const dateText = extractPropertyText(props, "title");
      // Find the rich_text property (i do)
      const taskText = extractPropertyText(props, "rich_text");

      if (!dateText) continue;

      const parsed = parseDateCell(dateText);
      if (!parsed) continue;

      entries.push({
        day: parsed.day,
        dayName: parsed.dayName,
        tasks: taskText.trim(),
      });
    }

    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  // Sort by day
  entries.sort((a, b) => a.day - b.day);
  return entries;
}

/**
 * Fetch timesheet data from a page containing a table block.
 */
async function fetchFromPageBlocks(
  pageId: string
): Promise<TimesheetEntry[]> {
  const blocks = await getAllBlocks(pageId);

  // Look for child_database first, then table
  const childDb = blocks.find((b) => b.type === "child_database");
  if (childDb) {
    return fetchFromDatabase(childDb.id);
  }

  const tableBlock = blocks.find((b) => b.type === "table");
  if (!tableBlock) {
    throw new Error(
      "No table or database found in the Notion page. Make sure your timesheet page has a table with tanggal/hari and task columns."
    );
  }

  const rows = await getAllBlocks(tableBlock.id);
  const entries: TimesheetEntry[] = [];

  for (const row of rows) {
    if (row.type !== "table_row") continue;

    const cells = row.table_row.cells;
    if (cells.length < 2) continue;

    const dateCell = extractText(cells[0]);
    const taskCell = extractText(cells[1]);

    if (
      dateCell.toLowerCase().includes("tanggal") ||
      dateCell.toLowerCase().includes("hari")
    ) {
      continue;
    }

    const parsed = parseDateCell(dateCell);
    if (!parsed) continue;

    entries.push({
      day: parsed.day,
      dayName: parsed.dayName,
      tasks: taskCell.trim(),
    });
  }

  entries.sort((a, b) => a.day - b.day);
  return entries;
}

/**
 * Search for timesheet databases and pages in the workspace.
 */
export async function searchTimesheetPages(): Promise<
  { id: string; title: string }[]
> {
  const results: { id: string; title: string }[] = [];

  // Search for databases (use raw fetch since SDK types don't support "database" filter)
  const dbData = await notionFetch("search", {
    query: "Timesheet",
    filter: { property: "object", value: "database" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
  });

  for (const db of dbData.results) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titleArr = (db as any).title;
    const title = titleArr?.map((t: { plain_text: string }) => t.plain_text).join("") || "Untitled";
    if (title.toLowerCase().includes("timesheet")) {
      results.push({ id: db.id, title: `[DB] ${title}` });
    }
  }

  // Search for pages too
  const pageResponse = await notion.search({
    query: "Timesheet",
    filter: { property: "object", value: "page" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
  });

  for (const page of pageResponse.results) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titleProp = (page as any).properties?.title?.title;
    let title = "Untitled";
    if (titleProp && titleProp.length > 0) {
      title = titleProp.map((t: { plain_text: string }) => t.plain_text).join("");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cp = (page as any).child_page;
      if (cp?.title) title = cp.title;
    }
    if (title.toLowerCase().includes("timesheet")) {
      results.push({ id: page.id, title });
    }
  }

  return results;
}

// --- Helper functions ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAllBlocks(blockId: string): Promise<any[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Extract text from a property by type.
 * Searches all properties for one matching the given type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractPropertyText(properties: Record<string, any>, type: string): string {
  for (const prop of Object.values(properties)) {
    if (prop.type === type) {
      const arr = prop[type];
      if (Array.isArray(arr)) {
        return arr.map((t: { plain_text: string }) => t.plain_text || "").join("");
      }
    }
  }
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(richTexts: any[]): string {
  return richTexts.map((rt) => rt.plain_text || "").join("");
}

function parseDateCell(
  text: string
): { day: number; dayName: string } | null {
  // Format: "2/senin" or "2 / senin" or "2/Senin"
  const match = text.match(/(\d{1,2})\s*\/\s*(\w+)/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const dayName = match[2].toLowerCase();

  if (isNaN(day) || day < 1 || day > 31) return null;

  return { day, dayName };
}
