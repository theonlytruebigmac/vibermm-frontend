import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Device, DeviceMetrics, Alert, Asset, AutomationRule, ChartData } from '@/types';

interface UseApiResponse<T> {
  data: T;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useApi<T>(
  fetchFn: () => Promise<T>,
  deps: readonly unknown[] = []
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null) as [T, (value: T) => void];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
    } catch (error: unknown) {
      setError(error instanceof Error ? error : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return {
    data: data as T,
    loading,
    error,
    refetch: fetchData,
  };
}

export function useDevices(): UseApiResponse<Device[]> {
  return useApi<Device[]>(() => api.getDevices());
}

export function useMetrics(deviceId: string): UseApiResponse<DeviceMetrics> {
  return useApi<DeviceMetrics>(
    () => api.getMetrics(deviceId),
    [deviceId]
  );
}

export function useAlerts(): UseApiResponse<Alert[]> {
  return useApi<Alert[]>(() => api.getAlerts());
}

export function useAssets(): UseApiResponse<Asset[]> {
  return useApi<Asset[]>(() => api.getAssets());
}

export function useRules(): UseApiResponse<AutomationRule[]> {
  return useApi<AutomationRule[]>(() => api.getRules());
}

export function useDashboardData(): UseApiResponse<{
  devices: number;
  alerts: number;
  uptime: number;
  stats: ChartData;
}> {
  return useApi(() => api.getDashboardData());
}
