"use client";

import { IoCheckmarkCircle } from 'react-icons/io5';

type ChartTheme = {
  id: string;
  name: string;
  colors: string[];
  background?: string;
  gridColor?: string;
  textColor?: string;
};

interface ThemeSelectorProps {
  selectedTheme?: string;
  onSelect: (themeId: string) => void;
}

// Available chart themes
const themes: ChartTheme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
    background: 'transparent',
    gridColor: '#e5e7eb',
    textColor: '#374151'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: ['#0369a1', '#0891b2', '#0e7490', '#155e75', '#1e40af', '#1d4ed8'],
    background: 'transparent',
    gridColor: '#e5e7eb',
    textColor: '#1f2937'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    background: 'transparent',
    gridColor: '#d1d5db',
    textColor: '#111827'
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#a78bfa', '#93c5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#fdba74'],
    background: 'transparent',
    gridColor: '#e5e7eb',
    textColor: '#4b5563'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#c084fc', '#f472b6'],
    background: '#1f2937',
    gridColor: '#374151',
    textColor: '#e5e7eb'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    colors: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'],
    background: 'transparent',
    gridColor: '#e5e7eb',
    textColor: '#111827'
  }
];

export function ThemeSelector({ selectedTheme = 'default', onSelect }: ThemeSelectorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Chart Theme</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`cursor-pointer relative rounded-lg overflow-hidden border-2 transition-all ${
              selectedTheme === theme.id
                ? 'border-blue-500 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="h-20 w-full" style={{ background: theme.background || '#fff' }}>
              <div className="flex h-full">
                {theme.colors.slice(0, 6).map((color, i) => (
                  <div
                    key={`${theme.id}-${i}`}
                    className="h-full flex-grow"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="p-2 text-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {theme.name}
              </span>
            </div>
            
            {selectedTheme === theme.id && (
              <div className="absolute top-2 right-2">
                <IoCheckmarkCircle className="w-6 h-6 text-blue-500 bg-white dark:bg-gray-900 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Note: Theme changes will apply to newly created charts and when existing charts are updated.
      </div>
    </div>
  );
}