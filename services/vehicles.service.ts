import { fetchAPI } from "./api";
import { Vehicle } from "@/types";

export interface VehiclesResponse {
  vehicles: Vehicle[];
  total: number;
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const result = await fetchAPI<VehiclesResponse>("/api/vehicles");
    return result.vehicles || [];
  } catch {
    return [];
  }
}

export async function fetchVehicleById(plate: string): Promise<Vehicle | null> {
  try {
    return await fetchAPI<Vehicle>(`/api/vehicles/${plate}`);
  } catch {
    return null;
  }
}
