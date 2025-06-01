import { ChartData, WidgetType } from '@/types';

// Default data for different chart types
export const defaultWidgetData: Record<WidgetType, ChartData> = {
  bar: {
    labels: ["Sally", "Mark", "Pierce", "Mandy"],
    datasets: [
      {
        label: "New",
        data: [5, 7, 3, 4],
        backgroundColor: "#a5b4fc"
      },
      {
        label: "In Progress",
        data: [3, 2, 7, 2],
        backgroundColor: "#818cf8"
      },
      {
        label: "Completed Recently",
        data: [2, 1, 4, 3],
        backgroundColor: "#6366f1"
      }
    ]
  },

  line: {
    labels: ["9. Jan", "23. Jan", "6. Feb", "20. Feb", "6. Mar"],
    datasets: [
      {
        label: "Active Alerts",
        data: [5, 8, 3, 7, 4],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  },

  doughnut: {
    labels: ["Online", "Offline", "Maintenance"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  },

  stats: {
    labels: ["Jan 17", "Jan 18", "Jan 19", "Jan 20", "Jan 21", "Today"],
    datasets: [
      {
        label: "Created",
        data: [20, 25, 30, 40, 35, 30],
        backgroundColor: "#60a5fa"
      },
      {
        label: "Solved",
        data: [10, 15, 20, 12, 25, 28],
        backgroundColor: "#818cf8"
      }
    ]
  },

  table: {
    labels: [],
    datasets: [
      {
        label: 'Data',
        data: [],
        backgroundColor: '#818cf8'
      }
    ]
  }
};
