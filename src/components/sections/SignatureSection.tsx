import React from "react";

interface SignatureSectionProps {
  t: any;
  isDark: boolean;
  submitterName: string;
  setSubmitterName: (val: string) => void;
  submitterNameRef: React.RefObject<HTMLInputElement | null>;
  submitterDate: string;
  setSubmitterDate: (val: string) => void;
  approverName: string;
  setApproverName: (val: string) => void;
  approverNameRef: React.RefObject<HTMLInputElement | null>;
  approverDate: string;
  setApproverDate: (val: string) => void;
  submitterSignature: string | null;
  setSubmitterSignature: (val: string | null) => void;
  signatureRef: React.RefObject<HTMLInputElement | null>;
  handleSignatureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  year: number;
  month: number;
  getTodayStr: () => string;
  getLastDayStr: (y: number, m: number) => string;
  shakingFields: string[];
}

export default function SignatureSection({
  t,
  isDark,
  submitterName,
  setSubmitterName,
  submitterNameRef,
  submitterDate,
  setSubmitterDate,
  approverName,
  setApproverName,
  approverNameRef,
  approverDate,
  setApproverDate,
  submitterSignature,
  setSubmitterSignature,
  signatureRef,
  handleSignatureUpload,
  year,
  month,
  getTodayStr,
  getLastDayStr,
  shakingFields,
}: SignatureSectionProps) {
  return (
    <div className="mt-6">
      <div
        className={`group rounded-3xl border p-5 sm:p-7 transition-all duration-500 ${isDark ? "bg-zinc-900/40 border-zinc-800/80 hover:border-purple-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]" : "bg-white border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.15em] text-purple-500">
            <div
              className={`p-1.5 rounded-lg ${isDark ? "bg-purple-500/10" : "bg-purple-50"}`}
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            {t.signatures}
          </h2>
          <div
            className={`h-px flex-1 ml-4 ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}
          ></div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <label
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              {t.subBy}
            </label>
            <input
              type="text"
              ref={submitterNameRef as any}
              value={submitterName}
              placeholder={t.subNamePlaceholder}
              onChange={(e) => {
                setSubmitterName(e.target.value);
                localStorage.setItem("timesheet_submitterName", e.target.value);
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-500 font-medium ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500" : "border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 shadow-sm"} ${shakingFields.includes(t.fieldSubmitterName) ? "animate-shake ring-2 ring-red-500 border-red-500" : ""}`}
            />
            <div className="flex items-center justify-between pt-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                {t.date}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSubmitterDate(getTodayStr())}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition"
                >
                  {t.setToday}
                </button>
                <button
                  onClick={() => setSubmitterDate(getLastDayStr(year, month))}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition"
                >
                  {t.setEom}
                </button>
              </div>
            </div>
            <input
              type="text"
              value={submitterDate}
              onChange={(e) => setSubmitterDate(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all font-medium ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500" : "border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 shadow-sm"}`}
            />
          </div>
          <div className="space-y-3">
            <label
              className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
            >
              {t.appBy}
            </label>
            <input
              type="text"
              ref={approverNameRef as any}
              value={approverName}
              placeholder={t.appNamePlaceholder}
              onChange={(e) => {
                setApproverName(e.target.value);
                localStorage.setItem("timesheet_approverName", e.target.value);
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-500 font-medium ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500" : "border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 shadow-sm"} ${shakingFields.includes(t.fieldApproverName) ? "animate-shake ring-2 ring-red-500 border-red-500" : ""}`}
            />
            <div className="flex items-center justify-between pt-1">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                {t.date}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setApproverDate(getTodayStr())}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition"
                >
                  {t.setToday}
                </button>
                <button
                  onClick={() => setApproverDate(getLastDayStr(year, month))}
                  className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition"
                >
                  {t.setEom}
                </button>
              </div>
            </div>
            <input
              type="text"
              value={approverDate}
              onChange={(e) => setApproverDate(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all font-medium ${isDark ? "border-zinc-700 bg-zinc-800/50 text-zinc-200 focus:border-blue-500" : "border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 shadow-sm"}`}
            />
          </div>
        </div>

        <div
          className={`mt-6 pt-6 border-t ${isDark ? "border-zinc-800/50" : "border-zinc-100"}`}
        >
          <label
            className={`mb-3 block text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          >
            {t.digitalSig}
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => signatureRef.current?.click()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${isDark ? "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 shadow-sm"}`}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {t.choose}
            </button>
            <input
              type="file"
              ref={signatureRef as any}
              accept="image/*"
              onChange={handleSignatureUpload}
              className="hidden"
            />

            {submitterSignature ? (
              <div
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border animate-in zoom-in duration-300 ${isDark ? "border-zinc-700 bg-zinc-800/50" : "border-blue-100 bg-blue-50/50"}`}
              >
                <div className="h-10 w-16 bg-white overflow-hidden rounded-lg flex items-center justify-center border border-zinc-200/50 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={submitterSignature}
                    alt="Signature Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <button
                  onClick={() => setSubmitterSignature(null)}
                  className="p-1.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <span
                className={`text-[10px] font-medium italic ${isDark ? "text-zinc-600" : "text-zinc-400"}`}
              >
                {t.noFileChosen}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
