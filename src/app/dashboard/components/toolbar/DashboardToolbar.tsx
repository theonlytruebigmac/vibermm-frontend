"use client";

import { useState } from 'react';
import { IoSave, IoRefresh, IoGrid } from 'react-icons/io5';
import { AddWidgetButton } from './AddWidgetButton';
import { TemplateSelector } from './TemplateSelector';
import { useDashboard } from '@/contexts/dashboard';
import { Layout } from 'react-grid-layout';

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
          <button
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
          >
            <IoGrid className="w-5 h-5" />
            <span>Layout Presets</span>
          </button>

          {isPresetsOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
              {Object.entries(LAYOUT_PRESETS).map(([name]) => (
                <button
                  key={name}
                  onClick={() => applyPreset(name as keyof typeof LAYOUT_PRESETS)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {name} Grid
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveLayout}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
        >
          <IoSave className="w-5 h-5" />
          <span>Save Layout</span>
        </button>
        
        <button
          onClick={handleLoadLayout}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
        >
          <IoRefresh className="w-5 h-5" />
          <span>Load Layout</span>
        </button>
      </div>
    </div>
  );
}
