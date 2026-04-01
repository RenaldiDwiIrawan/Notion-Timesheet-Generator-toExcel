import React from "react";

interface StorageSectionProps {
  t: any;
  isDark: boolean;
  useCustomTemplate: boolean;
  setUseCustomTemplate: (val: boolean) => void;
  customTemplateName: string;
  handleTemplateUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  templateInputRef: React.RefObject<HTMLInputElement | null>;
  templateBtnRef: React.RefObject<HTMLButtonElement | null>;
  directoryHandle: any;
  chooseDirectory: () => void;
  outputDirBtnRef: React.RefObject<HTMLButtonElement | null>;
  outputFilenameFormat: string;
  setOutputFilenameFormat: (val: string) => void;
  shakingFields: string[];
}

export default function StorageSection({
  t,
  isDark,
  useCustomTemplate,
  setUseCustomTemplate,
  customTemplateName,
  handleTemplateUpload,
  templateInputRef,
  templateBtnRef,
  directoryHandle,
  chooseDirectory,
  outputDirBtnRef,
  outputFilenameFormat,
  setOutputFilenameFormat,
  shakingFields,
}: StorageSectionProps) {
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
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            {t.fileStorage}
          </h2>
          <div
            className={`h-px flex-1 ml-4 ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}
          ></div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              {t.excelTemplate}
            </label>
            <div
              className={`flex gap-3 p-1 rounded-xl ${isDark ? "bg-zinc-900/50" : "bg-zinc-100/50"}`}
            >
              <button
                onClick={() => {
                  setUseCustomTemplate(false);
                  localStorage.setItem("timesheet_useCustomTemplate", "false");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!useCustomTemplate ? (isDark ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 shadow-sm") : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                {t.templateDefault}
              </button>
              <button
                onClick={() => {
                  setUseCustomTemplate(true);
                  localStorage.setItem("timesheet_useCustomTemplate", "true");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${useCustomTemplate ? (isDark ? "bg-blue-600 text-white shadow-lg" : "bg-white text-blue-600 shadow-sm") : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"}`}
              >
                {t.templateCustom}
              </button>
            </div>
            {useCustomTemplate && (
              <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                <div
                  className={`flex-1 flex items-center px-4 rounded-xl border text-xs truncate font-medium ${customTemplateName ? (isDark ? "border-blue-500/40 bg-blue-500/5 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-700") : isDark ? "border-zinc-700 bg-zinc-800/40 text-zinc-500" : "border-zinc-200 bg-zinc-50 text-zinc-400"}`}
                >
                  {customTemplateName || t.uploadTemplatePlaceholder}
                </div>
                <button
                  type="button"
                  onClick={() => templateInputRef.current?.click()}
                  ref={templateBtnRef as any}
                  className={`shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all ${shakingFields.includes(t.fieldTemplatePath) ? "animate-shake ring-4 ring-red-500 bg-red-600" : ""}`}
                >
                  {t.choose}
                </button>
                <input
                  type="file"
                  ref={templateInputRef as any}
                  accept=".xlsx"
                  onChange={handleTemplateUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              {t.outputDir}
            </label>
            <div className="flex gap-2">
              <div
                className={`flex-1 flex items-center px-4 rounded-xl border text-xs truncate font-medium ${directoryHandle ? (isDark ? "border-blue-500/40 bg-blue-500/5 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-700") : isDark ? "border-zinc-700 bg-zinc-800/40 text-zinc-500" : "border-zinc-200 bg-zinc-50 text-zinc-400"}`}
              >
                {directoryHandle?.name || t.selectOutput}
              </div>
              <button
                type="button"
                onClick={chooseDirectory}
                ref={outputDirBtnRef as any}
                className={`shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all ${shakingFields.includes(t.fieldOutputDir) ? "animate-shake ring-4 ring-red-500 bg-red-600" : ""}`}
              >
                {t.choose}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              {t.fileNameFormat}
            </label>
            <input
              type="text"
              value={outputFilenameFormat}
              onChange={(e) => {
                setOutputFilenameFormat(e.target.value);
                localStorage.setItem(
                  "timesheet_outputFilenameFormat",
                  e.target.value,
                );
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-500 font-medium ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500 focus:bg-zinc-800" : "border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 shadow-sm"}`}
            />
            <p
              className={`text-[10px] italic pt-1 ${isDark ? "text-zinc-500 font-medium" : "text-zinc-400"}`}
            >
              Ex:
              &#123;VENDOR&#125;_&#123;NAME&#125;_TIMESHEET_&#123;MM&#125;_&#123;YYYY&#125;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
