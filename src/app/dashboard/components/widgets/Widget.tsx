"use client";

import { ReactNode, useState, useCallback, useEffect } from 'react';
import type { Widget as WidgetType, WidgetSettings } from '@/types/widget';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { IoClose } from 'react-icons/io5';
import { FiSettings, FiMove } from 'react-icons/fi';
import { useDashboard } from '@/contexts/dashboard';
import { DataSourceSelector } from './DataSourceSelector';
import { ThemeSelector } from './ThemeSelector';

interface WidgetProps {
  widget: WidgetType;
  onRemove: (id: string) => void;
  onSettingsClick?: (id: string) => void;
  children?: ReactNode;
}

export function Widget({ widget, onRemove, onSettingsClick, children }: WidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { updateWidgetTitle, updateWidgetSettings } = useDashboard();

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Updating...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 p-4">
      <div className="text-red-500">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">{loadError}</p>
      <button 
        onClick={() => {
          setLoadError(null);
          handleRefresh();
        }}
        className="px-3 py-1 text-sm bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  const handleRefresh = useCallback(async () => {
    if (!widget.settings?.refreshInterval) return;
    setIsLoading(true);
    setLoadError(null);
    
    try {
      // Add your data refresh logic here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulated API call
      setIsLoading(false);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to update widget');
      setIsLoading(false);
    }
  }, [widget.settings?.refreshInterval]);

  useEffect(() => {
    if (!widget.settings?.refreshInterval) return;
    
    handleRefresh();
    const interval = setInterval(handleRefresh, widget.settings.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [widget.settings?.refreshInterval, handleRefresh]);

  const handleSettingsChange = useCallback((key: keyof WidgetSettings, value: WidgetSettings[keyof WidgetSettings]) => {
    updateWidgetSettings(widget.id, { [key]: value });
  }, [widget.id, updateWidgetSettings]);

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (loadError) {
      return renderErrorState();
    }

    switch (widget.type) {
      case 'line':
        return (
          <div className="transition-opacity duration-200">
            <Line data={widget.data} options={widget.settings?.chartOptions} />
          </div>
        );
      case 'bar':
        return (
          <div className="transition-opacity duration-200">
            <Bar data={widget.data} options={widget.settings?.chartOptions} />
          </div>
        );
      case 'doughnut':
        return (
          <div className="transition-opacity duration-200">
            <Doughnut data={widget.data} options={widget.settings?.chartOptions} />
          </div>
        );
      case 'stats':
      case 'table':
        return (
          <div className="transition-opacity duration-200">
            {children}
          </div>
        );
      default:
        return <div>Invalid widget type</div>;
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md relative">
      {/* Visual overlay for active dragging - this will be triggered by react-grid-layout's CSS classes */}
      <div className="absolute inset-0 pointer-events-none bg-indigo-50 dark:bg-indigo-900 opacity-0 transition-opacity duration-200 react-draggable-dragging:opacity-20 z-10"></div>
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2 drag-handle cursor-move w-full">
          <FiMove className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2 min-w-0 flex-grow">
            <div className="truncate">
              {widget.title}
            </div>
          </h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onSettingsClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettingsClick(widget.id);
              }}
              className="nodrag p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Widget settings"
            >
              <FiSettings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(widget.id);
            }}
            className="nodrag p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <IoClose className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div className="relative">
        {widget.settings?.isSettingsOpen && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 z-10 p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Widget Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={widget.title}
                  onChange={(e) => updateWidgetTitle(widget.id, e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Refresh Interval</label>
                <select
                  value={widget.settings?.refreshInterval || 0}
                  onChange={(e) => handleSettingsChange('refreshInterval', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                >
                  <option value={0}>Never</option>
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Display Mode</label>
                <select
                  value={widget.settings?.displayMode || 'detailed'}
                  onChange={(e) => handleSettingsChange('displayMode', e.target.value as 'compact' | 'detailed')}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                >
                  <option value="compact">Compact</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              
              {/* Advanced Settings Tabs */}
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    className={`py-2 px-1 font-medium text-sm border-b-2 ${
                      widget.settings?.settingsTab === 'data-source' || !widget.settings?.settingsTab 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleSettingsChange('settingsTab', 'data-source')}
                  >
                    Data Source
                  </button>
                  <button
                    className={`py-2 px-1 font-medium text-sm border-b-2 ${
                      widget.settings?.settingsTab === 'appearance'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleSettingsChange('settingsTab', 'appearance')}
                  >
                    Appearance
                  </button>
                  <button
                    className={`py-2 px-1 font-medium text-sm border-b-2 ${
                      widget.settings?.settingsTab === 'advanced'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleSettingsChange('settingsTab', 'advanced')}
                  >
                    Advanced
                  </button>
                </div>
                
                <div className="mt-4">
                  {(widget.settings?.settingsTab === 'data-source' || !widget.settings?.settingsTab) && (
                    <>
                      <DataSourceSelector
                        selectedSourceId={widget.settings?.dataSourceId}
                        onSelect={(id) => handleSettingsChange('dataSourceId', id)}
                        widgetType={widget.type}
                      />
                    </>
                  )}
                  
                  {widget.settings?.settingsTab === 'appearance' && (
                    <>
                      <ThemeSelector
                        selectedTheme={widget.settings?.theme || 'default'}
                        onSelect={(themeId) => handleSettingsChange('theme', themeId)}
                      />
                    </>
                  )}
                  
                  {widget.settings?.settingsTab === 'advanced' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Chart Animation
                        </label>
                        <select
                          value={widget.settings?.animation ? 'enabled' : 'disabled'}
                          onChange={(e) => handleSettingsChange('animation', e.target.value === 'enabled')}
                          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="enabled">Enabled</option>
                          <option value="disabled">Disabled</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          Disable animations for improved performance on slower devices
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Viewport Behavior
                        </label>
                        <select
                          value={widget.settings?.viewportUpdate || 'all'}
                          onChange={(e) => handleSettingsChange('viewportUpdate', e.target.value)}
                          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="all">Update Always</option>
                          <option value="visible">Update When Visible</option>
                          <option value="manual">Manual Updates Only</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 transition-transform duration-200 ease-in-out">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}