"use client";

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
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useTheme } from "next-themes";

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

// Placeholder data for charts
const ticketDistributionData = {
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
};

const slaTicketsOpen = 12;

const ticketStatusesData = {
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
};

const invoiceValueData = {
  labels: [
    "9. Jan",
    "23. Jan",
    "6. Feb",
    "20. Feb",
    "6. Mar",
  ],
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
};

const ticketsByDayData = {
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
};

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const chartBorderColor = resolvedTheme === "dark" ? "#fff" : "#e5e7eb";
  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Example Dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <h2 className="font-medium mb-4">Ticket Distribution</h2>
            <div className="flex-1 min-h-[220px]">
              {/* @ts-ignore */}
              <Bar data={ticketDistributionData} options={{responsive: true, plugins: {legend: {position: 'bottom' as const }} }} />
            </div>
          </div>

          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <h2 className="font-medium mb-4">Invoice Value</h2>
            <div className="min-h-[220px]">
              {/* @ts-ignore */}
              <Line data={invoiceValueData} options={{responsive: true, plugins: {legend: {position: 'bottom' as const }} }} />
            </div>
          </div>

          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <h2 className="font-medium mb-4">Tickets by Day</h2>
            <div className="min-h-[220px]">
              {/* @ts-ignore */}
              <Bar data={ticketsByDayData} options={{responsive: true, plugins: {legend: {display: false }}}} />
            </div>
          </div>

          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <h2 className="font-medium mb-4">Support Categories</h2>
            <div className="flex items-center justify-center">
              <div className="w-3/4">
                {/* @ts-ignore */}
                <Doughnut data={ticketStatusesData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
