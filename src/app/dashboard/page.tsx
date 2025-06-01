"use client";

import { DashboardProvider } from '@/contexts/dashboard';
import { DashboardGrid } from './components/layout';
import { AddWidgetButton } from './components/toolbar';
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

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="w-full h-full p-6 md:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-400">Customizable RMM Dashboard</p>
            </div>
            <AddWidgetButton />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
            <DashboardGrid />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
