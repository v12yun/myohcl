"use client";

import { X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getLabel, Language } from "@/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SettingsSheet({ open, onClose }: Props) {
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <div
        onClick={onClose}
        className={
          "fixed inset-0 z-[90] bg-black/60 transition-opacity duration-200 " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <div
        className={
          "fixed right-0 top-0 z-[95] flex h-full w-full flex-col border-l border-line bg-panel transition-transform duration-200 ease-out sm:w-[440px] " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-line px-5 py-4">
          <h2 className="m-0 text-[15px] font-semibold">
            {getLabel("title.settings", language)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-line text-muted"
          >
            <X size={17} strokeWidth={1.7} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-3.5 flex flex-col gap-1.5">
            <label className="text-[11px] tracking-wide text-muted">
              {getLabel("label.language", language)}
            </label>
            <div className="flex gap-2">
              {(["en", "ja"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`flex-1 rounded-[9px] px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                    language === lang
                      ? "bg-ink text-black"
                      : "border border-line bg-panel2 text-ink active:opacity-80"
                  }`}
                >
                  {lang === "en" ? "English" : "日本語"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
