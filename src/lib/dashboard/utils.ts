import { WidgetType } from '@/types';

export const getDefaultData = (type: WidgetType) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  switch (type) {
    case 'bar':
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Devices',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: '#818cf8',
          },
        ],
        options: defaultOptions,
      };

    case 'line':
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Active Alerts',
            data: [12, 19, 3, 5, 2, 3, 7],
            borderColor: '#6366f1',
            tension: 0.4,
          },
        ],
        options: defaultOptions,
      };

    case 'doughnut':
      return {
        labels: ['Online', 'Offline', 'Maintenance'],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
          },
        ],
        options: {
          ...defaultOptions,
          plugins: {
            ...defaultOptions.plugins,
            legend: {
              position: 'bottom' as const,
            },
          },
        },
      };

    default:
      return {
        labels: [],
        datasets: [],
        options: defaultOptions,
      };
  }
};
