"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import { Widget } from '../widgets/Widget';
import { useDashboard } from '@/contexts/dashboard';
import type { Widget as WidgetType } from '@/contexts/dashboard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './DashboardGrid.css';
import './draggable.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const ResponsiveGridLayout = WidthProvider(Responsive);

const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

// Widget layout constraints
const LAYOUT_CONSTRAINTS = {
  minW: 2,
  maxW: 12,
  minH: 2,
  maxH: 6,
};

type Breakpoint = keyof typeof COLS;
type Layouts = Record<Breakpoint, Layout[]>;

const getInitialBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'lg';
  return (Object.keys(BREAKPOINTS).find(
    bp => window.innerWidth >= BREAKPOINTS[bp as Breakpoint]
  ) as Breakpoint) || 'lg';
};

export function DashboardGrid() {
  const { widgets, removeWidget, updateWidgetLayout, updateWidgetSettings } = useDashboard();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');
  const layoutsRef = useRef<Layouts | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLayoutRef = useRef<string | null>(null);

  // Handle initial mounting and cleanup
  useEffect(() => {
    setMounted(true);
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Load saved layouts
  const initializeLayouts = useCallback(() => {
    const initialBreakpoint = getInitialBreakpoint();
    setCurrentBreakpoint(initialBreakpoint);

    const savedLayouts = localStorage.getItem('dashboard-layouts');
    if (!savedLayouts) return;

    try {
      const parsedLayouts = JSON.parse(savedLayouts);
      layoutsRef.current = parsedLayouts;
      if (parsedLayouts[initialBreakpoint]) {
        const layoutJson = JSON.stringify(parsedLayouts[initialBreakpoint]);
        if (layoutJson !== lastLayoutRef.current) {
          lastLayoutRef.current = layoutJson;
          updateWidgetLayout(parsedLayouts[initialBreakpoint]);
        }
      }
    } catch (error) {
      console.error('Error loading layouts:', error);
    }
  }, [updateWidgetLayout]);

  // Initialize layouts when component is mounted
  useEffect(() => {
    if (mounted) {
      initializeLayouts();
    }
  }, [mounted, initializeLayouts]);

  const generateLayout = useCallback((widgets: WidgetType[], breakpoint: Breakpoint) => {
    return widgets.map(widget => {
      // Calculate optimal width based on breakpoint
      const optimalWidth = Math.min(
        widget.layout?.w || 3,
        Math.min(COLS[breakpoint], LAYOUT_CONSTRAINTS.maxW)
      );

      // Calculate position to avoid overlaps
      const index = widgets.indexOf(widget);
      const colsInBreakpoint = COLS[breakpoint];
      const x = widget.layout?.x ?? (index * optimalWidth) % colsInBreakpoint;
      const y = widget.layout?.y ?? Math.floor((index * optimalWidth) / colsInBreakpoint) * LAYOUT_CONSTRAINTS.minH;

      return {
        ...widget.layout,
        i: widget.id,
        w: optimalWidth,
        h: widget.layout?.h || LAYOUT_CONSTRAINTS.minH,
        x,
        y,
        minW: LAYOUT_CONSTRAINTS.minW,
        maxW: Math.min(COLS[breakpoint], LAYOUT_CONSTRAINTS.maxW),
        minH: LAYOUT_CONSTRAINTS.minH,
        maxH: LAYOUT_CONSTRAINTS.maxH,
        isDraggable: true,
        isResizable: true,
      };
    });
  }, []);

  const layouts = useMemo((): Layouts => ({
    lg: generateLayout(widgets, 'lg'),
    md: generateLayout(widgets, 'md'),
    sm: generateLayout(widgets, 'sm'),
    xs: generateLayout(widgets, 'xs'),
    xxs: generateLayout(widgets, 'xxs'),
  }), [widgets, generateLayout]);

  // Layout update with performance optimizations
  const handleLayoutChange = useCallback((currentLayout: Layout[], allLayouts: Layouts) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    const layoutJson = JSON.stringify(currentLayout);
    if (layoutJson === lastLayoutRef.current) return;

    // Skip layout updates during dragging operations to avoid jittering
    const isDragging = currentLayout.some(item => 
      document.querySelector(`[data-grid-id="${item.i}"]`)?.classList.contains('react-draggable-dragging')
    );
    
    if (isDragging) return;

    // Batch updates with RAF for better performance
    requestAnimationFrame(() => {
      // Validate and normalize layout
      const normalizedLayout = currentLayout.map(item => ({
        ...item,
        w: Math.min(Math.max(item.w, LAYOUT_CONSTRAINTS.minW), COLS[currentBreakpoint]),
        h: Math.min(Math.max(item.h, LAYOUT_CONSTRAINTS.minH), LAYOUT_CONSTRAINTS.maxH),
        x: Math.max(0, Math.min(item.x, COLS[currentBreakpoint] - item.w)),
        y: Math.max(0, item.y),
      }));

      updateTimeoutRef.current = setTimeout(() => {
        lastLayoutRef.current = JSON.stringify(normalizedLayout);
        updateWidgetLayout(normalizedLayout);
        layoutsRef.current = {
          ...allLayouts,
          [currentBreakpoint]: normalizedLayout,
        };
        
        // Debounced layout saving
        if (typeof window !== 'undefined') {
          const layoutSaveTimeout = setTimeout(() => {
            localStorage.setItem('dashboard-layouts', JSON.stringify(layoutsRef.current));
          }, 500);
          return () => clearTimeout(layoutSaveTimeout);
        }
      }, 50); // Reduced timeout for more responsive feel
    });
  }, [updateWidgetLayout, currentBreakpoint]);

  const handleBreakpointChange = useCallback((newBreakpoint: Breakpoint) => {
    setCurrentBreakpoint(newBreakpoint);
    
    // Optimize layout for new breakpoint
    const optimizedLayout = generateLayout(widgets, newBreakpoint);
    updateWidgetLayout(optimizedLayout);
  }, [widgets, generateLayout, updateWidgetLayout]);

  // Handle drag events
  const handleDragStart = useCallback((layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {
    // Add a class to the body to indicate dragging state
    document.body.classList.add('widget-dragging');
    
    // Optional: Show visual feedback
    element.style.zIndex = '1000';
  }, []);

  const handleDragStop = useCallback((layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => {
    // Remove the dragging class
    document.body.classList.remove('widget-dragging');
    
    // Reset any styling
    element.style.zIndex = '';
    
    // Process the final layout
    updateWidgetLayout(layout);
  }, [updateWidgetLayout]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="w-full min-h-[200px]">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={100}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={handleBreakpointChange}
        breakpoint={currentBreakpoint}
        draggableHandle=".drag-handle"
        resizeHandles={['se']}
        compactType="vertical"
        preventCollision={false}
        isResizable={true}
        isDraggable={true}
        useCSSTransforms={true}
        transformScale={1}
        isBounded={true}
        measureBeforeMount={false}
        droppingItem={{ i: 'new', w: 3, h: 2 }}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
      >
        {widgets.map((widget) => (
          <div 
            key={widget.id} 
            className="transition-all duration-200 ease-in-out h-full w-full"
            data-grid-id={widget.id}
          >
            <Widget
              widget={widget}
              onRemove={removeWidget}
              onSettingsClick={(id) => {
                const settings = widget.settings || {};
                updateWidgetSettings(id, {
                  ...settings,
                  isSettingsOpen: !settings.isSettingsOpen
                });
              }}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
