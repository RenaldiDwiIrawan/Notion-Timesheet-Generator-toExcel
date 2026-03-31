import React from "react";

interface HeaderProps {
  t: any;
  isDark: boolean;
  lang: string;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  setShowWelcomeGuide: (show: boolean) => void;
}

export default function Header({
  t,
  isDark,
  lang,
  toggleLanguage,
  toggleTheme,
  setShowWelcomeGuide,
}: HeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-white/5 shadow-inner border border-white/10 backdrop-blur-md overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Timesheet Logo"
            className="h-full w-full object-contain drop-shadow-lg scale-[2.2]"
          />
        </div>
        <div>
          <h1 className="mb-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            {t.title}
          </h1>
          <p
            className={`text-[10px] sm:text-xs font-medium italic ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          >
            {t.desc}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
        <button
          onClick={() => setShowWelcomeGuide(true)}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all ${isDark ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 shadow-sm"}`}
        >
          <svg
            className="h-4 w-4 text-blue-400"
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
          {t.guide}
        </button>
        <button
          onClick={toggleLanguage}
          className={`flex items-center rounded-full border p-1 text-xs font-bold transition-all ${isDark ? "border-zinc-700/50 bg-zinc-800/50" : "border-zinc-200 bg-zinc-100"}`}
        >
          <div
            className={`rounded-full px-2.5 py-1 transition-all ${lang === "ENG" ? (isDark ? "bg-blue-600 text-white" : "bg-white text-blue-600 shadow-sm") : "text-zinc-500"}`}
          >
            ENG
          </div>
          <div
            className={`rounded-full px-2.5 py-1 transition-all ${lang === "ID" ? (isDark ? "bg-blue-600 text-white" : "bg-white text-blue-600 shadow-sm") : "text-zinc-500"}`}
          >
            ID
          </div>
        </button>
        <button
          onClick={toggleTheme}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${isDark ? "border-zinc-700 bg-zinc-800 text-yellow-400 hover:bg-zinc-700" : "border-zinc-200 bg-zinc-50 text-indigo-600 hover:bg-white shadow-sm"}`}
        >
          {isDark ? (
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
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 21a9 9 0 100-18 9 9 0 000 18z"
              />
            </svg>
          ) : (
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
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
