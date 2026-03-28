import React from "react";

interface NotepadHelpModalProps {
  show: boolean;
  onClose: () => void;
  t: any;
}

export default function NotepadHelpModal({
  show,
  onClose,
  t,
}: NotepadHelpModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-zinc-900 p-8 shadow-2xl origin-top-right transition-all duration-300 animate-in zoom-in-95 scale-100">
        <div className="mb-6 flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo"
              className="h-full w-full object-contain scale-[2.2]"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t.hnTitle}</h2>
            <p className="text-sm text-zinc-400 italic">{t.hnSubtitle}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8 text-zinc-300">
          <div className="flex gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              1
            </div>
            <p className="text-sm leading-relaxed">{t.hnStep1}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              2
            </div>
            <p className="text-sm leading-relaxed">{t.hnStep2}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              3
            </div>
            <p className="text-sm leading-relaxed">{t.hnStep3}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              4
            </div>
            <p className="text-sm leading-relaxed">{t.hnStep4}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
              5
            </div>
            <p className="text-sm leading-relaxed">{t.hnStep5}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500 hover:scale-[1.02]"
        >
          {t.hnUnderstood}
        </button>
      </div>
    </div>
  );
}
