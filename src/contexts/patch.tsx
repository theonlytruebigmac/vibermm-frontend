"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types
export interface PatchStatus {
  id: string;
  deviceId: string;
  deviceName: string;
  osType: string;
  osVersion: string;
  critical: number;
  important: number;
  moderate: number;
  low: number;
  lastScanned: string;
  status: 'Up to Date' | 'Needs Attention' | 'Critical' | 'Not Assessed';
}

export interface PatchProfile {
  id: string;
  name: string;
  description: string;
  deviceCount: number;
  lastModified: string;
  settings: {
    autoApprove: boolean;
    autoApproveCategories: string[];
    schedule: {
      enabled: boolean;
      type: 'daily' | 'weekly' | 'monthly';
      time: string;
      days?: string[];
      date?: number;
    };
  };
}

export interface DeploymentRule {
  id: string;
  name: string;
  description: string;
  schedule: string;
  targets: string;
  status: 'Active' | 'Paused';
  conditions: {
    type: string;
    value: string;
  }[];
  actions: {
    type: string;
    value: string;
  }[];
}

interface PatchContextType {
  patchStatusList: PatchStatus[];
  profiles: PatchProfile[];
  deploymentRules: DeploymentRule[];
  stats: {
    upToDate: number;
    needsAttention: number;
    critical: number;
    notAssessed: number;
  };
  refreshPatchStatus: () => Promise<void>;
  addProfile: (profile: Omit<PatchProfile, 'id'>) => Promise<void>;
  updateProfile: (id: string, profile: Partial<PatchProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  addDeploymentRule: (rule: Omit<DeploymentRule, 'id'>) => Promise<void>;
  updateDeploymentRule: (id: string, rule: Partial<DeploymentRule>) => Promise<void>;
  deleteDeploymentRule: (id: string) => Promise<void>;
  deployPatches: (deviceIds: string[]) => Promise<void>;
}

const PatchContext = createContext<PatchContextType | undefined>(undefined);

export function PatchProvider({ children }: { children: ReactNode }) {
  const [patchStatusList, setPatchStatusList] = useState<PatchStatus[]>([]);
  const [profiles, setProfiles] = useState<PatchProfile[]>([]);
  const [deploymentRules, setDeploymentRules] = useState<DeploymentRule[]>([]);
  const [stats, setStats] = useState({
    upToDate: 0,
    needsAttention: 0,
    critical: 0,
    notAssessed: 0
  });

  // Load initial data
  useEffect(() => {
    // Simulate API calls
    const loadData = async () => {
      await refreshPatchStatus();
      
      // Load profiles from API (simulated)
      setProfiles([
        {
          id: '1',
          name: 'Default Profile',
          description: 'Default patch settings for all devices',
          deviceCount: 45,
          lastModified: '2025-05-15',
          settings: {
            autoApprove: true,
            autoApproveCategories: ['security', 'critical'],
            schedule: {
              enabled: true,
              type: 'weekly',
              time: '22:00',
              days: ['Sunday']
            }
          }
        },
        {
          id: '2',
          name: 'Servers',
          description: 'Conservative patching for production servers',
          deviceCount: 12,
          lastModified: '2025-05-20',
          settings: {
            autoApprove: false,
            autoApproveCategories: ['critical'],
            schedule: {
              enabled: true,
              type: 'monthly',
              time: '01:00',
              date: 15
            }
          }
        },
      ]);
      
      // Load deployment rules from API (simulated)
      setDeploymentRules([
        {
          id: '1',
          name: 'Workstation Business Hours',
          description: 'Deploy patches to workstations during business hours',
          schedule: 'Weekdays, 10:00 AM - 4:00 PM',
          targets: 'All Workstations',
          status: 'Active',
          conditions: [
            { type: 'deviceType', value: 'workstation' },
            { type: 'online', value: 'true' }
          ],
          actions: [
            { type: 'install', value: 'approved' },
            { type: 'restart', value: 'ifNeeded' }
          ]
        },
        {
          id: '2',
          name: 'Server Maintenance Window',
          description: 'Deploy patches to servers during maintenance window',
          schedule: 'Sundays, 1:00 AM - 5:00 AM',
          targets: 'Production Servers',
          status: 'Active',
          conditions: [
            { type: 'deviceType', value: 'server' },
            { type: 'tag', value: 'production' }
          ],
          actions: [
            { type: 'install', value: 'approved' },
            { type: 'restart', value: 'scheduled' }
          ]
        },
      ]);
    };
    
    loadData();
  }, []);

  // Refresh patch status data
  const refreshPatchStatus = async (): Promise<void> => {
    // Simulate API call
    const mockData: PatchStatus[] = [
      {
        id: '1',
        deviceId: 'device-1',
        deviceName: 'DESKTOP-001',
        osType: 'Windows',
        osVersion: 'Windows 10',
        critical: 0,
        important: 2,
        moderate: 5,
        low: 3,
        lastScanned: '2025-05-28',
        status: 'Needs Attention'
      },
      {
        id: '2',
        deviceId: 'device-2',
        deviceName: 'SERVER-DB-01',
        osType: 'Windows',
        osVersion: 'Windows Server 2022',
        critical: 1,
        important: 3,
        moderate: 0,
        low: 0,
        lastScanned: '2025-05-20',
        status: 'Critical'
      },
      {
        id: '3',
        deviceId: 'device-3',
        deviceName: 'DESKTOP-002',
        osType: 'Windows',
        osVersion: 'Windows 11',
        critical: 0,
        important: 0,
        moderate: 0,
        low: 1,
        lastScanned: '2025-05-30',
        status: 'Up to Date'
      },
    ];

    setPatchStatusList(mockData);

    // Calculate stats
    const upToDate = mockData.filter(item => item.status === 'Up to Date').length;
    const needsAttention = mockData.filter(item => item.status === 'Needs Attention').length;
    const critical = mockData.filter(item => item.status === 'Critical').length;
    const notAssessed = mockData.filter(item => item.status === 'Not Assessed').length;

    setStats({
      upToDate,
      needsAttention,
      critical,
      notAssessed
    });
  };

  // CRUD operations for profiles
  const addProfile = async (profile: Omit<PatchProfile, 'id'>): Promise<void> => {
    // Simulate API call
    const newProfile: PatchProfile = {
      ...profile,
      id: `profile-${Date.now()}`
    };

    setProfiles(prev => [...prev, newProfile]);
  };

  const updateProfile = async (id: string, profile: Partial<PatchProfile>): Promise<void> => {
    // Simulate API call
    setProfiles(prev => 
      prev.map(p => p.id === id ? { ...p, ...profile } : p)
    );
  };

  const deleteProfile = async (id: string): Promise<void> => {
    // Simulate API call
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  // CRUD operations for deployment rules
  const addDeploymentRule = async (rule: Omit<DeploymentRule, 'id'>): Promise<void> => {
    // Simulate API call
    const newRule: DeploymentRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };

    setDeploymentRules(prev => [...prev, newRule]);
  };

  const updateDeploymentRule = async (id: string, rule: Partial<DeploymentRule>): Promise<void> => {
    // Simulate API call
    setDeploymentRules(prev => 
      prev.map(r => r.id === id ? { ...r, ...rule } : r)
    );
  };

  const deleteDeploymentRule = async (id: string): Promise<void> => {
    // Simulate API call
    setDeploymentRules(prev => prev.filter(r => r.id !== id));
  };

  // Deploy patches to devices
  const deployPatches = async (deviceIds: string[]): Promise<void> => {
    // Simulate API call
    console.log('Deploying patches to devices:', deviceIds);
    // In a real app, you would call your API to deploy patches
  };

  return (
    <PatchContext.Provider value={{
      patchStatusList,
      profiles,
      deploymentRules,
      stats,
      refreshPatchStatus,
      addProfile,
      updateProfile,
      deleteProfile,
      addDeploymentRule,
      updateDeploymentRule,
      deleteDeploymentRule,
      deployPatches
    }}>
      {children}
    </PatchContext.Provider>
  );
}

export function usePatch() {
  const context = useContext(PatchContext);
  if (context === undefined) {
    throw new Error('usePatch must be used within a PatchProvider');
  }
  return context;
}
