"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  ColorType,
  CrosshairMode,
} from "lightweight-charts";
import { Entry } from "@/lib/types";
import { fmt, fmtSigned, fmtPct } from "@/lib/format";

type Props = {
  entries: Entry[];
};

export default function AssetChart({ entries }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const entriesRef = useRef<Entry[]>(entries);
  entriesRef.current = entries;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#8a8a8a",
        fontSize: 11,
        attributionLogo: false,
      },
      localization: {
        locale: "en-US",
      },
      grid: {
        vertLines: { color: "#161616" },
        horzLines: { color: "#1a1a1a" },
      },
      rightPriceScale: {
        borderColor: "#1e1e1e",
        scaleMargins: { top: 0.12, bottom: 0.12 },
      },
      timeScale: {
        borderColor: "#1e1e1e",
        timeVisible: false,
        rightOffset: 4,
        barSpacing: 10,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#3a3a3a", width: 1, style: 3, labelBackgroundColor: "#222" },
        horzLine: { color: "#3a3a3a", width: 1, style: 3, labelBackgroundColor: "#222" },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
        axisDoubleClickReset: true,
      },
      kineticScroll: { touch: true, mouse: false },
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const series = chart.addCandlestickSeries({
      upColor: "#3ecf8e",
      downColor: "#ef5350",
      borderUpColor: "#3ecf8e",
      borderDownColor: "#ef5350",
      wickUpColor: "#3ecf8e",
      wickDownColor: "#ef5350",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const tooltip = tooltipRef.current;
    chart.subscribeCrosshairMove((param) => {
      if (!tooltip) return;
      if (!param.point || !param.time || !param.seriesData.size) {
        tooltip.style.opacity = "0";
        return;
      }
      const data = param.seriesData.get(series) as CandlestickData<Time> | undefined;
      if (!data) {
        tooltip.style.opacity = "0";
        return;
      }
      const match = entriesRef.current.find((e) => e.date === data.time);
      const pnl = data.close - data.open;
      const pct = data.open !== 0 ? (pnl / data.open) * 100 : 0;
      const color = pnl >= 0 ? "#3ecf8e" : "#ef5350";
      tooltip.innerHTML = `
        <div style="color:#ccc;margin-bottom:4px;">${data.time}${match?.memo ? " — " + escapeHtml(match.memo) : ""
        }</div>
        Open ${fmt(data.open)}  High ${fmt(data.high)}<br>
        Low ${fmt(data.low)}  Close ${fmt(data.close)}<br>
        <span style="color:${color}">P/L ${fmtSigned(pnl)} (${fmtPct(pct)})</span>`;
      const containerRect = container.getBoundingClientRect();
      const left = Math.min(
        param.point.x + containerRect.left + 16,
        window.innerWidth - 220
      );
      const top = Math.max(param.point.y + containerRect.top - 70, 8);
      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
      tooltip.style.opacity = "1";
    });

    const resizeObserver = new ResizeObserver((entriesList) => {
      const entry = entriesList[0];
      if (!entry) return;
      chart.applyOptions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  const hasFitOnce = useRef(false);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    const data: CandlestickData<Time>[] = [...entries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e) => ({
        time: e.date as Time,
        open: e.open,
        high: e.high,
        low: e.low,
        close: e.close,
      }));
    series.setData(data);

    if (!hasFitOnce.current && data.length > 0) {
      chartRef.current?.timeScale().fitContent();
      hasFitOnce.current = true;
    }
  }, [entries]);

  return (
    <div className="relative h-full w-full">
      {entries.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3.5 px-8 text-center text-[13.5px] text-muted">
          <div className="text-[15px] font-medium text-ink">
            No entries yet
          </div>
          <div>Please use the "+ Add entry" button below to enter the first day's open, high, low, and close.</div>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed z-[80] whitespace-nowrap rounded-lg border border-line bg-[#141414] px-3.5 py-2.5 text-xs leading-[1.7] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.6)] transition-opacity duration-100"
      />
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c] as string)
  );
}
