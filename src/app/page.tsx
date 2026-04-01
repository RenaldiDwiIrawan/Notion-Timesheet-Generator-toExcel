"use client";

import { useState, useEffect, useRef } from "react";
import WelcomeGuideModal from "../components/modals/WelcomeGuideModal";
import NotepadHelpModal from "../components/modals/NotepadHelpModal";
import SetupHelpModal from "../components/modals/SetupHelpModal";
import Header from "../components/sections/Header";
import SignatureSection from "../components/sections/SignatureSection";
import ConfigurationSection from "../components/sections/ConfigurationSection";
import StorageSection from "../components/sections/StorageSection";


import { translations } from "../utils/translations";
import { NotionPage } from "../types";

export default function Home() {
  const now = new Date();
  const [lang, setLang] = useState<"ENG" | "ID">("ENG");
  const [isDark, setIsDark] = useState(true);
  const t = translations[lang];

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [pageId, setPageId] = useState("");
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [notionApiKey, setNotionApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Data source mode
  const [dataSource, setDataSource] = useState<"notion" | "notepad">("notion");
  const [csvData, setCsvData] = useState<string | null>(null);
  const [csvFileName, setCsvFileName] = useState("");
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Signature fields state
  const getLastDayStr = (y: number, m: number) => {
    return new Date(y, m, 0).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTodayStr = () => {
    return new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [submitterName, setSubmitterName] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [submitterDate, setSubmitterDate] = useState(
    getLastDayStr(year, month),
  );
  const [submitterSignature, setSubmitterSignature] = useState<string | null>(
    null,
  );
  const [approverName, setApproverName] = useState("");
  const [approverDate, setApproverDate] = useState(getLastDayStr(year, month));

  const [outputFilenameFormat, setOutputFilenameFormat] = useState("");

  const [showSetupHelp, setShowSetupHelp] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [isAutoGuide, setIsAutoGuide] = useState(false);
  const [showNotepadHelp, setShowNotepadHelp] = useState(false);
  const [isAutoPopup, setIsAutoPopup] = useState(false);
  const signatureRef = useRef<HTMLInputElement>(null);

  // Refs for focusing on validation failure
  const submitterNameRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const approverNameRef = useRef<HTMLInputElement>(null);
  const submitterDateRef = useRef<HTMLInputElement>(null);
  const approverDateRef = useRef<HTMLInputElement>(null);
  const outputFilenameFormatRef = useRef<HTMLInputElement>(null);
  const pageIdRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const templateBtnRef = useRef<HTMLButtonElement>(null);

  const [shakingFields, setShakingFields] = useState<string[]>([]);

  const triggerShake = (fieldLabels: string[]) => {
    setShakingFields(fieldLabels);
    setTimeout(() => setShakingFields([]), 1000);
  };

  const [useCustomTemplate, setUseCustomTemplate] = useState(false);
  const [customTemplateData, setCustomTemplateData] = useState<string | null>(
    null,
  );
  const [customTemplateName, setCustomTemplateName] = useState("");

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomTemplateData(reader.result as string);
        setCustomTemplateName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom status
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Load saved configurations
  useEffect(() => {
    const savedLang = localStorage.getItem("timesheet_lang") as "ENG" | "ID";
    if (savedLang) setLang(savedLang);

    const savedTheme = localStorage.getItem("timesheet_theme");
    if (savedTheme) setIsDark(savedTheme === "dark");

    const savedSubmitterName = localStorage.getItem("timesheet_submitterName");
    if (savedSubmitterName) setSubmitterName(savedSubmitterName);

    const savedFullName = localStorage.getItem("timesheet_fullName");
    if (savedFullName) setFullName(savedFullName);

    const savedRole = localStorage.getItem("timesheet_role");
    if (savedRole) setRole(savedRole);

    const savedApproverName = localStorage.getItem("timesheet_approverName");
    if (savedApproverName) setApproverName(savedApproverName);

    const savedNotionApiKey = localStorage.getItem("timesheet_notionApiKey");
    if (savedNotionApiKey) setNotionApiKey(savedNotionApiKey);

    const savedOutputFilenameFormat = localStorage.getItem(
      "timesheet_outputFilenameFormat",
    );
    if (savedOutputFilenameFormat)
      setOutputFilenameFormat(savedOutputFilenameFormat);

    setShowWelcomeGuide(true);
    setIsAutoGuide(true);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (
      (isAutoGuide && showWelcomeGuide) ||
      (isAutoPopup && (showSetupHelp || showNotepadHelp))
    ) {
      timer = setTimeout(() => {
        setShowWelcomeGuide(false);
        setIsAutoGuide(false);
        setShowSetupHelp(false);
        setShowNotepadHelp(false);
        setIsAutoPopup(false);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [
    showWelcomeGuide,
    isAutoGuide,
    showSetupHelp,
    showNotepadHelp,
    isAutoPopup,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowWelcomeGuide(false);
        setShowSetupHelp(false);
        setShowNotepadHelp(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCsvData(reader.result as string);
        setCsvFileName(file.name);
        setStatus({ type: "success", message: t.notepadUploaded });
        setTimeout(() => setStatus(null), 3000);
      };
      reader.onerror = () => {
        setStatus({ type: "error", message: t.notepadUploadError });
      };
      reader.readAsText(file);
    }
  };

  const searchPages = async () => {
    setSearching(true);
    setStatus(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (notionApiKey) headers["x-notion-api-key"] = notionApiKey;
      const res = await fetch("/api/notion-pages", { headers });
      const data = await res.json();
      if (data.error) {
        setStatus({ type: "error", message: data.error });
        return;
      }
      setPages(data.pages);
      if (data.pages.length === 0) {
        setStatus({ type: "info", message: t.noPagesFound });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to connect to Notion." });
    } finally {
      setSearching(false);
    }
  };

  const generate = async () => {
    const missingFields: { label: string; ref: React.RefObject<any> }[] = [];
    if (dataSource === "notion" && !pageId)
      missingFields.push({ label: t.notionTarget, ref: pageIdRef });
    if (dataSource === "notepad" && !csvData)
      missingFields.push({ label: t.notepadTarget, ref: csvInputRef });
    if (!fullName.trim())
      missingFields.push({ label: t.fullName, ref: fullNameRef });
    if (!role.trim())
      missingFields.push({ label: t.role, ref: roleRef });
    if (!submitterName.trim())
      missingFields.push({ label: t.fieldSubmitterName, ref: submitterNameRef });
    if (!submitterDate.trim())
      missingFields.push({ label: t.fieldSubmitterDate, ref: submitterDateRef });
    if (!approverName.trim())
      missingFields.push({ label: t.fieldApproverName, ref: approverNameRef });
    if (!approverDate.trim())
      missingFields.push({ label: t.fieldApproverDate, ref: approverDateRef });
    if (!outputFilenameFormat.trim())
      missingFields.push({ label: t.fieldFileNameFormat, ref: outputFilenameFormatRef });
    if (useCustomTemplate && !customTemplateData)
      missingFields.push({ label: t.fieldTemplatePath, ref: templateBtnRef });

    if (missingFields.length > 0) {
      const fieldList = missingFields.map((f) => `- ${f.label}`).join("\n");
      setStatus({
        type: "error",
        message: (t as any).validationError.replace("{fields}", fieldList),
      });

      // Trigger shake animation
      triggerShake(missingFields.map((f) => f.label));

      // Focus the first missing field
      if (missingFields[0].ref.current) {
        if (missingFields[0].ref === csvInputRef) {
          // Special case for hidden file input: maybe trigger click or focus the label
          missingFields[0].ref.current.focus();
        } else {
          missingFields[0].ref.current.focus();
          missingFields[0].ref.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
      return;
    }

    setLoading(true);
    setStatus({
      type: "info",
      message: dataSource === "notion" ? t.fetchingMsg : t.processingMsg,
    });

    try {
      const endpoint =
        dataSource === "notion" ? "/api/generate" : "/api/generate-from-file";
      const payload =
        dataSource === "notion"
          ? {
              pageId,
              year,
              month,
              submitterName,
              submitterDate,
              submitterSignature,
              approverName,
              approverDate,
              fullName,
              role,
              templateData: useCustomTemplate ? customTemplateData : null,
              outputFilenameFormat,
              notionApiKey,
            }
          : {
              notepadData: csvData,
              year,
              month,
              submitterName,
              submitterDate,
              submitterSignature,
              approverName,
              approverDate,
              fullName,
              role,
              templateData: useCustomTemplate ? customTemplateData : null,
              outputFilenameFormat,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setStatus({ type: "error", message: err.error });
        return;
      }

      const disposition = res.headers.get("Content-Disposition");
      let downloadFilename = `timesheet.xlsx`;
      if (disposition && disposition.includes('filename="')) {
        downloadFilename = disposition.split('filename="')[1].split('"')[0];
      }

      const blob = await res.blob();

      // Always fallback to normal browser download as requested
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({
        type: "success",
        message: (t as any).genSuccessBrowser,
      });
    } catch {
      setStatus({ type: "error", message: t.genFailed });
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = lang === "ENG" ? "ID" : "ENG";
    const oldDefault = translations[lang].defaultFormat;
    if (outputFilenameFormat === oldDefault) {
      setOutputFilenameFormat(translations[newLang].defaultFormat);
    }
    setLang(newLang);
    localStorage.setItem("timesheet_lang", newLang);
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("timesheet_theme", newDark ? "dark" : "light");
  };

  const handleClearData = () => {
    if (!confirm(t.resetData + "?")) return;
    const keysToRemove = [
      "timesheet_submitterName",
      "timesheet_fullName",
      "timesheet_role",
      "timesheet_approverName",
      "timesheet_notionApiKey",
      "timesheet_outputFilenameFormat",
      "timesheet_useCustomTemplate",
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    setNotionApiKey("");
    setPageId("");
    setPages([]);
    setFullName("");
    setRole("");
    setSubmitterName("");
    setSubmitterSignature(null);
    setApproverName("");
    if (signatureRef.current) signatureRef.current.value = "";
    setCsvData(null);
    setCsvFileName("");
    if (csvInputRef.current) csvInputRef.current.value = "";
    setUseCustomTemplate(false);
    setCustomTemplateData(null);
    setCustomTemplateName("");
    setOutputFilenameFormat("");
    setStatus({ type: "success", message: t.resetData + " ✔️" });
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center transition-colors duration-500 p-4 font-sans ${isDark ? "bg-zinc-950 text-zinc-100" : "bg-slate-50 text-zinc-900"}`}
    >
      <main
        className={`w-full max-w-5xl rounded-3xl border p-5 sm:p-8 shadow-2xl transition-all relative overflow-hidden ${isDark ? "bg-zinc-900/40 border-zinc-800 backdrop-blur-xl" : "bg-white border-zinc-200"}`}
      >
        <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>

        <div className="relative z-10">
          <Header
            t={t}
            isDark={isDark}
            lang={lang}
            toggleLanguage={toggleLanguage}
            toggleTheme={toggleTheme}
            setShowWelcomeGuide={setShowWelcomeGuide}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
            {/* Left Column: Configuration */}
            <ConfigurationSection
              t={t}
              isDark={isDark}
              month={month}
              handleMonthChange={handleMonthChange}
              year={year}
              handleYearChange={handleYearChange}
              dataSource={dataSource}
              setDataSource={setDataSource}
              setIsAutoPopup={setIsAutoPopup}
              setShowSetupHelp={setShowSetupHelp}
              setShowNotepadHelp={setShowNotepadHelp}
              notionApiKey={notionApiKey}
              setNotionApiKey={setNotionApiKey}
              showApiKey={showApiKey}
              setShowApiKey={setShowApiKey}
              pageId={pageId}
              setPageId={setPageId}
              pageIdRef={pageIdRef}
              searchPages={searchPages}
              searching={searching}
              pages={pages}
              csvData={csvData}
              setCsvData={setCsvData}
              csvFileName={csvFileName}
              setCsvFileName={setCsvFileName}
              handleCsvUpload={handleCsvUpload}
              csvInputRef={csvInputRef}
              shakingFields={shakingFields}
              fullName={fullName}
              role={role}
            />

            {/* Right Column: Storage */}
            <StorageSection
              t={t}
              isDark={isDark}
              useCustomTemplate={useCustomTemplate}
              setUseCustomTemplate={setUseCustomTemplate}
              customTemplateName={customTemplateName}
              handleTemplateUpload={handleTemplateUpload}
              templateInputRef={templateInputRef}
              templateBtnRef={templateBtnRef}
              outputFilenameFormat={outputFilenameFormat}
              setOutputFilenameFormat={setOutputFilenameFormat}
              outputFilenameFormatRef={outputFilenameFormatRef}
              shakingFields={shakingFields}
            />
          </div>

          <SignatureSection
            t={t}
            isDark={isDark}
            fullName={fullName}
            setFullName={(val) => {
              setFullName(val);
              localStorage.setItem("timesheet_fullName", val);
            }}
            fullNameRef={fullNameRef}
            role={role}
            setRole={(val) => {
              setRole(val);
              localStorage.setItem("timesheet_role", val);
            }}
            roleRef={roleRef}
            submitterName={submitterName}
            setSubmitterName={(val) => {
              setSubmitterName(val);
              localStorage.setItem("timesheet_submitterName", val);
            }}
            submitterNameRef={submitterNameRef}
            submitterDate={submitterDate}
            setSubmitterDate={setSubmitterDate}
            approverName={approverName}
            setApproverName={(val) => {
              setApproverName(val);
              localStorage.setItem("timesheet_approverName", val);
            }}
            approverNameRef={approverNameRef}
            submitterDateRef={submitterDateRef}
            approverDateRef={approverDateRef}
            approverDate={approverDate}
            setApproverDate={setApproverDate}
            submitterSignature={submitterSignature}
            setSubmitterSignature={setSubmitterSignature}
            signatureRef={signatureRef}
            handleSignatureUpload={handleSignatureUpload}
            year={year}
            month={month}
            getTodayStr={getTodayStr}
            getLastDayStr={getLastDayStr}
            shakingFields={shakingFields}
          />

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleClearData}
              title={t.resetData}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-sm font-bold tracking-wide transition-all shadow-sm ${isDark ? "border-red-900/50 bg-red-900/10 text-red-500 hover:bg-red-900/20 hover:text-red-400" : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 shadow-sm"}`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="hidden sm:inline">{t.resetData}</span>
            </button>
            <button
              onClick={generate}
              disabled={loading}
              className={`flex-1 block rounded-2xl px-4 py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all hover:scale-[1.01] disabled:pointer-events-none disabled:opacity-50 ${isDark ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:shadow-blue-500/30" : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-400/30 hover:shadow-blue-400/50"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                  {t.generating}
                </span>
              ) : (
                t.generateBtn
              )}
            </button>
          </div>

          {status && (
            <div
              className={`mt-5 rounded-xl p-4 text-sm font-medium flex items-center gap-3 backdrop-blur-sm shadow-inner
              ${
                status.type === "success"
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : status.type === "error"
                    ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
              }`}
            >
              <div className="flex-1 text-xs">
                {status.message.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          )}

          <div
            className={`mt-8 flex items-center justify-center text-[10px] font-bold tracking-widest ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
          >
            {t.craftedBy}{" "}
            <strong
              className={`${isDark ? "text-zinc-300" : "text-zinc-600"} ml-1`}
            >
              RENN
            </strong>
          </div>
        </div>
      </main>

      {/* Modals extracted to components */}
      <WelcomeGuideModal
        show={showWelcomeGuide}
        onClose={() => setShowWelcomeGuide(false)}
        t={t}
        isDark={isDark}
      />

      <NotepadHelpModal
        show={showNotepadHelp}
        onClose={() => setShowNotepadHelp(false)}
        t={t}
      />

      <SetupHelpModal
        show={showSetupHelp}
        onClose={() => {
          setIsAutoPopup(false);
          setShowSetupHelp(false);
        }}
        t={t}
      />
    </div>
  );
}
