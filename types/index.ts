// ============================================
// CORE TYPES
// ============================================

export interface Vehicle {
  plate: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
  area?: string;
  status?: "moving" | "idle" | "stopped";
}

export interface HeatPoint {
  lat: number;
  lon: number;
  vei: string;
  date: string;
  hour: number;
  vel: number;
  area: string;
  km?: number;
}

export interface Metrics {
  avgSpeed: number;
  maxSpeed: number;
  activeDays: number;
  topHour: string;
  topHourCount: number;
  topDay: string;
  topDayCount: number;
  kmCurrent: number;
  kmPlanned: number;
  totalPoints: number;
  movingPct: number;
}

export interface HeatmapResponse {
  success: boolean;
  points: RawPoint[];
  total?: number;
}

export interface RawPoint {
  Latitude?: number;
  latitude?: number;
  lat?: number;
  Longitude?: number;
  longitude?: number;
  lng?: number;
  Placa?: string;
  "Placa do veículo"?: string;
  placa?: string;
  veiculo?: string;
  vehicle?: string;
  Data?: string;
  data?: string;
  date?: string;
  Velocidade?: number;
  velocidade?: number;
  speed?: number;
  "Endereço da localização"?: string;
  endereco?: string;
  address?: string;
}

// ============================================
// FILTER TYPES
// ============================================

export interface FilterState {
  area: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  timeRange: string;
  weekdays: boolean;
  weekends: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  area: "",
  vehicle: "",
  startDate: "",
  endDate: "",
  timeRange: "",
  weekdays: true,
  weekends: true,
};

// ============================================
// PLATE → AREA MAPPING
// ============================================

