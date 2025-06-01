"use client";

import { ReactNode } from 'react';
import type { Widget as WidgetType } from '@/types/widget';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { IoClose } from 'react-icons/io5';
import { FiSettings } from 'react-icons/fi';

interface WidgetProps {
  widget: WidgetType;
  onRemove: (id: string) => void;
  onSettingsClick?: (id: string) => void;
  children?: ReactNode;
}

export function Widget({ widget, onRemove, onSettingsClick, children }: WidgetProps) {
  const renderContent = () => {
    switch (widget.type) {
      case 'line':
        return <Line data={widget.data} options={widget.settings?.chartOptions} />;
      case 'bar':
        return <Bar data={widget.data} options={widget.settings?.chartOptions} />;
      case 'doughnut':
        return <Doughnut data={widget.data} options={widget.settings?.chartOptions} />;
      case 'stats':
        return children;
      case 'table':
        return children;
      default:
        return <div>Invalid widget type</div>;
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{widget.title}</h3>
        <div className="flex items-center gap-2">
          {onSettingsClick && (
            <button
              onClick={() => onSettingsClick(widget.id)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <FiSettings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          )}
          <button
            onClick={() => onRemove(widget.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <IoClose className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
}