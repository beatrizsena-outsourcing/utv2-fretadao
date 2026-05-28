"use client";

import { useState } from "react";
import Link from "next/link";

const NavIcon = {
  Indicators: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Monitor: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  Video: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="15" rx="2" /><polyline points="17 2 12 7 7 2" />
    </svg>
  ),
  Fleet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  ),
  Fuel: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" /><path d="M15 7h6v6" />
    </svg>
  ),
  Maintenance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2" />
    </svg>
  ),
  Pin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
};

function Badge({ label, variant }: { label: string; variant: "blue" | "green" }) {
  return (
    <span
      style={{
        fontSize: 9,
        background: variant === "green" ? "#10b981" : "#3b82f6",
        color: "#fff",
        padding: "1px 5px",
        borderRadius: 8,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.3px",
      }}
    >
      {label}
    </span>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer"
      style={{
        padding: "9px 16px",
        color: "#8fa8c8",
        fontSize: 13,
        fontWeight: 500,
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "var(--sidebar-hover)";
        (e.currentTarget as HTMLDivElement).style.color = "#c8daf0";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "";
        (e.currentTarget as HTMLDivElement).style.color = "#8fa8c8";
      }}
    >
      <span style={{ opacity: 0.75 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SubItem({ label, badge }: { label: string; badge?: string }) {
  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      style={{
        padding: "7px 16px 7px 40px",
        color: "#6b8faf",
        fontSize: 12.5,
        borderLeft: "2px solid transparent",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.color = "#a8c4e0";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.color = "#6b8faf";
      }}
    >
      {label}
      {badge && <Badge label={badge} variant="green" />}
    </div>
  );
}

function UtilSubItem() {
  return (
    <Link href="/" style={{ textDecoration: "none" }}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        style={{
          padding: "7px 16px 7px 28px",
          color: "#fff",
          fontSize: 12.5,
          background: "#0e2040",
          borderLeft: "2px solid #3b82f6",
        }}
      >
        {NavIcon.Pin}
        <span style={{ flex: 1 }}>Utilizacao</span>
        <Badge label="novo" variant="green" />
      </div>
    </Link>
  );
}

interface SidebarProps {
  activeItem?: string;
}

export default function Sidebar({ activeItem = "fleet" }: SidebarProps) {
  const [fleetOpen, setFleetOpen] = useState(true);

  return (
    <aside
      className="sb-scroll flex flex-col overflow-y-auto overflow-x-hidden"
      style={{
        width: 192,
        minWidth: 192,
        background: "var(--sidebar-bg)",
        height: "100vh",
        zIndex: 100,
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3.5"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6" />
          <path d="M2 17L12 22L22 17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <path d="M2 12L12 17L22 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>
          INFLEET
        </span>
      </div>

      <nav className="flex-1 py-2">
        <NavItem icon={NavIcon.Indicators} label="Indicadores" />
        <NavItem icon={NavIcon.Monitor} label="Monitoramento" />
        <NavItem icon={NavIcon.Video} label="Analise de videos" />

        <div
          className="flex items-center gap-2.5 cursor-pointer select-none"
          style={{
            padding: "9px 16px",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            background: "var(--sidebar-active)",
            position: "relative",
          }}
          onClick={() => setFleetOpen(!fleetOpen)}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#3b82f6", borderRadius: "0 2px 2px 0" }} />
          {NavIcon.Fleet}
          <span style={{ flex: 1 }}>Minha frota</span>
          <Badge label="novo" variant="green" />
          <span
            style={{
              fontSize: 10,
              opacity: 0.6,
              transform: fleetOpen ? "rotate(180deg)" : undefined,
              transition: "transform 0.2s",
            }}
          >
            ▼
          </span>
        </div>

        {fleetOpen && (
          <div style={{ background: "#060f1e" }}>
            <SubItem label="Veiculos" />
            <SubItem label="Motoristas" />
            <SubItem label="Fornecedores" />
            <SubItem label="Equipamentos" />
            <UtilSubItem />
            <SubItem label="Identificacao" badge="novo" />
          </div>
        )}

        <NavItem icon={NavIcon.Fuel} label="Combustivel" />
        <NavItem icon={NavIcon.Maintenance} label="Manutencao" />
      </nav>
    </aside>
  );
}