export const PLATE_TO_AREA: Record<string, string> = {
  TCA0B14: "A1.1", TCA0B17: "A1.1", SIM4C61: "A1.1", SIJ4G53: "A1.1", TEA1A02: "A1.1", SIJ0H68: "A1.1", SIJ0H70: "A1.1", SYX8D00: "A1.1",
  TCA0B22: "A1.2", TDY0J15: "A1.2", TDY0J21: "A1.2", TDY0J26: "A1.2", SIN3B52: "A1.2", SYM8A66: "A1.2", SYX8D18: "A1.2", TEA1A16: "A1.2", TEA1A24: "A1.2",
  SIJ0H62: "A1.4", SIK1G22: "A1.4", SIK1G25: "A1.4", TDY0J25: "A1.4", SIK1G00: "A1.4", SIK1G03: "A1.4", SIK1G11: "A1.4", SIJ7E80: "A1.4", TDY0J13: "A1.4", SIJ0H67: "A1.4", SIK1G24: "A1.4", SIM4C68: "A1.4", SIK1G12: "A1.4", TEA0J96: "A1.4", TEA1A07: "A1.4", TEA1A08: "A1.4", SYX8C90: "A1.4", SYX8C93: "A1.4",
  SIK1G04: "A1.3", SIM4B83: "A1.3", SIK1G62: "A1.3", SIM4C64: "A1.3", TEA0J90: "A1.3", SIJ3B90: "A1.3",
  SIE2C45: "A1.5", SIE2C46: "A1.5", SIE2C47: "A1.5", SIE2C48: "A1.5", SIK1G19: "A1.5", SIM4B89: "A1.5", SIM4C71: "A1.5", TEA1A14: "A1.5",
  SIK1G07: "A2.1", SIK1G18: "A2.1", SIM4B88: "A2.1", SIM4C73: "A2.1", SIM4D88: "A2.1", SIN3B51: "A2.1", TCA0B35: "A2.1", TCS9I58: "A2.1", TEA1A04: "A2.1", TEA1A34: "A2.1",
  SIM4B78: "A2.2", TEA0J93: "A2.2", TEA0J99: "A2.2", SYX8D05: "A2.2", TEA0J88: "A2.2", TEA0J92: "A2.2", TEA1A26: "A2.2", SYX8D03: "A2.2", TCA0B33: "A2.2", TCV1A29: "A2.2", TDQ8C16: "A2.2",
  SIM4D83: "A2.3", TDY1D89: "A2.3", TDY1D90: "A2.3", TCV1A31: "A2.3", TCA0B34: "A2.3", SIM4B76: "A2.3", SIM4D82: "A2.3", SIM4D85: "A2.3", SYO2I43: "A2.3", SIM9J93: "A2.3", SIM4C63: "A2.3", TCA0B31: "A2.3", TCA0B36: "A2.3",
  SIG7I39: "A2.4", SIG7I82: "A2.4", SIG7I87: "A2.4", SIG7I88: "A2.4", SIG7I89: "A2.4", SYF9G06: "A2.4", TYB1H91: "A2.4", TEA1A00: "A2.4", TEA1A09: "A2.4", TEA1A20: "A2.4",
  SIA9B77: "A2.5", SIA9B79: "A2.5", SIA9B88: "A2.5", TCA0B09: "A2.5", SIG7I37: "A2.5", TCA0B15: "A2.5", TCA0B20: "A2.5", TCA0B30: "A2.5", TCA0B37: "A2.5",
  TDY0J10: "A2.6", TDY0J12: "A2.6", TDY0J17: "A2.6", TDY0J23: "A2.6", TEM9C82: "A2.6", SYX8C95: "A2.6", SYX8D13: "A2.6", TEA1A03: "A2.6",
  SIM4B82: "A3.1", SIA9B86: "A3.1", SIA9B92: "A3.1", SYX8D14: "A3.1", TED7B69: "A3.1", SIK1G01: "A3.1", SIK1G17: "A3.1", SIM4B85: "A3.1", TCA0B26: "A3.1", TED7B63: "A3.1",
  SYX1A80: "A3.2", SYX8D10: "A3.2", TCA0B23: "A3.2", TDY1D91: "A3.2", TDY1D92: "A3.2", SYX8C92: "A3.2", TCA0B27: "A3.2", TDY1D88: "A3.2",
  SIM4D87: "A3.3", SYX8C89: "A3.3", TED7B76: "A3.3", TEA0J97: "A3.3", TEA1A12: "A3.3", TEA1A13: "A3.3",
  TCA0B29: "A3.4", TED7B58: "A3.4", TED7B66: "A3.4", TED7B68: "A3.4", TED7B72: "A3.4", TED7B75: "A3.4", TCV1A28: "A3.4", TCT5A60: "A3.4",
  TEA1A05: "A3.5", TEA1A06: "A3.5", TEA1A21: "A3.5", TEA1A22: "A3.5", TEA1A25: "A3.5", TEA0J87: "A3.5", TEA0J86: "A3.5", TEA0J94: "A3.5", TEA1A27: "A3.5", TEA1A28: "A3.5",
  SIM4B84: "A3.6", SYX8C97: "A3.6", SYX8D09: "A3.6", TCA0B24: "A3.6", TCA0B28: "A3.6", TCS9I56: "A3.6", TED7B64: "A3.6",
  TEA1A18: "A5.1", TDY0J28: "A5.1", TCA0B21: "A5.1", SIK1G14: "A5.1", SIK1G16: "A5.1", SYX8C87: "A5.1", TYB1H86: "A5.1",
  SIJ7E86: "A5.2", SIK1G02: "A5.2", SIK1G06: "A5.2", SIK1G09: "A5.2", SIK1G13: "A5.2", TDY0J11: "A5.2", SIM4C62: "A5.2", TEA0J98: "A5.2", TEA1A23: "A5.2", SIM4B79: "A5.2",
  TED7B59: "A5.3", TED7B61: "A5.3", TED7B67: "A5.3", TED7B70: "A5.3", TED7B71: "A5.3", TED7B73: "A5.3", TEH1I55: "A5.3", TEH1I56: "A5.3", TEH1I57: "A5.3", TED7B74: "A5.3", SIM4B81: "A5.3", SIA9B87: "A5.3",
  TEA0J89: "A5.4", TED7B65: "A5.4", TDY0J16: "A5.4", TEA0J95: "A5.4", SYX8C91: "A5.4", SYX8D07: "A5.4", SYX8D12: "A5.4", TCA0B18: "A5.4",
  TCA0B19: "A5.5", TDY0J27: "A5.5", TEA1A29: "A5.5", SIA3A27: "A5.5", TCA0B25: "A5.5", TCA0B32: "A5.5", TCV1A30: "A5.5", SYX8D02: "A5.5", TCT3D81: "A5.5",
  SIM4B77: "BLADES", SID2D29: "BLADES", SID2D38: "BLADES", SID5F02: "BLADES", SIK1G15: "BLADES", SIM0B43: "BLADES", SIM4C66: "BLADES", SIM4C67: "BLADES", SIM4C70: "BLADES", SIM4E49: "BLADES",
  TDY0J08: "CIM Case", SIK1F99: "CIM Case", SIM4B86: "CIM Case", SIM4B90: "CIM Case", SIM4D35: "CIM Case", SIM4D89: "CIM Case",
  SIK1G10: "INSPECOES", SIM4B87: "INSPECOES", SIM4C65: "INSPECOES", SIM4C72: "INSPECOES", SIM4D90: "INSPECOES", SIN3B50: "INSPECOES",
  TEA1A01: "MAIN COMPONENTS", TEA1A19: "MAIN COMPONENTS", SIM4C69: "MAIN COMPONENTS", SIM4E48: "MAIN COMPONENTS", SIM9J92: "MAIN COMPONENTS",
  CSP9I42: "SERVICES IMPROVEMENT",
  SYO0D31: "CONSTRUCION", SYO0D33: "CONSTRUCION", SYO0D50: "CONSTRUCION", SYO2J79: "CONSTRUCION", SYX5I72: "CONSTRUCION", TCC7F46: "CONSTRUCION", TCG9B75: "CONSTRUCION",
  RUG9C11: "HSE", SYM7H96: "HSE", SYX5I65: "HSE", SYX5I69: "HSE", SYX5I71: "HSE", SYX5I75: "HSE", SYX5I76: "HSE",
  SYO0D35: "SUPLY CHAIN",
  TXU6D99: "SUPERVISOR", EAU8H64: "SUPERVISOR", FCR0H73: "SUPERVISOR", FKB0G74: "SUPERVISOR", EDI5H41: "SUPERVISOR", EQO0D82: "SUPERVISOR", FDW1D51: "SUPERVISOR", FPT2A81: "SUPERVISOR", ECZ4C84: "SUPERVISOR", EKJ1I53: "SUPERVISOR", FHR6B81: "SUPERVISOR", TXU4I62: "SUPERVISOR", TXU4I61: "SUPERVISOR", FUD9C12: "SUPERVISOR", TXU6D89: "SUPERVISOR", EWE8I74: "SUPERVISOR", TXU6D90: "SUPERVISOR", TXU4I59: "SUPERVISOR", ESZ9G42: "SUPERVISOR", FLS2B14: "SUPERVISOR", FOS4B13: "SUPERVISOR", EFI6J14: "SUPERVISOR", EYM3A82: "SUPERVISOR", FMF3J91: "SUPERVISOR", SYX5I74: "SUPERVISOR",
};
