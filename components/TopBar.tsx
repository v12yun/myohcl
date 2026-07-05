import { Entry } from "@/lib/types";
import { fmt, fmtSigned, fmtPct } from "@/lib/format";

type Props = {
  entries: Entry[];
};

export default function TopBar({ entries }: Props) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const hasData = sorted.length > 0;
  const last = sorted[sorted.length - 1];
  const first = sorted[0];
  const delta = hasData ? last.close - first.open : 0;
  const pct = hasData && first.open !== 0 ? (delta / first.open) * 100 : 0;

  return (
    <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3">
      <div className="flex items-baseline">
        <span className="hidden text-sm font-semibold tracking-wide sm:inline">
          MyOHCL
        </span>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[16px] font-semibold tracking-tight sm:text-[19px]">
          {hasData ? `$${fmt(last.close)}` : "—"}
        </span>
        {hasData && (
          <span
            className={
              "text-[12.5px] font-medium " +
              (delta >= 0 ? "text-gain" : "text-loss")
            }
          >
            {fmtSigned(delta)}（{fmtPct(pct)}）
          </span>
        )}
      </div>
    </div>
  );
}
