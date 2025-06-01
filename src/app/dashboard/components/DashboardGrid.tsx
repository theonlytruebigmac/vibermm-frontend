"use client";

import GridLayout from 'react-grid-layout';
import { Widget } from './widgets';
import { useDashboard } from '@/contexts/dashboard';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export function DashboardGrid() {
  const { widgets, removeWidget, updateWidgetLayout } = useDashboard();

  const handleLayoutChange = (newLayout: GridLayout.Layout[]) => {
    updateWidgetLayout(newLayout);
  };

  return (
    <GridLayout
      className="layout"
      layout={widgets.map(w => w.layout)}
      cols={12}
      rowHeight={100}
      width={1200}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".drag-handle"
    >
      {widgets.map((widget) => (
        <div key={widget.id}>
          <Widget
            widget={widget}
            onRemove={removeWidget}
          />
        </div>
      ))}
    </GridLayout>
  );
}
