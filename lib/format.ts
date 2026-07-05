export const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");
export const fmtSigned = (n: number) => (n >= 0 ? "+" : "") + fmt(n);
export const fmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
