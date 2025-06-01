"use client";

import { useState, useCallback, useEffect } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useDashboard } from '@/contexts/dashboard';
import { WidgetType } from '@/types';
import { defaultWidgetData as defaultData } from '@/constants/dashboard';

const WIDGET_TYPES: { type: WidgetType; label: string }[] = [
  { type: 'line', label: 'Line Chart' },
  { type: 'bar', label: 'Bar Chart' },
  { type: 'doughnut', label: 'Doughnut Chart' },
  { type: 'stats', label: 'Statistics' },
  { type: 'table', label: 'Table' },
];

export function AddWidgetButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { addWidget } = useDashboard();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.widget-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleAddWidget = useCallback((type: WidgetType) => {
    addWidget({
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      data: defaultData[type] || defaultData.line,
    });
    setIsOpen(false);
  }, [addWidget]);

  return (
    <div className="relative widget-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
      >
        <IoAdd className="w-5 h-5" />
        Add Widget
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" aria-hidden="true" />
          <div 
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-30"
            role="menu"
            aria-orientation="vertical"
          >
            {WIDGET_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleAddWidget(type)}
                className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900 first:rounded-t-lg last:rounded-b-lg text-gray-700 dark:text-gray-200"
                role="menuitem"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
