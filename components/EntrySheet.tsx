"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Entry } from "@/lib/types";
import { sortedEntries } from "@/lib/storage";
import { useLanguage } from "@/lib/LanguageContext";
import { getLabel, fmtCurrency } from "@/lib/i18n";

type Props = {
  open: boolean;
  entries: Entry[];
  onClose: () => void;
  onSubmit: (entry: Omit<Entry, "id">) => string | null;
};

function nextDefaults(entries: Entry[], language: any) {
  const s = sortedEntries(entries);
  if (s.length === 0) {
    return { open: "", date: "", hint: getLabel("hint.firstEntry", language) };
  }
  const last = s[s.length - 1];
  const d = new Date(last.date);
  d.setDate(d.getDate() + 1);
  const hintBase =
    language === "ja"
      ? `始値は前日の終値（${fmtCurrency(last.close, language)}）を自動で入力しています。修正も可能です。`
      : `The Open value is auto-filled with the previous day's Close (${fmtCurrency(last.close, language)}). You can edit it.`;
  return {
    open: String(last.close),
    date: d.toISOString().slice(0, 10),
    hint: hintBase,
  };
}

export default function EntrySheet({ open, entries, onClose, onSubmit }: Props) {
  const { language } = useLanguage();
  const [date, setDate] = useState("");
  const [openV, setOpenV] = useState("");
  const [highV, setHighV] = useState("");
  const [lowV, setLowV] = useState("");
  const [closeV, setCloseV] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (!open) return;
    const d = nextDefaults(entries, language);
    setDate(d.date);
    setOpenV(d.open);
    setHint(d.hint);
    setHighV("");
    setLowV("");
    setCloseV("");
    setMemo("");
    setError("");
  }, [open, language]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const openN = parseFloat(openV);
    const highN = parseFloat(highV);
    const lowN = parseFloat(lowV);
    const closeN = parseFloat(closeV);

    if ([openN, highN, lowN, closeN].some((v) => isNaN(v)) || !date) {
      setError(getLabel("error.fillRequired", language));
      return;
    }
    const maxV = Math.max(openN, closeN);
    const minV = Math.min(openN, closeN);
    if (highN < maxV || lowN > minV) {
      setError(getLabel("error.highLowRange", language));
      return;
    }
    if (entries.some((x) => x.date === date)) {
      setError(getLabel("error.dateExists", language));
      return;
    }

    const err = onSubmit({
      date,
      open: openN,
      high: highN,
      low: lowN,
      close: closeN,
      memo: memo.trim(),
    });
    if (err) {
      setError(err);
      return;
    }
  }

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
            {getLabel("title.addEntry", language)}
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
          <form id="entryForm" onSubmit={handleSubmit}>
            <Field label={getLabel("label.date", language)}>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
              />
            </Field>
            <div className="mb-3.5 grid grid-cols-2 gap-3">
              <Field label={getLabel("label.open", language)}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1000000"
                  required
                  value={openV}
                  onChange={(e) => setOpenV(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label={getLabel("label.close", language)}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1008000"
                  required
                  value={closeV}
                  onChange={(e) => setCloseV(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <div className="mb-3.5 grid grid-cols-2 gap-3">
              <Field label={getLabel("label.high", language)}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1015000"
                  required
                  value={highV}
                  onChange={(e) => setHighV(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label={getLabel("label.low", language)}>
                <input
                  type="number"
                  step="0.01"
                  placeholder="995000"
                  required
                  value={lowV}
                  onChange={(e) => setLowV(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <Field label={getLabel("label.memo", language)}>
              <input
                type="text"
                placeholder={getLabel("placeholder.memo", language)}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="input"
              />
            </Field>
            <div className="-mt-1.5 mb-3.5 text-[11.5px] leading-relaxed text-muted">
              {hint}
            </div>
            {error && (
              <div className="mb-3.5 rounded-lg border border-loss/20 bg-loss/10 px-3 py-2.5 text-[12.5px] text-loss">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="flex flex-shrink-0 gap-2.5 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[9px] border border-line bg-panel2 py-3 text-[13.5px] font-semibold text-ink"
          >
            {getLabel("btn.cancel", language)}
          </button>
          <button
            type="submit"
            form="entryForm"
            className="flex-1 rounded-[9px] bg-ink py-3 text-[13.5px] font-semibold text-black"
          >
            {getLabel("btn.addEntry", language)}
          </button>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 flex flex-col gap-1.5">
      <label className="text-[11px] tracking-wide text-muted">{label}</label>
      {children}
    </div>
  );
}
