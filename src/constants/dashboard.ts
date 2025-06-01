import { ChartData } from '@/types';

export const defaultWidgetData: Record<string, ChartData> = {
  ticketDistribution: {
    labels: ["Sally", "Mark", "Pierce", "Mandy"],
    datasets: [
      {
        label: "New",
        data: [5, 7, 3, 4],
        backgroundColor: "#a5b4fc",
      },
      {
        label: "In Progress",
        data: [3, 2, 7, 2],
        backgroundColor: "#818cf8",
      },
      {
        label: "Completed Recently",
        data: [2, 1, 4, 3],
        backgroundColor: "#6366f1",
      },
    ],
  },
  
  ticketStatuses: {
    labels: ["Fresh", "Stale", "V. Stale"],
    datasets: [
      {
        data: [6, 4, 2],
        backgroundColor: ["#f87171", "#fbbf24", "#a3a3a3"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  },

  invoiceValue: {
    labels: ["9. Jan", "23. Jan", "6. Feb", "20. Feb", "6. Mar"],
    datasets: [
      {
        label: "Open",
        data: [0, 20000, 40000, 80000, 120000],
        backgroundColor: "#6ee7b7",
        fill: true,
      },
      {
        label: "Paid",
        data: [0, 10000, 25000, 60000, 100000],
        backgroundColor: "#34d399",
        fill: true,
      },
      {
        label: "Overdue",
        data: [0, 0, 5000, 10000, 20000],
        backgroundColor: "#f87171",
        fill: true,
      },
    ],
  },

  ticketsByDay: {
    labels: ["Jan 17", "Jan 18", "Jan 19", "Jan 20", "Jan 21", "Today"],
    datasets: [
      {
        label: "Created",
        data: [20, 25, 30, 40, 35, 30],
        backgroundColor: "#60a5fa",
      },
      {
        label: "Solved",
        data: [10, 15, 20, 12, 25, 28],
        backgroundColor: "#818cf8",
      },
    ],
  },
};
