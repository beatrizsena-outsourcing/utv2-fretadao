"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import { computeMetrics } from "@/services/metrics.service";
import { formatNumber } from "@/utils";
import { HeatPoint } from "@/types";

const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  violet: "#8b5cf6",
  red: "#ef4444",
  slate: "#64748b",
  teal: "#0d9488",
} as const;

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  color: keyof typeof COLORS;
  extra?: React.ReactNode;
}

function KpiCard({ label, value, sub, color, extra }: KpiCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border animate-fade-in"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        padding: "14px 16px",
        transition: "box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
      }}
    >
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: COLORS[color],
          borderRadius: "10px 10px 0 0",
        }}
      />
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)", lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace" }}>
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 4 }}>
        {sub}
      </div>
      {extra}
    </div>
  );
}

export default function KpiStrip() {
  const filteredData = useDashboardStore((s) => s.filteredData);
  const isLoading = useDashboardStore((s) => s.isLoading);

  const metrics = useMemo(() => computeMetrics(filteredData), [filteredData]);

  // Km rodado: soma única por veículo
  const kmRealizado = useMemo(() => {
    const seen = new Map<string, number>();
    filteredData.forEach((p) => {
      if (p.vei && (p as HeatPoint).km !== undefined && !seen.has(p.vei)) {
        seen.set(p.vei, (p as HeatPoint).km!);
      }
    });
    let total = 0;
    seen.forEach((km) => { total += km; });
    return total;
  }, [filteredData]);

  if (isLoading) {
    return (
      <div className="grid gap-3" style={{ padding: "16px 24px 0", gridTemplateColumns: "repeat(6, 1fr)", background: "#f1f5f9" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border" style={{ height: 88, background: "#fff", borderColor: "var(--border)", animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
    );
  }

  const cards: KpiCardProps[] = [
    {
      label: "Dia mais ativo",
      value: metrics.topDay || "—",
      sub: metrics.topDayCount > 0 ? `${formatNumber(metrics.topDayCount)} registros` : "Sem dados",
      color: "blue",
    },
    {
      label: "Horario de pico",
      value: metrics.topHour || "—",
      sub: metrics.topHourCount > 0 ? `${formatNumber(metrics.topHourCount)} registros` : "Sem dados",
      color: "green",
    },
    {
      label: "Dias ativos",
      value: metrics.activeDays > 0 ? String(metrics.activeDays) : "—",
      sub: "dias com atividade",
      color: "amber",
    },
    {
      label: "Total de pontos",
      value: metrics.totalPoints > 0 ? formatNumber(metrics.totalPoints) : "—",
      sub: "registros com GPS valido",
      color: "violet",
    },
    {
      label: "Velocidade media",
      value: metrics.avgSpeed > 0 ? `${metrics.avgSpeed} km/h` : "—",
      sub: metrics.maxSpeed > 0 ? `maxima de ${metrics.maxSpeed} km/h` : "Sem dados",
      color: "red",
    },
    {
      label: "Km rodado",
      value: kmRealizado > 0 ? `${formatNumber(Math.round(kmRealizado))} km` : "—",
      sub: "total realizado no periodo",
      color: "teal",
    },
  ];

  return (
    <div className="grid gap-3" style={{ padding: "16px 24px 0", gridTemplateColumns: "repeat(6, 1fr)", background: "#f1f5f9" }}>
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
}
