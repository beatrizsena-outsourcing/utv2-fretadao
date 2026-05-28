import { HeatPoint, Metrics } from "@/types";
import { formatDate } from "@/utils";

export function computeMetrics(pts: HeatPoint[]): Metrics {
  if (pts.length === 0) {
    return {
      avgSpeed: 0,
      maxSpeed: 0,
      activeDays: 0,
      topHour: "—",
      topHourCount: 0,
      topDay: "—",
      topDayCount: 0,
      kmCurrent: 0,
      kmPlanned: 0,
      totalPoints: 0,
      movingPct: 0,
    };
  }

  // By day
  const byDay: Record<string, number> = {};
  pts.forEach((p) => {
    byDay[p.date] = (byDay[p.date] || 0) + 1;
  });
  const dayEntries = Object.entries(byDay).sort((a, b) => b[1] - a[1]);
  const [topDayRaw, topDayCount] = dayEntries[0] || ["", 0];

  // By hour
  const byHour: Record<number, number> = {};
  pts.forEach((p) => {
    byHour[p.hour] = (byHour[p.hour] || 0) + 1;
  });
  const hourEntries = Object.entries(byHour)
    .map(([h, c]) => [parseInt(h), c] as [number, number])
    .sort((a, b) => b[1] - a[1]);
  const [topHourNum, topHourCount] = hourEntries[0] || [0, 0];

  // Speed
  const moving = pts.filter((p) => p.vel > 0);
  const avgSpeed =
    moving.length > 0
      ? moving.reduce((s, p) => s + p.vel, 0) / moving.length
      : 0;
  const maxSpeed = moving.length > 0 ? Math.max(...moving.map((p) => p.vel)) : 0;

  const movingPct =
    pts.length > 0 ? Math.round((moving.length / pts.length) * 100) : 0;

  return {
    avgSpeed: parseFloat(avgSpeed.toFixed(1)),
    maxSpeed: parseFloat(maxSpeed.toFixed(1)),
    activeDays: Object.keys(byDay).length,
    topHour: `${topHourNum}h – ${topHourNum + 1}h`,
    topHourCount,
    topDay: topDayRaw ? formatDate(topDayRaw) : "—",
    topDayCount,
    kmCurrent: 0,
    kmPlanned: 0,
    totalPoints: pts.length,
    movingPct,
  };
}
