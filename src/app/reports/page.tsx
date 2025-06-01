export default function ReportsPage() {
  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Reports</h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
              + New Report
            </button>
            <button className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition shadow-sm">
              Export All
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-neutral-400">Advanced reporting and dashboards coming soon.</p>
          <p className="text-sm text-neutral-500 mt-2">Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
}
