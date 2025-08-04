"use client";

import { Button } from "@/components/ui";

export default function ReportsPage() {
  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Reports</h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <Button>
              + New Report
            </Button>
            <Button variant="secondary">
              Export All
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800 p-8 flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-gray-400">Advanced reporting and dashboards coming soon.</p>
          <p className="text-sm text-gray-500 mt-2">Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
}
