"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header
      style={{
        background: "#0f1d35",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        flexShrink: 0,
        borderBottom: "1px solid #1a2e4a",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Image
          src="/logo-infleet.webp"
          alt="Infleet"
          width={100}
          height={28}
          style={{ objectFit: "contain" }}
          priority
        />
        <div style={{ width: 1, height: 24, background: "#1e3a5f" }} />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#94b8d8",
            letterSpacing: "0.2px",
          }}
        >
          Utilizacao de Veiculos V2
        </span>
      </div>
    </header>
  );
}