"use client";
import React from "react";
import { Chart, Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for summary cards and charts
const summary = [
  { label: "Devices Online", value: 128, color: "bg-green-600" },
  { label: "Devices Offline", value: 7, color: "bg-red-600" },
  { label: "Active Alerts", value: 3, color: "bg-yellow-500" },
  { label: "Average CPU Load", value: "23%", color: "bg-blue-600" },
];

const cpuData = {
  labels: ["1m", "2m", "3m", "4m", "5m", "6m"],
  datasets: [
    {
      label: "CPU Usage (%)",
      data: [20, 22, 25, 23, 27, 24],
      backgroundColor: "#2563eb",
      borderColor: "#2563eb",
      fill: true,
      tension: 0.4,
    },
  ],
};

const memoryData = {
  labels: ["1m", "2m", "3m", "4m", "5m", "6m"],
  datasets: [
    {
      label: "Memory Usage (GB)",
      data: [4.2, 4.3, 4.1, 4.5, 4.4, 4.3],
      backgroundColor: "#10b981",
      borderColor: "#10b981",
      fill: true,
      tension: 0.4,
    },
  ],
};

const deviceRows = [
  { name: "Server-01", status: "Online", cpu: 18, memory: 4.1, alerts: 0 },
  { name: "Workstation-22", status: "Online", cpu: 32, memory: 3.8, alerts: 1 },
  { name: "Laptop-15", status: "Offline", cpu: 0, memory: 0, alerts: 2 },
  { name: "NAS-02", status: "Online", cpu: 12, memory: 2.7, alerts: 0 },
];

export default function MonitoringPage() {
  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Monitoring</h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
              + New Monitor
            </button>
            <button className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition shadow-sm">
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {summary.map((item, index) => (
            <div
              key={index}
              className="bg-neutral-900 rounded-lg border border-neutral-800 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{item.label}</h3>
                <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
              </div>
              <p className="text-3xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Load */}
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
            <h3 className="text-lg font-medium mb-4">System Load</h3>
            <div className="min-h-[300px]">
              <Line
                data={{
                  labels: ["12am", "4am", "8am", "12pm", "4pm", "8pm"],
                  datasets: [
                    {
                      label: "CPU",
                      data: [20, 25, 45, 30, 35, 25],
                      borderColor: "#3b82f6",
                      tension: 0.3,
                      fill: false,
                    },
                    {
                      label: "Memory",
                      data: [40, 35, 55, 45, 40, 50],
                      borderColor: "#10b981",
                      tension: 0.3,
                      fill: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Network Traffic */}
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
            <h3 className="text-lg font-medium mb-4">Network Traffic</h3>
            <div className="min-h-[300px]">
              <Line
                data={{
                  labels: ["12am", "4am", "8am", "12pm", "4pm", "8pm"],
                  datasets: [
                    {
                      label: "In",
                      data: [120, 90, 150, 200, 160, 140],
                      borderColor: "#3b82f6",
                      tension: 0.3,
                      fill: false,
                    },
                    {
                      label: "Out",
                      data: [80, 60, 100, 150, 120, 100],
                      borderColor: "#10b981",
                      tension: 0.3,
                      fill: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Disk Usage */}
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
            <h3 className="text-lg font-medium mb-4">Disk Usage</h3>
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="w-3/4">
                <Doughnut
                  data={{
                    labels: ["Used", "Free"],
                    datasets: [
                      {
                        data: [67, 33],
                        backgroundColor: ["#3b82f6", "#374151"],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Alert History */}
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
            <h3 className="text-lg font-medium mb-4">Alert History</h3>
            <div className="min-h-[300px]">
              <Bar
                data={{
                  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  datasets: [
                    {
                      label: "Critical",
                      data: [3, 1, 2, 0, 1, 0, 1],
                      backgroundColor: "#ef4444",
                    },
                    {
                      label: "Warning",
                      data: [5, 4, 3, 2, 4, 3, 2],
                      backgroundColor: "#f59e0b",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      stacked: true,
                    },
                    x: {
                      stacked: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Alerts Table */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h3 className="text-lg font-medium">Recent Alerts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead className="bg-neutral-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Alert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                <tr className="hover:bg-neutral-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Critical
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Web Server 01
                  </td>
                  <td className="px-6 py-4 text-sm">
                    High CPU usage detected (95%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    5 mins ago
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-500 hover:text-blue-600">
                      View Details
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Warning
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Database 02
                  </td>
                  <td className="px-6 py-4 text-sm">
                    Disk space below 15% (C:)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    15 mins ago
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-500 hover:text-blue-600">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
