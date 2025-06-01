"use client";

import { useState, useEffect, ReactNode, createContext, useContext } from 'react';

// Data source types and interfaces
export type DataSourceType = 'static' | 'api' | 'realtime';

export interface DataSourceConfig {
  type: DataSourceType;
  endpoint?: string;
  refreshInterval?: number;
  mockData?: boolean;
  credentials?: {
    apiKey?: string;
    username?: string;
    password?: string;
  };
}

export interface DataSource {
  id: string;
  name: string;
  description: string;
  config: DataSourceConfig;
  lastUpdated?: Date;
}

interface DataSourceContextType {
  dataSources: DataSource[];
  addDataSource: (dataSource: Omit<DataSource, 'id'>) => string;
  updateDataSource: (id: string, updates: Partial<Omit<DataSource, 'id'>>) => void;
  removeDataSource: (id: string) => void;
  getDataSourceById: (id: string) => DataSource | undefined;
  testConnection: (config: DataSourceConfig) => Promise<boolean>;
}

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

const STORAGE_KEY = 'vibermm-datasources';

// Predefined data sources
const defaultDataSources: DataSource[] = [
  {
    id: 'mock-system-metrics',
    name: 'System Metrics',
    description: 'CPU, Memory, and Disk usage metrics',
    config: {
      type: 'static',
      mockData: true,
      refreshInterval: 60,
    },
  },
  {
    id: 'mock-network-metrics',
    name: 'Network Metrics',
    description: 'Network traffic and performance metrics',
    config: {
      type: 'static',
      mockData: true,
      refreshInterval: 60,
    },
  },
];

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);

  // Load saved data sources
  useEffect(() => {
    const savedDataSources = localStorage.getItem(STORAGE_KEY);
    if (savedDataSources) {
      try {
        const parsed = JSON.parse(savedDataSources);
        setDataSources(parsed);
      } catch (error) {
        console.error('Error loading data sources:', error);
        setDataSources(defaultDataSources);
      }
    } else {
      setDataSources(defaultDataSources);
    }
  }, []);

  // Save to localStorage when data sources change
  useEffect(() => {
    if (dataSources.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataSources));
    }
  }, [dataSources]);

  const addDataSource = (dataSource: Omit<DataSource, 'id'>) => {
    const id = `datasource-${Date.now()}`;
    const newDataSource = { ...dataSource, id };
    setDataSources([...dataSources, newDataSource]);
    return id;
  };

  const updateDataSource = (id: string, updates: Partial<Omit<DataSource, 'id'>>) => {
    setDataSources(
      dataSources.map((source) =>
        source.id === id ? { ...source, ...updates, lastUpdated: new Date() } : source
      )
    );
  };

  const removeDataSource = (id: string) => {
    setDataSources(dataSources.filter((source) => source.id !== id));
  };

  const getDataSourceById = (id: string) => {
    return dataSources.find((source) => source.id === id);
  };

  // Test connection to a data source
  const testConnection = async (config: DataSourceConfig) => {
    // This would normally connect to an actual API endpoint
    // For now we'll simulate a successful connection
    if (config.type === 'api' && config.endpoint) {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          // Simulate 80% success rate
          resolve(Math.random() > 0.2);
        }, 1000);
      });
    }
    return Promise.resolve(true);
  };

  return (
    <DataSourceContext.Provider
      value={{
        dataSources,
        addDataSource,
        updateDataSource,
        removeDataSource,
        getDataSourceById,
        testConnection,
      }}
    >
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSources() {
  const context = useContext(DataSourceContext);
  if (context === undefined) {
    throw new Error('useDataSources must be used within a DataSourceProvider');
  }
  return context;
}
