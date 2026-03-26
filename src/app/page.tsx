"use client";

import { useState, useEffect } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface NotionPage {
  id: string;
  title: string;
}

interface FSEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

export default function Home() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [pageId, setPageId] = useState("");
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [notionApiKey, setNotionApiKey] = useState("");

  // Signature fields state
  const getLastDayStr = (y: number, m: number) => {
    return new Date(y, m, 0).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  const getTodayStr = () => {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  const [submitterName, setSubmitterName] = useState("");
  const [submitterDate, setSubmitterDate] = useState(getLastDayStr(year, month));
  const [submitterSignature, setSubmitterSignature] = useState<string | null>(null);
  const [approverName, setApproverName] = useState("");
  const [approverDate, setApproverDate] = useState(getLastDayStr(year, month));

  const [templatePath, setTemplatePath] = useState("");
  const [outputDir, setOutputDir] = useState("");
  const [outputFilenameFormat, setOutputFilenameFormat] = useState("{YOUR-VENDOR}_{YOUR-NAME}_TIMESHEET_{MM}_{YYYY}");

  // File Browser State
  const [fsOpen, setFsOpen] = useState(false);
  const [fsMode, setFsMode] = useState<"file" | "directory" | null>(null);
  const [fsPath, setFsPath] = useState("/");
  const [fsEntries, setFsEntries] = useState<FSEntry[]>([]);
  const [fsLoading, setFsLoading] = useState(false);

  const [showSetupHelp, setShowSetupHelp] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);

  // Custom status
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string; } | null>(null);

  // Load saved configurations
  useEffect(() => {
    const savedSubmitterName = localStorage.getItem("timesheet_submitterName");
    if (savedSubmitterName) setSubmitterName(savedSubmitterName);

    const savedApproverName = localStorage.getItem("timesheet_approverName");
    if (savedApproverName) setApproverName(savedApproverName);

    const savedNotionApiKey = localStorage.getItem("timesheet_notionApiKey");
    if (savedNotionApiKey) setNotionApiKey(savedNotionApiKey);

    const savedTemplatePath = localStorage.getItem("timesheet_templatePath");
    if (savedTemplatePath) setTemplatePath(savedTemplatePath);

    const savedOutputDir = localStorage.getItem("timesheet_outputDir");
    if (savedOutputDir) setOutputDir(savedOutputDir);

    const savedOutputFilenameFormat = localStorage.getItem("timesheet_outputFilenameFormat");
    if (savedOutputFilenameFormat) setOutputFilenameFormat(savedOutputFilenameFormat);

    // Show guide on open/refresh
    setShowWelcomeGuide(true);
  }, []);

  const handleMonthChange = (newMonth: number) => {
    const oldLastDay = getLastDayStr(year, month);
    setMonth(newMonth);
    const newLastDay = getLastDayStr(year, newMonth);
    if (submitterDate === oldLastDay) setSubmitterDate(newLastDay);
    if (approverDate === oldLastDay) setApproverDate(newLastDay);
  };

  const handleYearChange = (newYear: number) => {
    const oldLastDay = getLastDayStr(year, month);
    setYear(newYear);
    const newLastDay = getLastDayStr(newYear, month);
    if (submitterDate === oldLastDay) setSubmitterDate(newLastDay);
    if (approverDate === oldLastDay) setApproverDate(newLastDay);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSubmitterSignature(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getIconForFile = (name: string, isDirectory: boolean) => {
    if (isDirectory) return "📁";
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) return "📊";
    return "📄";
  };

  const openFileBrowser = (mode: "file" | "directory") => {
    setFsMode(mode);
    setFsOpen(true);
    let startPath = "/";
    if (mode === "file" && templatePath) startPath = templatePath.substring(0, templatePath.lastIndexOf('/')) || "/";
    if (mode === "directory" && outputDir) startPath = outputDir;

    loadDir(startPath);
  };

  const loadDir = async (pathStr: string) => {
    setFsLoading(true);
    try {
      const res = await fetch(`/api/fs?path=${encodeURIComponent(pathStr)}`);
      const data = await res.json();
      if (data.error) throw new Error();
      setFsPath(data.currentPath);

      const files = data.files;
      // Filter out non-xlsx if we are in file mode, except directories
      const filtered = fsMode === "file"
        ? files.filter((f: any) => f.isDirectory || f.name.endsWith(".xlsx"))
        : files;

      if (data.parent) {
        setFsEntries([{ name: "..", path: data.parent, isDirectory: true }, ...filtered]);
      } else {
        setFsEntries(filtered);
      }
    } catch {
      setStatus({ type: "error", message: "Failed to read directory." });
    } finally {
      setFsLoading(false);
    }
  };

  const confirmFileBrowserSelection = (pathStr: string) => {
    if (fsMode === "file") {
      setTemplatePath(pathStr);
      localStorage.setItem("timesheet_templatePath", pathStr);
    } else {
      setOutputDir(pathStr);
      localStorage.setItem("timesheet_outputDir", pathStr);
    }
    setFsOpen(false);
  };

  const searchPages = async () => {
    setSearching(true);
    setStatus(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (notionApiKey) headers["x-notion-api-key"] = notionApiKey;
      const res = await fetch("/api/notion-pages", { headers });
      const data = await res.json();
      if (data.error) {
        setStatus({ type: "error", message: data.error });
        return;
      }
      setPages(data.pages);
      if (data.pages.length === 0) {
        setStatus({ type: "info", message: 'No timesheet pages found.' });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to connect to Notion." });
    } finally {
      setSearching(false);
    }
  };

  const generate = async () => {
    if (!pageId) {
      setStatus({ type: "error", message: "Please select a Notion page." });
      return;
    }
    setLoading(true);
    setStatus({ type: "info", message: "Fetching & generating..." });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId, year, month,
          submitterName, submitterDate, submitterSignature,
          approverName, approverDate,
          templatePath, outputDir, outputFilenameFormat,
          notionApiKey
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setStatus({ type: "error", message: err.error });
        return;
      }

      const savedPath = res.headers.get("X-Saved-Path");
      const disposition = res.headers.get("Content-Disposition");
      let downloadFilename = `timesheet.xlsx`;
      if (disposition && disposition.includes('filename="')) {
        downloadFilename = disposition.split('filename="')[1].split('"')[0];
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      a.click();
      URL.revokeObjectURL(url);

      setStatus({
        type: "success",
        message: `Generated! ${savedPath ? `Saved to: ${savedPath}` : "Downloaded."}`,
      });
      setSubmitterSignature(null);
    } catch {
      setStatus({ type: "error", message: "Generation failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 bg-gradient-to-br from-zinc-950 via-gray-900 to-black p-4 text-zinc-100 font-sans">
      <main className="w-full max-w-4xl rounded-3xl bg-zinc-900/40 border border-zinc-800 p-8 shadow-2xl backdrop-blur-xl transition-all relative overflow-hidden">

        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Timesheet Generator
              </h1>
              <p className="text-sm font-medium text-zinc-400">
                Seamlessly convert your Notion entries into professional Excel timesheets.
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeGuide(true)}
              className="flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-700/50"
            >
              <span>💡</span> Panduan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/80 shadow-inner">

            {/* Period Selection */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Period</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => handleMonthChange(Number(e.target.value))}
                    className="w-full appearance-none rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  >
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm text-zinc-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              {/* Data Source */}
              <div className="pt-2">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notion Target</h2>
                  <button onClick={() => setShowSetupHelp(true)} className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-400 transition hover:bg-blue-500/20 hover:text-blue-300">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    How to Setup
                  </button>
                </div>

                <div className="mb-3">
                  <label className="mb-1 block text-[11px] font-medium text-zinc-400">API Key Override (Optional)</label>
                  <input
                    type="password"
                    value={notionApiKey}
                    onChange={(e) => {
                      setNotionApiKey(e.target.value);
                      localStorage.setItem("timesheet_notionApiKey", e.target.value);
                    }}
                    placeholder="Notion API Key"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-blue-500 transition-all placeholder:text-zinc-500"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value)}
                    placeholder="Page ID"
                    className="flex-1 min-w-0 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm text-zinc-200 outline-none focus:border-blue-500 transition-all placeholder:text-zinc-500"
                  />
                  <button
                    onClick={searchPages}
                    disabled={searching}
                    className="rounded-xl bg-zinc-700/80 hover:bg-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-100 transition shadow-sm"
                  >
                    {searching ? "..." : "Search"}
                  </button>
                </div>

                {pages.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-1">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setPageId(page.id)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${pageId === page.id ? "bg-blue-500/20 text-blue-300" : "text-zinc-300 hover:bg-zinc-700/50"
                          }`}
                      >
                        <span className="font-semibold block truncate">{page.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Storage / Path Setings */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">File Storage</h2>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-zinc-400">Excel Template</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    type="text"
                    value={templatePath}
                    placeholder="Select Excel template file..."
                    className="flex-1 min-w-0 rounded-xl border border-zinc-700 bg-zinc-800/40 px-3 py-2 text-xs text-zinc-300 outline-none"
                  />
                  <button
                    onClick={() => openFileBrowser("file")}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition"
                  >
                    Choose...
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-zinc-400">Output Directory</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    type="text"
                    value={outputDir}
                    placeholder="Select output location..."
                    className="flex-1 min-w-0 rounded-xl border border-zinc-700 bg-zinc-800/40 px-3 py-2 text-xs text-zinc-300 outline-none"
                  />
                  <button
                    onClick={() => openFileBrowser("directory")}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition"
                  >
                    Choose...
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-zinc-400">File Name Format</label>
                <input
                  type="text"
                  value={outputFilenameFormat}
                  onChange={(e) => {
                    setOutputFilenameFormat(e.target.value);
                    localStorage.setItem("timesheet_outputFilenameFormat", e.target.value);
                  }}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-blue-500 focus:bg-zinc-800"
                />
              </div>

            </div>
          </div>

          {/* Signatures */}
          <div className="mt-6 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/80 shadow-inner relative overflow-hidden">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Signatures</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Submitted By</label>
                  <input
                    type="text"
                    value={submitterName}
                    placeholder="Your Name"
                    onChange={(e) => { setSubmitterName(e.target.value); localStorage.setItem("timesheet_submitterName", e.target.value); }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-400">Date</label>
                    <button onClick={() => setSubmitterDate(getLastDayStr(year, month))} className="text-[10px] text-blue-400 hover:text-blue-300">Set End of Month</button>
                  </div>
                  <input
                    type="text"
                    value={submitterDate}
                    onChange={(e) => setSubmitterDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Approved By</label>
                  <input
                    type="text"
                    value={approverName}
                    placeholder="Buddy Name"
                    onChange={(e) => { setApproverName(e.target.value); localStorage.setItem("timesheet_approverName", e.target.value); }}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-400">Date</label>
                    <button onClick={() => setApproverDate(getLastDayStr(year, month))} className="text-[10px] text-blue-400 hover:text-blue-300">Set End of Month</button>
                  </div>
                  <input
                    type="text"
                    value={approverDate}
                    onChange={(e) => setApproverDate(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-800/80 pt-4">
              <label className="mb-2 block text-xs font-medium text-zinc-400">Digital Signature (Optional Image)</label>
              <div className="flex items-center gap-4">
                <input
                  id="signature-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleSignatureUpload}
                  className="text-xs text-zinc-400 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-zinc-700 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-zinc-200 hover:file:bg-zinc-600 transition"
                />
                {submitterSignature && (
                  <div className="flex items-center gap-3 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={submitterSignature} alt="Signature" className="h-6 w-auto object-contain bg-white/10 rounded px-1" />
                    <button onClick={() => setSubmitterSignature(null)} className="text-xs text-red-400 hover:text-red-300 font-semibold p-1">✕</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || !pageId}
            className="mt-8 w-full block rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] hover:shadow-blue-500/30 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                GENERATING TIMESHEET...
              </span>
            ) : "GENERATE EXCEL"}
          </button>

          {status && (
            <div className={`mt-5 rounded-xl p-4 text-sm font-medium flex items-center gap-3 backdrop-blur-sm shadow-inner
              ${status.type === "success" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" :
                status.type === "error" ? "bg-rose-500/10 text-rose-300 border border-rose-500/20" :
                  "bg-blue-500/10 text-blue-300 border border-blue-500/20"}`}>
              <div className="flex-1">{status.message}</div>
            </div>
          )}

          <div className="mt-8 text-center text-xs font-medium tracking-wider text-zinc-500">
            CRAFTED BY <strong className="text-zinc-300">RENN</strong>
          </div>
        </div>
      </main>

      {/* Usage Guide Modal */}
      {showWelcomeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 animate-in fade-in zoom-in duration-300">
          <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="flex items-start justify-between border-b border-zinc-800/50 bg-zinc-950 p-6">
              <div>
                <h3 className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-xl font-bold text-transparent">
                  Panduan Penggunaan
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Selamat datang di Notion Timesheet Generator</p>
              </div>
              <button onClick={() => setShowWelcomeGuide(false)} className="rounded-full bg-zinc-800/50 p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white">✕</button>
            </div>

            <div className="space-y-6 overflow-y-auto bg-zinc-900/80 p-6 max-h-[60vh]">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">🗓️</div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">1. Period Selection</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">Pilih <strong className="text-zinc-300">Bulan</strong> dan <strong className="text-zinc-300">Tahun</strong> untuk timesheet. Ini akan otomatis menentukan jumlah hari dalam dokumen Excel Anda.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">🎯</div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">2. Hubungkan ke Notion</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">Masukkan <strong>API Key</strong> Notion rahasia Anda ke dalam kolom yang tersedia (klik <em>How to Setup</em> jika Anda belum punya). Selanjutnya, masukkan <strong className="text-zinc-300">Page ID</strong> atau cukup tekan tombol <strong className="text-blue-400">Search</strong> untuk mencari halaman tabel kerja Anda secara otomatis.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">📁</div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">3. File Storage</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">Gunakan tombol <strong className="text-zinc-300">Choose...</strong> untuk menavigasi direktori lokal Anda dengan mulus:
                    <br />- <strong>Excel Template:</strong> Pilih file Excel kosong / polosan yang ingin diisi.
                    <br />- <strong>Output Directory:</strong> Folder tempat hasil generate akan langsung di-save otomatis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">✍️</div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">4. Signatures</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">Ketik nama <strong className="text-zinc-300">Submitter</strong> (Pembuat) & <strong className="text-zinc-300">Approver</strong> (Atasan). Anda bisa menggunakan tombol <strong className="text-blue-400">Set End of Month</strong> untuk otomatis set tanggal. Tersedia juga fitur unggah foto tanda tangan digital untuk dimasukkan langsung ke Excel!</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400">🚀</div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">5. Generate Excel</h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">Setelah semua terisi, tekan tombol Generate besar di paling bawah. File Excel final (lengkap dengan data dari Notion) akan langsung dibuat dan di-download!</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-800/50 bg-zinc-950/80 p-5">
              <button onClick={() => setShowWelcomeGuide(false)} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105">Start Generating!</button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showSetupHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col">
            <div className="bg-zinc-950 p-5 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                How to Connect Notion
              </h3>
              <button onClick={() => setShowSetupHelp(false)} className="text-zinc-500 hover:text-white transition">✕</button>
            </div>

            <div className="p-6 bg-zinc-900 overflow-y-auto">
              <ol className="list-decimal list-inside space-y-4 text-sm text-zinc-300">
                <li>Buka halaman <a href="https://www.notion.so/my-integrations" target="_blank" className="font-semibold text-blue-400 hover:underline">Notion Integrations</a> dan buat integrasi baru <em>(New integration)</em>.</li>
                <li>Salin <em>(Copy)</em> kode <strong className="text-zinc-100">Internal Integration Secret Token</strong> yang muncul.</li>
                <li className="leading-relaxed">Kembali ke aplikasi ini dan tempelkan <em>(Paste)</em> kode tersebut ke kolom <strong>API Key Override</strong>. <br />
                  <span className="text-[11px] text-zinc-500 mt-2 block italic">* Jangan khawatir, token ini hanya disimpan di memori/browser lokal Anda secara aman.</span>
                </li>
                <li>Buka Halaman/Database Notion tempat Anda biasa menulis jurnal/timesheet harian Anda.</li>
                <li>Klik tombol <code className="bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-700">...</code> di pojok kanan atas halaman Notion tersebut.</li>
                <li>Pilih <strong className="text-zinc-100">Add connections</strong> (Hubungkan ke), lalu ketik dan pilih nama integrasi yang baru saja Anda buat.</li>
                <li>Selesai! Sekarang tinggal klik tombol <strong>Search</strong> untuk memuat data Anda. Sangat mudah, kan?</li>
              </ol>
            </div>

            <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-end">
              <button onClick={() => setShowSetupHelp(false)} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition">Understood</button>
            </div>
          </div>
        </div>
      )}

      {/* Modern File System Browser Modal */}
      {fsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col h-[60vh] max-h-[600px]">
            <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {fsMode === "directory" ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                </svg>
                Select {fsMode === "directory" ? "Directory" : "Excel Template"}
              </h3>
              <button onClick={() => setFsOpen(false)} className="text-zinc-500 hover:text-white transition">✕</button>
            </div>

            <div className="bg-zinc-900 px-4 py-3 flex gap-2 border-b border-zinc-800 items-center">
              <span className="text-zinc-500 text-xs font-mono shrink-0">PATH</span>
              <div className="bg-zinc-950 rounded bg-opacity-50 px-3 py-1.5 flex-1 min-w-0 text-xs text-zinc-300 font-mono truncate border border-zinc-800/50">
                {fsPath}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-zinc-900 p-2">
              {fsLoading ? (
                <div className="flex justify-center p-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-t-blue-500 border-zinc-700"></div></div>
              ) : (
                <ul className="space-y-1">
                  {fsEntries.map((entry, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => entry.isDirectory ? loadDir(entry.path) : (fsMode === "file" && confirmFileBrowserSelection(entry.path))}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${!entry.isDirectory && fsMode === "directory" ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-800 cursor-pointer"
                          }`}
                        disabled={!entry.isDirectory && fsMode === "directory"}
                      >
                        <span className="text-lg leading-none">{getIconForFile(entry.name, entry.isDirectory)}</span>
                        <span className={`text-sm ${entry.isDirectory ? "text-blue-300 font-medium" : "text-zinc-300"}`}>{entry.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-end gap-3">
              <button onClick={() => setFsOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition">Cancel</button>
              {fsMode === "directory" && (
                <button
                  onClick={() => confirmFileBrowserSelection(fsPath)}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition"
                >
                  Select Current Folder
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
