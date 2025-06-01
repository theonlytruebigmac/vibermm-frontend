"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Layout } from 'react-grid-layout';
import { Widget as BaseWidget, WidgetSettings } from '@/types';

export interface Widget extends Omit<BaseWidget, 'settings'> {
  layout: Layout;
  settings?: WidgetSettings;
}

interface DashboardContextType {
  widgets: Widget[];
  addWidget: (widget: Omit<Widget, 'id' | 'layout'>) => void;
  removeWidget: (id: string) => void;
  updateWidgetLayout: (layout: Layout[]) => void;
  updateWidgetSettings: (id: string, settings: WidgetSettings) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  const addWidget = (widget: Omit<Widget, 'id' | 'layout'>) => {
    const id = `widget-${Date.now()}`;
    const newWidget: Widget = {
      ...widget,
      id,
      layout: {
        i: id,
        x: (widgets.length * 2) % 12,
        y: Math.floor(widgets.length / 6) * 2,
        w: 2,
        h: 2,
      },
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const updateWidgetLayout = (newLayout: Layout[]) => {
    setWidgets(widgets.map(widget => ({
      ...widget,
      layout: newLayout.find(item => item.i === widget.id) || widget.layout,
    })));
  };

  const updateWidgetSettings = (id: string, settings: WidgetSettings) => {
    setWidgets(widgets.map(widget =>
      widget.id === id ? { ...widget, settings: { ...widget.settings, ...settings } } : widget
    ));
  };

  return (
    <DashboardContext.Provider value={{
      widgets,
      addWidget,
      removeWidget,
      updateWidgetLayout,
      updateWidgetSettings,
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
