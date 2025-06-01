"use client";

import { useState, useEffect } from 'react';
import { useDataSources, DataSource } from '@/contexts/datasource';
import { IoCheckmark, IoClose, IoRefresh } from 'react-icons/io5';

interface DataSourceSelectorProps {
  selectedSourceId?: string;
  onSelect: (sourceId: string) => void;
  widgetType: string;
}

export function DataSourceSelector({ selectedSourceId, onSelect, widgetType }: DataSourceSelectorProps) {
  const { dataSources, testConnection } = useDataSources();
  const [filteredSources, setFilteredSources] = useState<DataSource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  // Filter data sources based on widget type and search query
  useEffect(() => {
    let sources = [...dataSources];
    
    // Filter based on search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      sources = sources.filter(
        source => 
          source.name.toLowerCase().includes(query) || 
          source.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredSources(sources);
  }, [dataSources, searchQuery, widgetType]);

  const handleTestConnection = async (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    if (!source) return;
    
    setTestingId(sourceId);
    try {
      const success = await testConnection(source.config);
      setTestResults(prev => ({ ...prev, [sourceId]: success }));
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResults(prev => ({ ...prev, [sourceId]: false }));
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Select Data Source</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose a data source for this widget
        </p>
        
        {/* Search */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search data sources..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {filteredSources.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No matching data sources found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSources.map(source => (
              <div 
                key={source.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  selectedSourceId === source.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
                onClick={() => onSelect(source.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{source.name}</h4>
                      {selectedSourceId === source.id && (
                        <IoCheckmark className="ml-2 text-blue-500 w-5 h-5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {source.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                        {source.config.type}
                      </span>
                      {source.config.refreshInterval && (
                        <span className="ml-2 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                          {source.config.refreshInterval}s refresh
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestConnection(source.id);
                    }}
                    className={`p-1.5 rounded-full ${
                      testingId === source.id
                        ? 'bg-gray-200 dark:bg-gray-600'
                        : testResults[source.id] === true
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : testResults[source.id] === false
                        ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {testingId === source.id ? (
                      <div className="w-4 h-4 border-2 border-t-transparent border-gray-500 rounded-full animate-spin" />
                    ) : testResults[source.id] === true ? (
                      <IoCheckmark className="w-4 h-4" />
                    ) : testResults[source.id] === false ? (
                      <IoClose className="w-4 h-4" />
                    ) : (
                      <IoRefresh className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}