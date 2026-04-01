import React from "react";
import { NotionPage } from "../../types";

interface ConfigurationSectionProps {
  t: any;
  isDark: boolean;
  month: number;
  handleMonthChange: (m: number) => void;
  year: number;
  handleYearChange: (y: number) => void;
  dataSource: "notion" | "notepad";
  setDataSource: (s: "notion" | "notepad") => void;
  setIsAutoPopup: (b: boolean) => void;
  setShowSetupHelp: (b: boolean) => void;
  setShowNotepadHelp: (b: boolean) => void;
  notionApiKey: string;
  setNotionApiKey: (s: string) => void;
  showApiKey: boolean;
  setShowApiKey: (b: boolean) => void;
  pageId: string;
  setPageId: (s: string) => void;
  pageIdRef: React.RefObject<HTMLInputElement | null>;
  searchPages: () => void;
  searching: boolean;
  pages: NotionPage[];
  csvData: string | null;
  setCsvData: (s: string | null) => void;
  csvFileName: string;
  setCsvFileName: (s: string) => void;
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  csvInputRef: React.RefObject<HTMLInputElement | null>;
  shakingFields: string[];
}

export default function ConfigurationSection({
  t,
  isDark,
  month,
  handleMonthChange,
  year,
  handleYearChange,
  dataSource,
  setDataSource,
  setIsAutoPopup,
  setShowSetupHelp,
  setShowNotepadHelp,
  notionApiKey,
  setNotionApiKey,
  showApiKey,
  setShowApiKey,
  pageId,
  setPageId,
  pageIdRef,
  searchPages,
  searching,
  pages,
  csvData,
  setCsvData,
  csvFileName,
  setCsvFileName,
  handleCsvUpload,
  csvInputRef,
  shakingFields,
}: ConfigurationSectionProps) {
  return (
    <div className="space-y-6">
      <div
        className={`group rounded-3xl border p-5 sm:p-7 transition-all duration-500 ${isDark ? "bg-zinc-900/40 border-zinc-800/80 hover:border-blue-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]" : "bg-white border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.15em] text-blue-500">
            <div
              className={`p-1.5 rounded-lg ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            {t.period}
          </h2>
          <div
            className={`h-px flex-1 ml-4 ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <select
              value={month}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none transition-all font-semibold ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500 focus:bg-zinc-800" : "border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/5"}`}
            >
              {t.months.map((m: string, i: number) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
              <svg
                className="h-4 w-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              value={year}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all font-semibold ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500 focus:bg-zinc-800" : "border-zinc-200 bg-zinc-50/50 text-zinc-900 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/5"}`}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <h2
              className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.15em] ${isDark ? "text-indigo-400" : "text-indigo-500"}`}
            >
              <div
                className={`p-1.5 rounded-lg ${isDark ? "bg-indigo-500/10" : "bg-indigo-50"}`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              </div>
              {t.dataSource}
            </h2>
            <div
              className={`h-px flex-1 ml-4 ${isDark ? "border-zinc-800 bg-zinc-800" : "border-zinc-100 bg-zinc-100"}`}
            ></div>
          </div>

          <div
            className={`flex rounded-2xl p-1.5 transition-all ${isDark ? "bg-zinc-900/60 border border-zinc-800" : "bg-zinc-100/50 border border-zinc-100 shadow-inner"}`}
          >
            <button
              onClick={() => {
                setDataSource("notion");
                setIsAutoPopup(true);
                setShowSetupHelp(true);
                setShowNotepadHelp(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-300 ${dataSource === "notion" ? (isDark ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)] scale-[1.02]" : "bg-white text-blue-600 shadow-md border border-zinc-100 scale-[1.02]") : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
            >
              <svg
                className={`h-4 w-4 transition-transform ${dataSource === "notion" ? "scale-110" : "scale-100"}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.254 2.1c-.42-.327-.98-.513-1.64-.466l-12.8.887c-.467.047-.56.28-.374.466l.979 1.22zm.793 2.754v13.86c0 .747.373 1.027 1.213.98l14.523-.84c.84-.046.933-.56.933-1.166V5.95c0-.607-.234-.934-.747-.887L6.432 5.94c-.56.047-.84.327-.84.887v1.134zm14.337.467c.093.42 0 .84-.42.887l-.7.14v10.26c-.607.326-1.167.513-1.634.513-.747 0-.933-.233-1.493-.933l-4.57-7.18v6.953l1.447.327s0 .84-1.167.84l-3.22.187c-.093-.187 0-.653.327-.747l.84-.213V8.542l-1.167-.093c-.093-.42.14-1.027.793-1.073l3.454-.234 4.757 7.274V8.076l-1.213-.14c-.093-.513.28-.887.747-.933l3.22-.187z" />
              </svg>
              {t.dataSourceNotion}
            </button>
            <button
              onClick={() => {
                setDataSource("notepad");
                setIsAutoPopup(true);
                setShowNotepadHelp(true);
                setShowSetupHelp(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-300 ${dataSource === "notepad" ? (isDark ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] scale-[1.02]" : "bg-white text-emerald-600 shadow-md border border-zinc-100 scale-[1.02]") : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
            >
              <svg
                className={`h-4 w-4 transition-transform ${dataSource === "notepad" ? "scale-110" : "scale-100"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t.dataSourceNotepad}
            </button>
          </div>

          {/* Notion Mode */}
          {dataSource === "notion" && (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between group/label">
                <h2
                  className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {t.notionTarget}
                </h2>
                <button
                  onClick={() => {
                    setIsAutoPopup(false);
                    setShowSetupHelp(true);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${isDark ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t.howToGetApiKey}
                </button>
              </div>

              <div className="relative group">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={notionApiKey}
                  onChange={(e) => {
                    setNotionApiKey(e.target.value);
                    localStorage.setItem(
                      "timesheet_notionApiKey",
                      e.target.value,
                    );
                  }}
                  placeholder={t.apiKeyPlaceholder}
                  className={`w-full rounded-xl border pl-4 pr-12 py-3 text-sm outline-none transition-all placeholder:text-zinc-500 font-medium ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500 focus:bg-zinc-800" : "border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 shadow-sm"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className={`absolute inset-y-0 right-0 flex items-center px-4 transition-colors ${isDark ? "text-zinc-500 hover:text-blue-400" : "text-zinc-400 hover:text-blue-500"}`}
                  title={showApiKey ? "Hide API Key" : "Show API Key"}
                >
                  {showApiKey ? (
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex gap-2.5">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    ref={pageIdRef as any}
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    placeholder={t.pageIdStr}
                    className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-500 font-medium ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500 focus:bg-zinc-800" : "border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 shadow-sm"} ${shakingFields.includes(t.notionTarget) ? "animate-shake ring-2 ring-red-500 border-red-500" : ""}`}
                  />
                </div>
                <button
                  onClick={searchPages}
                  disabled={searching || !notionApiKey}
                  className={`shrink-0 whitespace-nowrap rounded-xl px-6 py-3 text-xs font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${isDark ? "bg-zinc-800 border border-zinc-700 hover:border-blue-500/50 text-zinc-100" : "bg-white border border-zinc-200 hover:border-blue-400 text-zinc-700"}`}
                >
                  {searching ? (
                    <div className="flex items-center gap-2">
                      <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t.searching}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      {t.search}
                    </div>
                  )}
                </button>
              </div>

              {pages.length > 0 && (
                <div
                  className={`overflow-hidden rounded-2xl border transition-all animate-in slide-in-from-top-2 duration-300 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-100 bg-zinc-50/50"}`}
                >
                  <div className="max-h-48 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setPageId(page.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${pageId === page.id ? (isDark ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "bg-white text-blue-600 shadow-sm border border-blue-100 font-bold") : isDark ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" : "text-zinc-500 hover:bg-white hover:text-zinc-900 hover:shadow-sm"}`}
                      >
                        <span className="text-sm truncate pr-4">
                          {page.title}
                        </span>
                        {pageId === page.id && (
                          <svg
                            className="h-4 w-4 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notepad Mode */}
          {dataSource === "notepad" && (
            <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between group/label">
                <h2
                  className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {t.notepadTarget}
                </h2>
                <button
                  onClick={() => {
                    setIsAutoPopup(false);
                    setShowNotepadHelp(true);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${isDark ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t.hnTitle}
                </button>
              </div>

              <div
                className={`rounded-2xl border p-4 ${isDark ? "bg-zinc-800/30 border-zinc-800/50" : "bg-zinc-50 border-zinc-100"}`}
              >
                <p
                  className={`text-[11px] leading-relaxed mb-4 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  {t.notepadDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const daysIndo = [
                      "minggu",
                      "senin",
                      "selasa",
                      "rabu",
                      "kamis",
                      "jumat",
                      "sabtu",
                    ];
                    let content = `Timesheet Period: ${t.months[month - 1]} ${year}\n\n`;
                    const daysInMonth = new Date(year, month, 0).getDate();
                    for (let d = 1; d <= daysInMonth; d++) {
                      const date = new Date(year, month - 1, d);
                      const dayOfWeek = date.getDay();
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                      // Include all days, but mark weekends differently if needed.
                      // For simplicity, we just list every day so the user can fill any of them.
                      content += `${d}/${daysIndo[dayOfWeek]}\t\n`;
                      if (!isWeekend) {
                        content += `1. \n2. \n3. \n`;
                      }
                      content += `\n`;
                    }
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `Timesheet-${t.months[month - 1]}-${year}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className={`flex w-full items-center justify-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-bold transition-all ${isDark ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-emerald-200 bg-white text-emerald-600 shadow-sm hover:bg-emerald-50 hover:border-emerald-300"}`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t.downloadTemplate}
                </button>
              </div>

              <div className="space-y-3">
                <label
                  className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {t.uploadNotepad}
                </label>
                <div className="flex gap-2.5 items-center">
                  <div
                    className={`flex-1 min-w-0 rounded-xl border px-4 py-3 text-xs truncate font-medium ${csvData ? (isDark ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700") : isDark ? "border-zinc-700 bg-zinc-800/40 text-zinc-500" : "border-zinc-200 bg-zinc-50 text-zinc-400"}`}
                  >
                    {csvFileName || t.uploadNotepadPlaceholder}
                  </div>
                  <label
                    className={`shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-6 py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${isDark ? "bg-emerald-600 hover:bg-emerald-500" : "bg-emerald-500 hover:bg-emerald-600"} ${shakingFields.includes(t.notepadTarget) ? "animate-shake ring-4 ring-red-500 bg-red-600" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      {t.choose}
                    </div>
                    <input
                      type="file"
                      ref={csvInputRef as any}
                      accept=".txt"
                      onChange={handleCsvUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {csvData && (
                  <button
                    onClick={() => {
                      setCsvData(null);
                      setCsvFileName("");
                      if (csvInputRef.current) csvInputRef.current.value = "";
                    }}
                    className="flex items-center gap-1.5 text-[10px] text-rose-400 hover:text-rose-300 font-bold transition ml-1"
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {t.removeFile}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
