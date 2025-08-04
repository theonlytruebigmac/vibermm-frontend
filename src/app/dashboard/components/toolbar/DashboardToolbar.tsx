"use client";

import { useState } from 'react';
import { IoSave, IoRefresh, IoGrid } from 'react-icons/io5';
import { AddWidgetButton } from './AddWidgetButton';
import { TemplateSelector } from './TemplateSelector';
import { useDashboard } from '@/contexts/dashboard';
import { Layout } from 'react-grid-layout';
import { Button } from '@/components/ui';

const LAYOUT_PRESETS = {
  '2x2': { cols: 2 },
  '3x2': { cols: 3 },
  '4x2': { cols: 4 },
};

export function DashboardToolbar() {
  const { widgets, updateWidgetLayout } = useDashboard();
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const handleSaveLayout = () => {
    const currentLayout = widgets.map(w => w.layout);
    localStorage.setItem('saved-layout', JSON.stringify(currentLayout));
  };

  const handleLoadLayout = () => {
    const savedLayout = localStorage.getItem('saved-layout');
    if (savedLayout) {
      try {
        const layout = JSON.parse(savedLayout) as Layout[];
        updateWidgetLayout(layout);
      } catch (error) {
        console.error('Error loading layout:', error);
      }
    }
  };

  const applyPreset = (preset: keyof typeof LAYOUT_PRESETS) => {
    const { cols } = LAYOUT_PRESETS[preset];
    const newLayout: Layout[] = widgets.map((widget, index) => ({
      ...widget.layout,
      w: 12 / cols,
      h: 2,
      x: (index % cols) * (12 / cols),
      y: Math.floor(index / cols) * 2,
    }));
    updateWidgetLayout(newLayout);
    setIsPresetsOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4">
      <div className="flex items-center gap-2">
        <AddWidgetButton />
        <TemplateSelector />
        
        <div className="relative">
          <Button
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <IoGrid className="w-5 h-5" />
            <span>Layout Presets</span>
          </Button>

          {isPresetsOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
              {Object.entries(LAYOUT_PRESETS).map(([name]) => (
                <Button
                  key={name}
                  onClick={() => applyPreset(name as keyof typeof LAYOUT_PRESETS)}
                  variant="ghost"
                  className="w-full justify-start"
                >
                  {name} Grid
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          onClick={handleSaveLayout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <IoSave className="w-5 h-5" />
          <span>Save Layout</span>
        </Button>
        
        <Button
          onClick={handleLoadLayout}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <IoRefresh className="w-5 h-5" />
          <span>Load Layout</span>
        </Button>
      </div>
    </div>
  );
}
