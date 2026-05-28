"use client";

import { useMemo } from "react";
import { useDashboardStore } from "@/store/dashboard.store";
import { exportToExcel } from "@/services/export.service";
import { computeMetrics } from "@/services/metrics.service";
import { PLATE_TO_AREA } from "@/utils";

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#64748b",
  textTransform: "uppercase", letterSpacing: "0.6px",
  whiteSpace: "nowrap", marginBottom: 4, display: "block",
};

const selectStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#0f172a",
  background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7,
  padding: "8px 12px", outline: "none", cursor: "pointer",
  width: "100%", transition: "border-color 0.15s",
};

const inputStyle: React.CSSProperties = { ...selectStyle };

interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
  width?: number | string;
}

function FilterGroup({ label, children, width }: FilterGroupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: width || 160 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

const MONTHS = [
  { value: "01", label: "Janeiro" }, { value: "02", label: "Fevereiro" },
  { value: "03", label: "Marco" }, { value: "04", label: "Abril" },
  { value: "05", label: "Maio" }, { value: "06", label: "Junho" },
  { value: "07", label: "Julho" }, { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" }, { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" }, { value: "12", label: "Dezembro" },
];

const YEARS = ["2026", "2025", "2024"];

export default function FilterBar() {
  const filters = useDashboardStore((s) => s.filters);
  const setFilter = useDashboardStore((s) => s.setFilter);
  const applyFilters = useDashboardStore((s) => s.applyFilters);
  const resetFilters = useDashboardStore((s) => s.resetFilters);
  const rawData = useDashboardStore((s) => s.rawData);
  const filteredData = useDashboardStore((s) => s.filteredData);
  const availableAreas = useDashboardStore((s) => s.availableAreas);
  const availableVehicles = useDashboardStore((s) => s.availableVehicles);
  const selectedYear = useDashboardStore((s) => s.selectedYear);
  const selectedMonth = useDashboardStore((s) => s.selectedMonth);
  const setSelectedYear = useDashboardStore((s) => s.setSelectedYear);
  const setSelectedMonth = useDashboardStore((s) => s.setSelectedMonth);

  // Placas: só mostra quando empresa selecionada, limitado aos dados reais
  const vehiclesForArea = useMemo(() => {
    if (!filters.area) return [];
    const platesWithData = new Set(rawData.map((p) => p.vei));
    const platesForArea = Object.entries(PLATE_TO_AREA)
      .filter(([, area]) => area === filters.area)
      .map(([plate]) => plate)
      .sort();
    return platesForArea.map((plate) => ({
      plate,
      hasData: platesWithData.has(plate),
    }));
  }, [filters.area, rawData]);

  const handleAreaChange = (area: string) => {
    setFilter("area", area);
    setFilter("vehicle", "");
  };

  const handleExport = () => {
    const metrics = computeMetrics(filteredData);
    exportToExcel(filteredData, metrics, selectedYear, selectedMonth,
      { area: filters.area, vehicle: filters.vehicle });
  };

  const selectedVehicleHasData = !filters.vehicle ||
    rawData.some((p) => p.vei === filters.vehicle);

  // Empresas vindas dos dados reais
  const empresas = availableAreas.length > 0 ? availableAreas : [];

  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 28px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>

        {/* Ano */}
        <FilterGroup label="Ano" width={110}>
          <select style={selectStyle} value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </FilterGroup>

        {/* Mes */}
        <FilterGroup label="Mes" width={140}>
          <select style={selectStyle} value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}>
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </FilterGroup>

        {/* Empresa */}
        <FilterGroup label="Unidade" width={240}>
          <select style={selectStyle} value={filters.area}
            onChange={(e) => handleAreaChange(e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}>
            <option value="">Todas as unidades</option>
            {empresas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </FilterGroup>

        {/* Placa — só aparece quando empresa selecionada */}
        {filters.area && vehiclesForArea.length > 0 && (
          <FilterGroup label="Placa" width={200}>
            <select
              style={{
                ...selectStyle,
                borderColor: filters.vehicle && !selectedVehicleHasData ? "#f59e0b" : "#e2e8f0",
                color: filters.vehicle && !selectedVehicleHasData ? "#92400e" : "#0f172a",
              }}
              value={filters.vehicle}
              onChange={(e) => setFilter("vehicle", e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.currentTarget.style.borderColor =
                filters.vehicle && !selectedVehicleHasData ? "#f59e0b" : "#e2e8f0")}>
              <option value="">Todas as placas</option>
              {vehiclesForArea.map(({ plate, hasData }) => (
                <option key={plate} value={plate}>
                  {plate}{!hasData ? " (sem dados)" : ""}
                </option>
              ))}
            </select>
          </FilterGroup>
        )}

        {/* Aviso sem dados */}
        {filters.vehicle && !selectedVehicleHasData && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 7, padding: "6px 12px", fontSize: 12, color: "#92400e", fontWeight: 500, alignSelf: "flex-end", height: 38 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Veiculo sem registros neste periodo
          </div>
        )}

        {/* De */}
        <FilterGroup label="De" width={150}>
          <input type="date" style={inputStyle} value={filters.startDate}
            onChange={(e) => setFilter("startDate", e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")} />
        </FilterGroup>

        {/* Ate */}
        <FilterGroup label="Ate" width={150}>
          <input type="date" style={inputStyle} value={filters.endDate}
            onChange={(e) => setFilter("endDate", e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")} />
        </FilterGroup>

        {/* Horario */}
        <FilterGroup label="Horario" width={200}>
          <select style={selectStyle} value={filters.timeRange}
            onChange={(e) => setFilter("timeRange", e.target.value)}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}>
            <option value="">Todos os horarios</option>
            <option value="0-5">Madrugada (00h-06h)</option>
            <option value="6-11">Manha (06h-12h)</option>
            <option value="12-17">Tarde (12h-18h)</option>
            <option value="18-23">Noite (18h-00h)</option>
          </select>
        </FilterGroup>

        {/* Dias */}
        <FilterGroup label="Dias" width={160}>
          <div style={{ display: "flex", gap: 16, paddingBottom: 2, alignItems: "center", height: 38 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151", cursor: "pointer" }}>
              <input type="checkbox" checked={filters.weekdays}
                onChange={(e) => setFilter("weekdays", e.target.checked)}
                style={{ cursor: "pointer", width: 14, height: 14 }} />
              Uteis
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151", cursor: "pointer" }}>
              <input type="checkbox" checked={filters.weekends}
                onChange={(e) => setFilter("weekends", e.target.checked)}
                style={{ cursor: "pointer", width: 14, height: 14 }} />
              FDS
            </label>
          </div>
        </FilterGroup>

        {/* Botoes */}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button onClick={applyFilters}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", background: "#1d4ed8", border: "none", borderRadius: 7, padding: "9px 20px", cursor: "pointer", whiteSpace: "nowrap", height: 38 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1d4ed8")}>
            Aplicar
          </button>
          <button onClick={resetFilters}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#64748b", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 7, padding: "9px 16px", cursor: "pointer", whiteSpace: "nowrap", height: 38 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
            Limpar
          </button>
          <button onClick={handleExport} disabled={filteredData.length === 0}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", background: filteredData.length === 0 ? "#94a3b8" : "#10b981", border: "none", borderRadius: 7, padding: "9px 16px", cursor: filteredData.length === 0 ? "not-allowed" : "pointer", whiteSpace: "nowrap", height: 38, display: "flex", alignItems: "center", gap: 6 }}
            onMouseEnter={(e) => { if (filteredData.length > 0) (e.currentTarget as HTMLButtonElement).style.background = "#059669"; }}
            onMouseLeave={(e) => { if (filteredData.length > 0) (e.currentTarget as HTMLButtonElement).style.background = "#10b981"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar Excel
          </button>
        </div>

        {filteredData.length > 0 && (
          <div style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8", alignSelf: "flex-end", paddingBottom: 8 }}>
            {filteredData.length.toLocaleString("pt-BR")} pontos filtrados
          </div>
        )}
      </div>
    </div>
  );
}
