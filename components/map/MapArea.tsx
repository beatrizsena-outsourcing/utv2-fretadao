"use client";

import React from "react";
import dynamic from "next/dynamic";

const HeatMap = dynamic(() => import("./HeatMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        flex: 1,
        borderRadius: 10,
        border: "1px solid var(--border)",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-3)",
        fontSize: 13,
      }}
    >
      Carregando mapa...
    </div>
  ),
});

const PIN_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

function LegendDot({ gradient, label }: { gradient: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: "var(--text-2)" }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: gradient, flexShrink: 0 }} />
      {label}
    </div>
  );
}

export default function MapArea() {
  return (
    <div
      className="flex flex-col"
      style={{ flex: 1, padding: "12px 24px 16px", minHeight: 0 }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div
          className="flex items-center gap-1.5"
          style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
        >
          {PIN_ICON}
          Mapa de Calor — Concentracao de Deslocamento
        </div>
        <div className="flex items-center gap-4">
          <LegendDot gradient="linear-gradient(135deg,#1a6dff,#0af)" label="Baixa" />
          <LegendDot gradient="linear-gradient(135deg,#0fa,#ff0)" label="Media" />
          <LegendDot gradient="linear-gradient(135deg,#ff0,#f30)" label="Alta" />
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", minHeight: 300 }}>
        <HeatMap />
      </div>
    </div>
  );
}