import * as XLSX from "xlsx";
import { HeatPoint } from "@/types";
import { PLATE_TO_AREA } from "@/utils";

const KM_PLANEJADO: Record<string, number> = {
  "SIJ7E86": 1700, "SIK1G02": 1700, "SIK1G06": 1700, "SIK1G09": 1700, "SIK1G13": 1700, "TDY0J11": 1700,
  "SIM4B78": 1700, "SYX8D05": 1700, "TEA0J93": 1700, "TEA0J99": 1700,
  "SIJ0H62": 1900, "SIK1G22": 1900, "SIK1G25": 1900,
  "SIM4C61": 3300, "TCA0B14": 3300, "TCA0B17": 3300,
  "SIN3B52": 3300, "SYM8A66": 3300, "SYX8D18": 3300, "TEA1A16": 3300, "TEA1A24": 3300,
  "SIK1G01": 3300, "SIK1G17": 3300, "SYX8D14": 3300, "TED7B63": 3300,
  "TDY0J26": 3300, "TDY0J28": 3300, "TEA1A18": 3300,
  "TDY0J10": 2600, "TDY0J12": 2600, "TDY0J17": 2600, "TDY0J23": 2600, "TEM9C82": 2600,
  "TCA0B22": 1600, "TDY0J15": 1600, "TDY0J21": 1600,
  "SIA9B86": 1500, "SIA9B92": 1500, "SIM4B82": 1500, "SIM4B85": 1500, "TED7B69": 1500,
  "SIA9B87": 1500, "SIM4B81": 1500, "TED7B74": 1500,
  "SIM4B84": 2500, "SYX8C97": 2500, "SYX8D09": 2500, "TCA0B24": 2500, "TCA0B28": 2500,
  "TCS9I56": 2500, "TED7B64": 2500, "SIK1G07": 2500, "SIK1G18": 2500, "SIM4B88": 2500,
  "SIM4C73": 2500, "SIM4D88": 2500, "SIN3B51": 2500, "TCA0B35": 2500,
  "SIJ7E80": 3500, "SIK1G00": 3500, "SIK1G03": 3500, "SIK1G11": 3500, "TDY0J25": 3500,
  "SIM4D83": 2300, "TDY1D89": 2300, "TDY1D90": 2300,
  "TED7B59": 2300, "TED7B61": 2300, "TED7B67": 2300, "TED7B70": 2300, "TED7B71": 2300,
  "TED7B73": 2300, "TEH1I55": 2300, "TEH1I56": 2300, "TEH1I57": 2300,
  "SIG7I39": 2400, "SIG7I82": 2400, "SIG7I87": 2400, "SIG7I88": 2400, "SIG7I89": 2400,
  "SYF9G06": 2400, "TYB1H91": 2400,
  "SYX8C91": 2400, "SYX8D07": 2400, "SYX8D12": 2400, "TCA0B18": 2400,
  "TDY0J16": 2400, "TEA0J95": 2400, "TED7B65": 2400,
  "SIK1G14": 2200, "SIK1G16": 2200, "SYX8C87": 2200, "TCA0B21": 2200, "TYB1H86": 2200,
  "TEA0J86": 2200, "TEA0J94": 2200, "TEA1A27": 2200, "TEA1A28": 2200,
  "SYX1A80": 2500, "SYX8D10": 2500, "TCA0B23": 2500, "TDY1D91": 2500, "TDY1D92": 2500,
  "SYX8C92": 1800, "TCA0B27": 1800, "TDY1D88": 1800,
  "SIA9B77": 1800, "SIA9B79": 1800, "SIA9B88": 1800, "SIG7I37": 1800, "TCA0B09": 1800,
  "TCA0B15": 1800, "TCA0B20": 1800, "TCA0B30": 1800, "TCA0B37": 1800,
  "SYX8D03": 1800, "TCA0B33": 1800, "TCV1A29": 1800, "TDQ8C16": 1800,
  "SIM4C62": 2640,
  "TEA0J89": 400,
  "SIK1G04": 2500, "SIM4B83": 2500, "SIK1G62": 2500, "SIM4C64": 2500, "TEA0J90": 2500,
  "TCS9I58": 1980, "TEA1A04": 1980, "TEA1A34": 1980,
  "TEA0J98": 2500, "SIM4B79": 2500, "TEA1A23": 2500,
  "SYX8C95": 2500, "SYX8D13": 2500, "TEA1A03": 2500,
  "SIJ0H67": 2500, "SIK1G24": 2500, "SIM4C68": 2500, "TDY0J13": 2500,
  "SIA3A27": 2500, "TCA0B19": 2500, "TCA0B25": 2500, "TCA0B32": 2500,
  "TCV1A30": 2500, "TDY0J27": 2500, "TEA1A29": 2500,
  "TEA0J88": 2500, "TEA0J92": 2500, "TEA1A26": 2500,
  "TEA1A00": 2500, "TEA1A09": 2500, "TEA1A20": 2500,
  "SIM4B76": 2500, "SIM4C63": 2500, "SIM4D82": 2500, "SIM4D85": 2500,
  "SIM9J93": 2500, "SYO2I43": 2500, "TCA0B31": 2500, "TCA0B36": 2500,
  "TEA0J87": 2900, "TEA1A05": 2900, "TEA1A06": 2900,
  "TEA1A21": 2900, "TEA1A22": 2900, "TEA1A25": 2900,
  "TCA0B34": 1300, "TCV1A31": 1300,
  "SIJ0H68": 1300, "SIJ0H70": 1300, "SIJ4G53": 1300, "SYX8D00": 1300, "TEA1A02": 1300,
  "SIJ3B90": 1400,
  "SIK1G12": 3000, "SYX8C90": 3000, "SYX8C93": 3000,
  "TEA0J96": 3000, "TEA1A07": 3000, "TEA1A08": 3000,
  "TCA0B29": 1200, "TCT5A60": 1200, "TCV1A28": 1200, "TED7B58": 1200,
  "TED7B66": 1200, "TED7B68": 1200, "TED7B72": 1200, "TED7B75": 1200,
  "SYX8D02": 1950, "TCT3D81": 1950,
};

