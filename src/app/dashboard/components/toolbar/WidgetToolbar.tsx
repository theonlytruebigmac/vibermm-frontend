"use client";

import { AddWidgetButton } from './AddWidgetButton';

export function WidgetToolbar() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-100">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-2">
        <AddWidgetButton />
      </div>
    </div>
  );
}