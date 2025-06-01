export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: string;
  osType: 'windows' | 'linux' | 'mac';
  ipAddress: string;
  macAddress: string;
  specs?: {
    cpu?: string;
    memory?: string;
    disk?: string;
  };
}

export interface DeviceMetrics {
  cpu: {
    usage: number;
    temperature: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
  network: {
    download: number;
    upload: number;
  };
}

export interface Alert {
  id: string;
  deviceId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate?: string;
  warrantyExpiration?: string;
  assignedTo?: string;
  location?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  conditions: {
    type: string;
    operator: string;
    value: string | number;
  }[];
  actions: {
    type: string;
    params: Record<string, string | number>;
  }[];
  enabled: boolean;
  lastTriggered?: string;
}
