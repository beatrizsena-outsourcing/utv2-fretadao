"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboardStore } from "@/store/dashboard.store";
import { fetchHeatmapData } from "@/services/map.service";

export function useHeatmapData() {
  const setRawData = useDashboardStore((s) => s.setRawData);
  const setIsLoading = useDashboardStore((s) => s.setIsLoading);
  const selectedYear = useDashboardStore((s) => s.selectedYear);
  const selectedMonth = useDashboardStore((s) => s.selectedMonth);

  const query = useQuery({
    queryKey: ["heatmap-v3", selectedYear, selectedMonth],
    queryFn: () => fetchHeatmapData({ year: selectedYear, month: selectedMonth }),
    staleTime: 0,
    refetchInterval: false,
    retry: 2,
    gcTime: 0,
  });

  useEffect(() => {
    setIsLoading(query.isLoading || query.isFetching);
  }, [query.isLoading, query.isFetching, setIsLoading]);

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setRawData(query.data);
    }
  }, [query.data, setRawData]);

  return query;
}