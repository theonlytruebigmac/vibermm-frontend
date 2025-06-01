import { ChartData, Device, DeviceMetrics, Alert, Asset, AutomationRule } from '@/types';

export interface ApiService {
  // Device Management
  getDevices(): Promise<Device[]>;
  updateDevice(id: string, data: Partial<Device>): Promise<Device>;
  
  // Monitoring
  getMetrics(deviceId: string): Promise<DeviceMetrics>;
  getAlerts(): Promise<Alert[]>;
  
  // Dashboard
  getDashboardData(): Promise<{
    devices: number;
    alerts: number;
    uptime: number;
    stats: ChartData;
  }>;
  
  // Asset Inventory
  getAssets(): Promise<Asset[]>;
  
  // Rules & Automation
  getRules(): Promise<AutomationRule[]>;
  createRule(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule>;
}

class RmmApiService implements ApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  private async fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getDevices(): Promise<Device[]> {
    return this.fetchJson<Device[]>('/devices');
  }

  async updateDevice(id: string, data: Partial<Device>): Promise<Device> {
    return this.fetchJson<Device>(`/devices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getMetrics(deviceId: string): Promise<DeviceMetrics> {
    return this.fetchJson<DeviceMetrics>(`/devices/${deviceId}/metrics`);
  }

  async getAlerts(): Promise<Alert[]> {
    return this.fetchJson<Alert[]>('/alerts');
  }

  async getDashboardData(): Promise<{
    devices: number;
    alerts: number;
    uptime: number;
    stats: ChartData;
  }> {
    return this.fetchJson('/dashboard/summary');
  }

  async getAssets(): Promise<Asset[]> {
    return this.fetchJson<Asset[]>('/assets');
  }

  async getRules(): Promise<AutomationRule[]> {
    return this.fetchJson<AutomationRule[]>('/rules');
  }

  async createRule(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> {
    return this.fetchJson<AutomationRule>('/rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }
}

export const api = new RmmApiService(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');
