import React from "react";

interface SetupHelpModalProps {
  show: boolean;
  onClose: () => void;
  t: any;
}

export default function SetupHelpModal({
  show,
  onClose,
  t,
}: SetupHelpModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-700/50 bg-zinc-900 shadow-2xl origin-top-right transition-all duration-300 animate-in zoom-in-95 scale-100 flex flex-col">
        <div className="bg-zinc-950 p-5 border-b border-zinc-800/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Logo"
              className="h-7 w-7 object-contain scale-[2.0]"
            />
            {t.hsTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 bg-zinc-900 overflow-y-auto">
          <ol className="list-decimal list-inside space-y-4 text-sm text-zinc-300">
            <li>{t.hsStep1}</li>
            <li>{t.hsStep2}</li>
            <li className="leading-relaxed">
              {t.hsStep3a}
              <br />
              <span className="text-[11px] text-zinc-500 mt-2 block italic">
                {t.hsStep3b}
              </span>
            </li>
            <li>{t.hsStep4}</li>
            <li>{t.hsStep5}</li>
            <li>{t.hsStep6}</li>
            <li>{t.hsStep7}</li>
          </ol>
        </div>

        <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition"
          >
            {t.hsUnderstood}
          </button>
        </div>
      </div>
    </div>
  );
}
