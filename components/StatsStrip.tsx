import { Entry } from "@/lib/types";
import { fmt, fmtSigned } from "@/lib/format";

type Props = {
  entries: Entry[];
};

export default function StatsStrip({ entries }: Props) {
  const s = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  if (s.length === 0) return <div className="flex-shrink-0 border-b border-line" />;

  const pnls = s.map((e) => e.close - e.open);
  const wins = pnls.filter((p) => p > 0).length;
  const losses = pnls.filter((p) => p < 0).length;
  const winRate = (wins / s.length) * 100;
  const best = Math.max(...pnls);
  const worst = Math.min(...pnls);

  let peak = s[0].close;
  let maxDD = 0;
  s.forEach((e) => {
    peak = Math.max(peak, e.close);
    maxDD = Math.min(maxDD, e.close - peak);
  });

  const cards: { k: string; v: string; cls?: string }[] = [
    { k: "Days", v: `${s.length} days` },
    { k: "Win rate", v: `${winRate.toFixed(1)}%` },
    { k: "Wins/Losses", v: `${wins} / ${losses}` },
    { k: "Best day", v: fmtSigned(best), cls: best >= 0 ? "text-gain" : "text-loss" },
    { k: "Worst day", v: fmtSigned(worst), cls: worst >= 0 ? "text-gain" : "text-loss" },
    { k: "Max DD", v: fmt(maxDD), cls: "text-loss" },
  ];

  return (
    <div className="scrollbar-none flex flex-shrink-0 overflow-x-auto border-b border-line">
      {cards.map((c) => (
        <div
          key={c.k}
          className="flex-shrink-0 whitespace-nowrap border-r border-line px-5 py-2"
        >
          <div className="text-[10px] uppercase tracking-wide text-muted">
            {c.k}
          </div>
          <div className={"mt-0.5 text-[13px] font-semibold " + (c.cls ?? "")}>
            {c.v}
          </div>
        </div>
      ))}
    </div>
  );
}
