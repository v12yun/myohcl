const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const fmt = (n: number) => usdFormatter.format(Math.round(n));
export const fmtSigned = (n: number) => (n >= 0 ? "+" : "") + fmt(n);
export const fmtPct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
