"use client";
import { useTheme } from "next-themes";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useToast } from "../toast-context";

ChartJS.register(ArcElement, Tooltip, Legend);

const alertsByComputerData = {
  labels: ["Other"],
  datasets: [
    {
      data: [1],
      backgroundColor: ["#f87171"],
      borderWidth: 2,
    },
  ],
};

const alertsByTypeData = {
  labels: ["Other"],
  datasets: [
    {
      data: [1],
      backgroundColor: ["#fbbf24"],
      borderWidth: 2,
    },
  ],
};

export default function DevicesPage() {
  const { resolvedTheme } = useTheme();
  const chartBorderColor = resolvedTheme === "dark" ? "#fff" : "#e5e7eb";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("devices");
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [osFilter, setOsFilter] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");

  // Bulk selection state
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  // Example device data (should be replaced with real data)
  const devices = [
    {
      id: 1,
      name: "DESKTOP-FFHVSFD",
      remote: "—",
      customer: "—",
      osName: "—",
      osArch: "—",
      cpu: "—",
      ram: "—",
      hdd: "—",
    },
    // Add more devices as needed
  ];

  // Bulk select handlers
  const allSelected = selectedRows.length === devices.length && devices.length > 0;
  const toggleAll = () => setSelectedRows(allSelected ? [] : devices.map((d) => d.id));
  const toggleRow = (id: number) => setSelectedRows((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  // Bulk action example
  const handleBulkDelete = () => {
    showToast(`Deleted ${selectedRows.length} device(s)`, "success");
    setSelectedRows([]);
  };

  // Advanced filtering state
  const [sortBy, setSortBy] = useState<keyof typeof devices[0]>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filter and sort devices
  const filteredDevices = devices
    .filter((d) =>
      (!search || d.name.toLowerCase().includes(search.toLowerCase())) &&
      (!osFilter || d.osName === osFilter)
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDir === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  // Device details drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerDevice, setDrawerDevice] = useState<typeof devices[0] | null>(null);

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Devices</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            + Add Device
          </button>
        </div>

        {/* Search and filters */}
        <form className="w-full">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search devices..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>
            <select
              value={selectedDeviceType}
              onChange={e => setSelectedDeviceType(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded border border-neutral-800 bg-neutral-900 text-sm focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="workstation">Workstation</option>
              <option value="server">Server</option>
              <option value="laptop">Laptop</option>
              <option value="mobile">Mobile</option>
              <option value="network">Network Device</option>
            </select>
            <select
              value={osFilter}
              onChange={e => setOsFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded border border-neutral-800 bg-neutral-900 text-sm focus:outline-none"
            >
              <option value="">All OS</option>
              <option value="Windows">Windows</option>
              <option value="macOS">macOS</option>
              <option value="Linux">Linux</option>
            </select>
            <button className="w-full md:w-auto px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
              Search
            </button>
          </div>
        </form>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center mb-2">Computers with Alerts</div>
            <div className="text-4xl font-bold text-blue-500 mb-2">0</div>
            <div className="w-48 h-48">
              <Doughnut data={alertsByComputerData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
            </div>
          </div>
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center mb-2">Computers without AV</div>
            <div className="text-4xl font-bold text-blue-500 mb-2">0</div>
            <div className="w-48 h-48">
              <Doughnut data={alertsByComputerData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
            </div>
          </div>
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center mb-2">Operating Systems</div>
            <div className="w-48 h-48">
              <Doughnut data={alertsByComputerData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
            </div>
          </div>
        </div>

        {/* Devices table */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead>
              <tr className="bg-neutral-950">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">OS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Last Check-in</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-neutral-900 divide-y divide-neutral-800">
              <tr className="hover:bg-neutral-800">
                <td className="px-4 py-4" colSpan={7}>
                  <div className="text-center text-neutral-400">No devices found</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setIsModalOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-neutral-900 border border-neutral-800 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6"
                >
                  Add New Device
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-neutral-400">
                    Please enter the details for the new device.
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    Device Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                    placeholder="Enter device name"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    Device Type
                  </label>
                  <select className="mt-1 w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-900 text-sm focus:outline-none">
                    <option value="workstation">Workstation</option>
                    <option value="server">Server</option>
                    <option value="laptop">Laptop</option>
                    <option value="mobile">Mobile</option>
                    <option value="network">Network Device</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    IP Address
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full px-3 py-2 rounded border border-neutral-800 bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                    placeholder="Enter IP address"
                  />
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white focus:outline-none"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                    onClick={() => {
                      showToast("Device added", "success");
                      setIsModalOpen(false);
                    }}
                  >
                    Add Device
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
