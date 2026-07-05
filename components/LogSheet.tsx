"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Entry } from "@/lib/types";
import { fmt, fmtSigned, fmtPct } from "@/lib/format";
import { sortedEntries } from "@/lib/storage";

type Props = {
  open: boolean;
  entries: Entry[];
  onClose: () => void;
  onDelete: (id: string) => void;
};

export default function LogSheet({ open, entries, onClose, onDelete }: Props) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const s = sortedEntries(entries).slice().reverse();

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
          <h2 className="m-0 text-[15px] font-semibold">Entries</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-line text-muted"
          >
            <X size={17} strokeWidth={1.7} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {s.length === 0 && (
            <div className="py-10 text-center text-[13px] text-muted">
              No entries yet
            </div>
          )}
          {s.map((e) => {
            const pnl = e.close - e.open;
            const pct = e.open !== 0 ? (pnl / e.open) * 100 : 0;
            const colorCls = pnl >= 0 ? "text-gain" : "text-loss";
            return (
              <div
                key={e.id}
                className="flex items-center justify-between gap-2.5 border-b border-line py-3"
              >
                <div className="w-16 flex-shrink-0 text-[12.5px] text-muted">
                  {e.date.slice(5)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted">
                    O{fmt(e.open)} H{fmt(e.high)} L{fmt(e.low)} C{fmt(e.close)}
                  </div>
                  {e.memo && (
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] text-[#8a8a8a]">
                      {e.memo}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={"text-[13.5px] font-semibold " + colorCls}>
                    {fmtSigned(pnl)}
                  </div>
                  <div className={"text-[11px] " + colorCls}>{fmtPct(pct)}</div>
                </div>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => setPendingDelete(e.id)}
                  className="flex flex-shrink-0 items-center justify-center rounded-[7px] p-1.5 text-[#555] hover:bg-loss/10 hover:text-loss"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 削除確認 */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6"
          onClick={() => setPendingDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-line bg-panel p-5"
          >
            <div className="mb-4 text-[14px]">Delete this entry?</div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="flex-1 rounded-[9px] border border-line bg-panel2 py-2.5 text-[13.5px] font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(pendingDelete);
                  setPendingDelete(null);
                }}
                className="flex-1 rounded-[9px] bg-loss py-2.5 text-[13.5px] font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
