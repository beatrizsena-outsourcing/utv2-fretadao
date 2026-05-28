"use client";

import { useHeatmapData } from "@/hooks/useHeatmapData";
import Header from "@/components/layout/Header";
import FilterBar from "@/components/filters/FilterBar";
import KpiStrip from "@/components/kpi/KpiStrip";
import MapArea from "@/components/map/MapArea";

function ErrorBanner({ error }: { error: Error }) {
  return (
    <div
      style={{
        margin: "12px 28px 0",
        padding: "10px 16px",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: 8,
        fontSize: 12.5,
        color: "#dc2626",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span>
        <strong>Backend não disponível:</strong> {error.message}. Verifique se o servidor está rodando em{" "}
        <code style={{ background: "#fee2e2", padding: "1px 4px", borderRadius: 3 }}>
          {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}
        </code>
      </span>
    </div>
  );
}

export default function Page() {
  const { error } = useHeatmapData();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Header azul marinho */}
      <Header />

      {/* Título da seção */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "14px 28px 0",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
          Minha frota &rsaquo; <span style={{ color: "#3b82f6" }}>Utilização</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>
          Heatmap de Deslocamento
        </h1>
      </div>

      {error && <ErrorBanner error={error as Error} />}

      <FilterBar />
      <KpiStrip />
      <MapArea />
    </div>
  );
}
