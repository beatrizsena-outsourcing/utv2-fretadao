import { fetchAPI } from "./api";
import { HeatPoint } from "@/types";
import { normalizePoint } from "@/utils";

export interface HeatmapQueryParams {
  year?: string;
  month?: string;
  vehicle?: string;
}

interface BackendResponse {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  total?: number;
}

export async function fetchHeatmapData(
  params: HeatmapQueryParams = {}
): Promise<HeatPoint[]> {
  const qs = new URLSearchParams();
  const now = new Date();
  qs.set("year", params.year || String(now.getFullYear()));
  qs.set("month", params.month || String(now.getMonth() + 1).padStart(2, "0"));
  if (params.vehicle) qs.set("vehicle_id", params.vehicle);
  qs.set("limit", "300000");

  const result = await fetchAPI<BackendResponse>(
    `/vehicles/fretadao/heatmap?${qs.toString()}`
  );

  if (!result.success || !result.data) {
    throw new Error("Formato de dados inválido");
  }

  return result.data.map(normalizePoint);
}