export function exportToExcel(
  filteredData: HeatPoint[],
  metrics: {
    topDay: string;
    topDayCount: number;
    topHour: string;
    topHourCount: number;
    activeDays: number;
    totalPoints: number;
    avgSpeed: number;
    maxSpeed: number;
    movingPct: number;
  },
  selectedYear: string,
  selectedMonth: string,
  filters: {
    area: string;
    vehicle: string;
  }
) {
  const wb = XLSX.utils.book_new();
  const monthNames: Record<string, string> = {
    "01": "Janeiro", "02": "Fevereiro", "03": "Marco", "04": "Abril",
    "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto",
    "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro",
  };
  const periodoLabel = `${monthNames[selectedMonth] || selectedMonth}/${selectedYear}`;

  // ============================================
  // ABA 1 — RESUMO POR VEÍCULO
  // ============================================
  const veiculoMap = new Map<string, { km: number; days: Set<string>; speeds: number[]; moving: number; total: number }>();

  filteredData.forEach((p) => {
    if (!veiculoMap.has(p.vei)) {
      veiculoMap.set(p.vei, { km: p.km || 0, days: new Set(), speeds: [], moving: 0, total: 0 });
    }
    const v = veiculoMap.get(p.vei)!;
    v.days.add(p.date);
    v.speeds.push(p.vel);
    if (p.vel > 0) v.moving++;
    v.total++;
  });

  const resumoRows = Array.from(veiculoMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([placa, v]) => {
      const area = PLATE_TO_AREA[placa] || "N/A";
      const kmPlanejado = KM_PLANEJADO[placa];
      const desvio = kmPlanejado ? ((v.km - kmPlanejado) / kmPlanejado * 100).toFixed(1) + "%" : "N/A";
      const velMedia = v.speeds.length > 0
        ? (v.speeds.reduce((a, b) => a + b, 0) / v.speeds.length).toFixed(1)
        : "0";
      return {
        "Placa": placa,
        "Area": area,
        "Km Realizado": Math.round(v.km),
        "Km Planejado": kmPlanejado || "N/A",
        "Desvio %": desvio,
        "Dias Ativos": v.days.size,
        "Velocidade Media (km/h)": velMedia,
        "% Em Movimento": v.total > 0 ? Math.round(v.moving / v.total * 100) + "%" : "0%",
      };
    });

  const ws1 = XLSX.utils.json_to_sheet(resumoRows);
  ws1["!cols"] = [
    { wch: 12 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
    { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, "Resumo por Veiculo");

  // ============================================
  // ABA 2 — PONTOS GPS
  // ============================================
  const gpsRows = filteredData.map((p) => ({
    "Data": p.date,
    "Hora": String(p.hour).padStart(2, "0") + "h",
    "Placa": p.vei,
    "Area": p.area,
    "Latitude": p.lat,
    "Longitude": p.lon,
    "Velocidade (km/h)": p.vel,
    "Ignicao": "Ligada",
  }));

  const ws2 = XLSX.utils.json_to_sheet(gpsRows);
  ws2["!cols"] = [
    { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 20 },
    { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, "Pontos GPS");

  // ============================================
  // ABA 3 — KPIs DO PERÍODO
  // ============================================
  const kmTotal = Array.from(veiculoMap.values()).reduce((a, b) => a + b.km, 0);
  const kmPlanejadoTotal = Array.from(veiculoMap.keys())
    .reduce((a, placa) => a + (KM_PLANEJADO[placa] || 0), 0);
  const desvioTotal = kmPlanejadoTotal > 0
    ? ((kmTotal - kmPlanejadoTotal) / kmPlanejadoTotal * 100).toFixed(1) + "%"
    : "N/A";

  const kpiRows = [
    { "Indicador": "Periodo", "Valor": periodoLabel },
    { "Indicador": "Filtro Area", "Valor": filters.area || "Todas" },
    { "Indicador": "Filtro Placa", "Valor": filters.vehicle || "Todas" },
    { "Indicador": "Dia mais ativo", "Valor": metrics.topDay },
    { "Indicador": "Registros no dia mais ativo", "Valor": metrics.topDayCount },
    { "Indicador": "Horario de pico", "Valor": metrics.topHour },
    { "Indicador": "Registros no horario de pico", "Valor": metrics.topHourCount },
    { "Indicador": "Dias ativos", "Valor": metrics.activeDays },
    { "Indicador": "Total de pontos GPS", "Valor": metrics.totalPoints },
    { "Indicador": "Velocidade media (km/h)", "Valor": metrics.avgSpeed },
    { "Indicador": "Velocidade maxima (km/h)", "Valor": metrics.maxSpeed },
    { "Indicador": "% Em movimento", "Valor": metrics.movingPct + "%" },
    { "Indicador": "Km Realizado", "Valor": Math.round(kmTotal) + " km" },
    { "Indicador": "Km Planejado", "Valor": kmPlanejadoTotal > 0 ? Math.round(kmPlanejadoTotal) + " km" : "N/A" },
    { "Indicador": "Desvio Km", "Valor": desvioTotal },
  ];

  const ws3 = XLSX.utils.json_to_sheet(kpiRows);
  ws3["!cols"] = [{ wch: 35 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws3, "KPIs do Periodo");

  // ============================================
  // DOWNLOAD
  // ============================================
  const fileName = `Utilizacao_Frota_${periodoLabel.replace("/", "_")}.xlsx`;
  XLSX.writeFile(wb, fileName);
}