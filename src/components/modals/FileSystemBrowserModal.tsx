import React from "react";

interface FileSystemBrowserModalProps {
  show: boolean;
  onClose: () => void;
  t: any;
  fsMode: "file" | "directory";
  fsPath: string;
  fsLoading: boolean;
  fsEntries: Array<{ name: string; path: string; isDirectory: boolean }>;
  loadDir: (pathStr: string) => void;
  confirmSelection: (pathStr: string) => void;
  getIconForFile: (name: string, isDirectory: boolean) => string;
}

export default function FileSystemBrowserModal({
  show,
  onClose,
  t,
  fsMode,
  fsPath,
  fsLoading,
  fsEntries,
  loadDir,
  confirmSelection,
  getIconForFile,
}: FileSystemBrowserModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col h-[60vh] max-h-[600px]">
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {fsMode === "directory" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              )}
            </svg>
            {fsMode === "directory" ? t.fsSelectDir : t.fsSelectTemp}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="bg-zinc-900 px-4 py-3 flex gap-2 border-b border-zinc-800 items-center">
          <span className="text-zinc-500 text-xs font-mono shrink-0">
            {t.fsPath}
          </span>
          <div className="bg-zinc-950 rounded bg-opacity-50 px-3 py-1.5 flex-1 min-w-0 text-xs text-zinc-300 font-mono truncate border border-zinc-800/50">
            {fsPath}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-zinc-900 p-2">
          {fsLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-blue-500 border-zinc-700"></div>
            </div>
          ) : (
            <ul className="space-y-1">
              {fsEntries.map((entry, idx) => (
                <li key={idx}>
                  <button
                    onClick={() =>
                      entry.isDirectory
                        ? loadDir(entry.path)
                        : fsMode === "file" && confirmSelection(entry.path)
                    }
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      !entry.isDirectory && fsMode === "directory"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-zinc-800 cursor-pointer"
                    }`}
                    disabled={!entry.isDirectory && fsMode === "directory"}
                  >
                    <span className="text-lg leading-none">
                      {getIconForFile(entry.name, entry.isDirectory)}
                    </span>
                    <span
                      className={`text-sm ${
                        entry.isDirectory
                          ? "text-blue-300 font-medium"
                          : "text-zinc-300"
                      }`}
                    >
                      {entry.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-end gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={onClose}
            className="shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            {t.fsCancel}
          </button>
          {fsMode === "directory" && (
            <button
              onClick={() => confirmSelection(fsPath)}
              className="shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition"
            >
              {t.fsSelectCurrent}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
