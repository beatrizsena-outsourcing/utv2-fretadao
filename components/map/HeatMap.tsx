"use client";

import { useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/dashboard.store";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

export default function HeatMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heatLayerRef = useRef<any>(null);
  const mapInitedRef = useRef(false);

  const filteredData = useDashboardStore((s) => s.filteredData);
  const filterVersion = useDashboardStore((s) => s.filterVersion);
  const isLoading = useDashboardStore((s) => s.isLoading);

  useEffect(() => {
    if (mapInitedRef.current || !mapRef.current) return;

    const init = () => {
      const L = window.L;
      if (!L) return;

      mapInitedRef.current = true;
      const map = L.map(mapRef.current!, {
        zoomControl: true,
        center: [-23.5, -46.6],
        zoom: 7,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      leafMapRef.current = map;
    };

    if (window.L) {
      init();
    } else {
      const interval = setInterval(() => {
        if (window.L) { clearInterval(interval); init(); }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const L = window.L;
    const map = leafMapRef.current;
    if (!L || !map || !mapInitedRef.current) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (filteredData.length === 0) return;

    const count = filteredData.length;

    const coordMap = new Map<string, number>();
    filteredData.forEach((p) => {
      const key = `${p.lat.toFixed(4)},${p.lon.toFixed(4)}`;
      coordMap.set(key, (coordMap.get(key) || 0) + 1);
    });

    const maxCount = Math.max(...coordMap.values());
    const minIntensity = count < 500 ? 0.6 : count < 2000 ? 0.3 : 0.1;

    const heat = filteredData.map((p) => {
      const key = `${p.lat.toFixed(4)},${p.lon.toFixed(4)}`;
      const freq = coordMap.get(key) || 1;
      const intensity = minIntensity + (1 - minIntensity) * (freq / maxCount);
      return [p.lat, p.lon, intensity] as [number, number, number];
    });

    const radius = count < 200 ? 22 : count < 1000 ? 20 : count < 5000 ? 18 : 16;
    const blur = count < 200 ? 12 : count < 1000 ? 14 : 16;
    const maxVal = count < 200 ? 0.05 : count < 1000 ? 0.08 : 0.15;

    heatLayerRef.current = L.heatLayer(heat, {
      radius,
      blur,
      maxZoom: 16,
      max: maxVal,
      gradient: {
        0.0: "#000080",
        0.2: "#0000ff",
        0.4: "#00ffff",
        0.6: "#00ff00",
        0.8: "#ffff00",
        1.0: "#ff0000",
      },
    }).addTo(map);

    const lats = filteredData.map((p) => p.lat);
    const lons = filteredData.map((p) => p.lon);
    map.fitBounds(
      [
        [Math.min(...lats) - 0.05, Math.min(...lons) - 0.05],
        [Math.max(...lats) + 0.05, Math.max(...lons) + 0.05],
      ],
      { maxZoom: 13 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterVersion]);

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div
        ref={mapRef}
        style={{
          position: "absolute", inset: 0, borderRadius: 10,
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      />

      <div style={{
        position: "absolute", top: 10, right: 10, zIndex: 500,
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8,
        padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "#0f172a",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: filteredData.length > 0 ? "#10b981" : "#94a3b8",
          display: "inline-block",
        }}
          className={filteredData.length > 0 ? "animate-pulse-dot" : ""}
        />
        {isLoading
          ? "Carregando dados..."
          : filteredData.length > 0
          ? `${filteredData.length.toLocaleString("pt-BR")} pontos`
          : "Sem pontos para exibir"}
      </div>

      {isLoading && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(255,255,255,0.92)", zIndex: 1000,
          display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column", gap: 16,
          borderRadius: 10,
        }}>
          <div style={{
            width: 40, height: 40, border: "4px solid #e2e8f0",
            borderTopColor: "#3b82f6", borderRadius: "50%",
          }}
            className="animate-spin-slow"
          />
          <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
            Processando dados...
          </span>
        </div>
      )}
    </div>
  );
}
