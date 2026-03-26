import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetPath = searchParams.get("path") || "/mnt/d";

  try {
    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    const files = entries.map(e => ({
      name: e.name,
      isDirectory: e.isDirectory(),
      path: path.join(targetPath, e.name)
    })).sort((a, b) => {
      // Folders first
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    const parent = path.dirname(targetPath);
    return NextResponse.json({
      currentPath: targetPath,
      parent: parent === targetPath ? null : parent,
      files
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read directory." }, { status: 400 });
  }
}
