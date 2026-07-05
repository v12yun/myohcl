"use client";

import { List, Download, Plus, Settings } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getLabel } from "@/lib/i18n";

type Props = {
  onOpenLog: () => void;
  onExport: () => void;
  onOpenForm: () => void;
  onOpenSettings: () => void;
};

export default function BottomBar({
  onOpenLog,
  onExport,
  onOpenForm,
  onOpenSettings,
}: Props) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-shrink-0 gap-2.5 border-t border-line px-3.5 py-2.5">
      <button
        type="button"
        onClick={onOpenLog}
        title={getLabel("title.entries", language)}
        className="flex items-center justify-center gap-1.5 rounded-[9px] border border-line bg-panel2 px-4 py-3 text-[13.5px] font-semibold text-ink active:opacity-80"
      >
        <List size={16} strokeWidth={1.8} />
        <span className="hidden sm:inline">{getLabel("btn.list", language)}</span>
      </button>
      <button
        type="button"
        onClick={onExport}
        title={getLabel("btn.export", language)}
        className="flex items-center justify-center rounded-[9px] border border-line bg-panel2 px-3.5 py-3 text-ink active:opacity-80"
      >
        <Download size={16} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        onClick={onOpenSettings}
        title={getLabel("btn.settings", language)}
        className="flex items-center justify-center rounded-[9px] border border-line bg-panel2 px-3.5 py-3 text-ink active:opacity-80"
      >
        <Settings size={16} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        onClick={onOpenForm}
        title={getLabel("btn.addEntry", language)}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-ink px-4 py-3 text-[13.5px] font-semibold text-black active:opacity-80"
      >
        <Plus size={16} strokeWidth={2.2} />
        {getLabel("btn.addEntry", language)}
      </button>
    </div>
  );
}
