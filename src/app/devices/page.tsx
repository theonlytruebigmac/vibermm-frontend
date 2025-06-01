"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useToast } from "@/contexts/toast";

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

export default function DevicesPage() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [osFilter, setOsFilter] = useState("");
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");

  // Example device data (should be replaced with real data)
  const devices = [
    {
      id: 1,
      name: "DESKTOP-FFHVSFD",
      type: "workstation",
      remote: "—",
      ip: "192.168.1.100",
      lastCheckIn: "2025-06-01 10:30 AM",
      customer: "—",
      osName: "Windows 11",
      osArch: "x64",
      cpu: "Intel i7-13700K",
      ram: "32GB",
      hdd: "1TB SSD",
    },
    // This is example data, should be replaced with real data from the API
  ];

  const filteredDevices = devices
    .filter((d) =>
      (!searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!osFilter || d.osName === osFilter) &&
      (!selectedDeviceType || d.type === selectedDeviceType)
    );

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Devices</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
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
                className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>
            <select
              value={selectedDeviceType}
              onChange={e => setSelectedDeviceType(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none"
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
              className="w-full md:w-auto px-3 py-2 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none"
            >
              <option value="">All OS</option>
              <option value="Windows">Windows</option>
              <option value="macOS">macOS</option>
              <option value="Linux">Linux</option>
            </select>
            <button
              className="w-full md:w-auto px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm whitespace-nowrap flex items-center gap-2"
            >
              Search
            </button>
          </div>
        </form>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center mb-2">Computers with Alerts</div>
            <div className="text-4xl font-bold text-blue-500 mb-2">0</div>
            <div className="w-48 h-48">
              <Doughnut data={alertsByComputerData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center mb-2">Computers without AV</div>
            <div className="text-4xl font-bold text-blue-500 mb-2">0</div>
            <div className="w-48 h-48">
              <Doughnut data={alertsByComputerData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 flex flex-col items-center justify-center">
            <div className="text-lg font-semibold text-center mb-2">Operating Systems</div>
            <div className="w-48 h-48">
              <Doughnut data={alertsByComputerData} options={{ responsive: true, plugins: { legend: { position: 'bottom' as const } } }} />
            </div>
          </div>
        </div>

        {/* Devices table */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">OS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Last Check-in</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredDevices.length === 0 ? (
                <tr className="hover:bg-gray-700">
                  <td className="px-4 py-4" colSpan={7}>
                    <div className="text-center text-gray-400">No devices found</div>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-700">
                    <td className="px-4 py-4">{device.name}</td>
                    <td className="px-4 py-4">{device.type || '—'}</td>
                    <td className="px-4 py-4">{device.remote}</td>
                    <td className="px-4 py-4">{device.osName}</td>
                    <td className="px-4 py-4">{device.ip || '—'}</td>
                    <td className="px-4 py-4">{device.lastCheckIn || '—'}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => showToast("Device action", "info")}
                        className="text-gray-400 hover:text-white"
                      >
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 border border-gray-700 shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6"
                >
                  Add New Device
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Please enter the details for the new device.
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    Device Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full px-3 py-2 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                    placeholder="Enter device name"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    Device Type
                  </label>
                  <select className="mt-1 w-full px-3 py-2 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none">
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
                    className="mt-1 w-full px-3 py-2 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
                    placeholder="Enter IP address"
                  />
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none transition shadow-sm flex items-center gap-2"
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
