export type Dataset = {
  label?: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  hoverOffset?: number;
};

export type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

export type ChartOptions = {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      grid?: {
        display?: boolean;
      };
    };
    y?: {
      display?: boolean;
      grid?: {
        display?: boolean;
      };
    };
  };
};

export type WidgetSettings = {
  chartOptions?: ChartOptions;
  refreshInterval?: number;
  displayMode?: 'compact' | 'detailed';
  columns?: string[];
};

export type WidgetType = 'line' | 'bar' | 'doughnut' | 'stats' | 'table';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  data: ChartData;
  settings?: WidgetSettings;
}
