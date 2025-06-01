"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Layout } from 'react-grid-layout';
import { Widget as BaseWidget, WidgetSettings } from '@/types';

const STORAGE_KEY = 'vibermm-dashboard-state';

export interface Widget extends Omit<BaseWidget, 'settings'> {
  id: string;
  layout: Layout;
  settings?: WidgetSettings;
}

interface DashboardContextType {
  widgets: Widget[];
  addWidget: (widget: Omit<Widget, 'id' | 'layout'>) => void;
  removeWidget: (id: string) => void;
  updateWidgetLayout: (layout: Layout[]) => void;
  updateWidgetSettings: (id: string, settings: Partial<WidgetSettings>) => void;
  updateWidgetTitle: (id: string, title: string) => void;
  applyTemplate: (templateId: string) => void;
  clearDashboard: () => void;
  saveCurrentAsTemplate: (name: string, description: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  // Load saved state from localStorage with settings migration
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        const migratedWidgets = (parsedState.widgets || []).map((widget: Widget) => ({
          ...widget,
          settings: {
            chartOptions: widget.settings?.chartOptions || {},
            refreshInterval: widget.settings?.refreshInterval || 0,
            displayMode: widget.settings?.displayMode || 'detailed',
            isSettingsOpen: false,
            title: widget.title
          }
        }));
        setWidgets(migratedWidgets);
      } catch (error) {
        console.error('Error loading dashboard state:', error);
        // Fallback to empty state on error
        setWidgets([]);
      }
    }
  }, []);

  // Save state with debouncing
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ widgets }));
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [widgets]);

  const addWidget = (widget: Omit<Widget, 'id' | 'layout'>) => {
    const id = `widget-${Date.now()}`;
    const x = (widgets.length * 3) % 12;
    const y = Math.floor(widgets.length / 4) * 2;
    
    const newWidget: Widget = {
      ...widget,
      id,
      layout: {
        i: id,
        x,
        y,
        w: 3,
        h: 2,
        minW: 2,
        maxW: 12,
        minH: 2,
        maxH: 6,
      },
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    // Remove widget from state
    setWidgets(widgets.filter(widget => widget.id !== id));
    
    // Clean up stored layouts
    const storedLayouts = localStorage.getItem('dashboard-layouts');
    if (storedLayouts) {
      try {
        const layouts = JSON.parse(storedLayouts);
        // Remove the widget from all breakpoint layouts
        Object.keys(layouts).forEach(breakpoint => {
          layouts[breakpoint] = layouts[breakpoint].filter((item: Layout) => item.i !== id);
        });
        localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
      } catch (error) {
        console.error('Error cleaning up layouts:', error);
      }
    }
  };

  const updateWidgetLayout = (newLayout: Layout[]) => {
    setWidgets(widgets.map(widget => {
      const layout = newLayout.find(item => item.i === widget.id);
      if (!layout) return widget;
      
      return {
        ...widget,
        layout: {
          ...widget.layout,
          ...layout,
          minW: 2,
          maxW: 12,
          minH: 2,
          maxH: 6,
        }
      };
    }));
  };

  const updateWidgetSettings = (id: string, settings: Partial<WidgetSettings>) => {
    setWidgets(widgets.map(widget => 
      widget.id === id 
        ? { ...widget, settings: { ...(widget.settings || {}), ...settings } }
        : widget
    ));
  };

  const updateWidgetTitle = (id: string, title: string) => {
    setWidgets(widgets.map(widget =>
      widget.id === id ? { ...widget, title } : widget
    ));
  };

  // Add missing template-related functions
  const applyTemplate = (templateId: string) => {
    // This would typically load a template from a predefined set or API
    console.log('Applying template with ID:', templateId);
    // Placeholder implementation - would be expanded with actual template loading
  };

  const clearDashboard = () => {
    setWidgets([]);
    localStorage.removeItem('dashboard-layouts');
  };

  const saveCurrentAsTemplate = (name: string, description: string) => {
    // This would typically save the current dashboard as a template
    console.log('Saving current dashboard as template:', name, description);
    // Placeholder implementation - would save to localStorage, database, or API
  };

  return (
    <DashboardContext.Provider value={{
      widgets,
      addWidget,
      removeWidget,
      updateWidgetLayout,
      updateWidgetSettings,
      updateWidgetTitle,
      applyTemplate,
      clearDashboard,
      saveCurrentAsTemplate,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
