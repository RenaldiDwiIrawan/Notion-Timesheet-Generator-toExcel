import React from "react";

interface WelcomeGuideModalProps {
  show: boolean;
  onClose: () => void;
  t: any;
  isDark: boolean;
}

export default function WelcomeGuideModal({
  show,
  onClose,
  t,
  isDark,
}: WelcomeGuideModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 animate-in fade-in zoom-in duration-300">
      <div
        className={`relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}
      >
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div
          className={`flex items-start justify-between border-b p-6 ${isDark ? "border-zinc-800/50 bg-zinc-950" : "border-zinc-100 bg-zinc-50"}`}
        >
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Logo"
                className="h-full w-full object-contain scale-[2.0]"
              />
            </div>
            <div>
              <h3 className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-xl font-bold text-transparent">
                {t.wgTitle}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">{t.wgSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-800/50 p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div
          className={`space-y-6 overflow-y-auto p-6 max-h-[60vh] ${isDark ? "bg-zinc-900/80" : "bg-white"}`}
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
              🗓️
            </div>
            <div>
              <h4
                className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                {t.wgStep1Title}
              </h4>
              <p
                className={`mt-1 text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {t.wgStep1Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
              🎯
            </div>
            <div>
              <h4
                className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                {t.wgStep2Title}
              </h4>
              <p
                className={`mt-1 text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {t.wgStep2Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              📁
            </div>
            <div>
              <h4
                className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                {t.wgStep3Title}
              </h4>
              <p
                className={`mt-1 text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {t.wgStep3Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              ✍️
            </div>
            <div>
              <h4
                className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                {t.wgStep4Title}
              </h4>
              <p
                className={`mt-1 text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {t.wgStep4Desc}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-rose-500/20 p-2 text-rose-400">
              🚀
            </div>
            <div>
              <h4
                className={`text-sm font-semibold ${isDark ? "text-zinc-200" : "text-zinc-800"}`}
              >
                {t.wgStep5Title}
              </h4>
              <p
                className={`mt-1 text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
              >
                {t.wgStep5Desc}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-800/50 bg-zinc-950/80 p-5">
          <button
            onClick={onClose}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
          >
            {t.wgStartBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
