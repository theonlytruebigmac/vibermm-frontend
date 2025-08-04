"use client";

import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useDashboard } from '@/contexts/dashboard';
import { WidgetType, ChartData } from '@/types';
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

  const handleAddWidget = (type: WidgetType) => {
    const widgetData: Record<WidgetType, ChartData> = {
      line: defaultData.line,
      bar: defaultData.bar, // Changed from defaultData.ticketDistribution
      doughnut: defaultData.doughnut, // Changed from defaultData.ticketStatuses
      stats: defaultData.stats, // Changed from defaultData.ticketsByDay
      table: defaultData.table, // Changed from defaultData.ticketDistribution
    };

    addWidget({
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      data: widgetData[type],
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <IoAdd className="w-5 h-5" />
        Add Widget
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {WIDGET_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleAddWidget(type)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
