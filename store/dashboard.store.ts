"use client";
import { create } from "zustand";
import { FilterState, DEFAULT_FILTERS, HeatPoint } from "@/types";
import { getDefaultDateRange } from "@/utils";

interface DashboardStore {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  rawData: HeatPoint[];
  filteredData: HeatPoint[];
  setRawData: (data: HeatPoint[]) => void;
  availableAreas: string[];
  availableVehicles: string[];
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  filterVersion: number;
  selectedYear: string;
  selectedMonth: string;
  setSelectedYear: (year: string) => void;
  setSelectedMonth: (month: string) => void;
}

const { start, end } = getDefaultDateRange();

function sortAreas(areas: string[]): string[] {
  return [...areas].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function filterData(data: HeatPoint[], filters: FilterState): HeatPoint[] {
  const { area, vehicle, startDate, endDate, timeRange, weekdays, weekends } = filters;
  const hMin = timeRange ? parseInt(timeRange.split("-")[0]) : -1;
  const hMax = timeRange ? parseInt(timeRange.split("-")[1]) : -1;
  return data.filter((p) => {
    if (area && p.area !== area) return false;
    if (vehicle && p.vei !== vehicle) return false;
    if (startDate && p.date < startDate) return false;
    if (endDate && p.date > endDate) return false;
    if (timeRange && (p.hour < hMin || p.hour > hMax)) return false;
    const parts = p.date.split("-");
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const isWE = d.getDay() === 0 || d.getDay() === 6;
    if (!weekdays && !isWE) return false;
    if (!weekends && isWE) return false;
    return true;
  });
}

const now = new Date();

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  filters: {
    ...DEFAULT_FILTERS,
    startDate: start,
    endDate: end,
  },
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => {
    const { start, end } = getDefaultDateRange();
    const newFilters = { ...DEFAULT_FILTERS, startDate: start, endDate: end };
    set((s) => ({
      filters: newFilters,
      filteredData: filterData(s.rawData, newFilters),
      filterVersion: s.filterVersion + 1,
    }));
  },
  applyFilters: () => {
    set((s) => ({
      filteredData: filterData(s.rawData, s.filters),
      filterVersion: s.filterVersion + 1,
    }));
  },
  rawData: [],
  filteredData: [],
  setRawData: (data) => {
    const areasRaw = Array.from(
      new Set(data.map((p) => p.area).filter((a) => a && a !== "Sem area"))
    );
    const areas = sortAreas(areasRaw);
    const vehicles = Array.from(
      new Set(data.map((p) => p.vei).filter(Boolean))
    ).sort();
    set((s) => ({
      rawData: data,
      availableAreas: areas,
      availableVehicles: vehicles,
      filteredData: filterData(data, s.filters),
      filterVersion: s.filterVersion + 1,
    }));
  },
  availableAreas: [],
  availableVehicles: [],
  isLoading: false,
  setIsLoading: (v) => set({ isLoading: v }),
  filterVersion: 0,
  selectedYear: String(now.getFullYear()),
  selectedMonth: String(now.getMonth() + 1).padStart(2, "0"),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
}));
