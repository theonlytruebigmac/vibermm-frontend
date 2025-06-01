"use client";
import React, { useState } from "react";

// Define Asset type
interface Asset {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  hardware: string;
  software: string[];
  lastSeen: string;
  status: string;
}

// Mock asset data
const mockAssets: Asset[] = [
  {
    id: "1",
    hostname: "DESKTOP-01",
    ip: "192.168.1.10",
    os: "Windows 11 Pro",
    hardware: "Intel i7, 16GB RAM, 512GB SSD",
    software: ["Chrome", "Office 365", "Zoom"],
    lastSeen: "2025-05-31 10:12:00",
    status: "online",
  },
  {
    id: "2",
    hostname: "MBP-2023",
    ip: "192.168.1.22",
    os: "macOS Sonoma",
    hardware: "Apple M3, 32GB RAM, 1TB SSD",
    software: ["Safari", "Slack", "Xcode"],
    lastSeen: "2025-05-31 09:58:00",
    status: "offline",
  },
  {
    id: "3",
    hostname: "SRV-LINUX-01",
    ip: "10.0.0.5",
    os: "Ubuntu 22.04 LTS",
    hardware: "Xeon E5, 64GB RAM, 2TB NVMe",
    software: ["nginx", "docker", "nodejs"],
    lastSeen: "2025-05-31 10:15:00",
    status: "online",
  },
];

export default function AssetInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredAssets = mockAssets.filter(
    (asset) =>
      (filter === "all" || asset.status === filter) &&
      (asset.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.ip.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Asset Inventory</h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
              + Add Asset
            </button>
            <button className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition shadow-sm">
              Export Assets
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search assets by hostname or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-sm focus:outline-none"
          >
            <option value="all">All Assets</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Assets Table */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead>
              <tr className="bg-neutral-950">
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Hostname
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Operating System
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Hardware
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Software
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-neutral-900 divide-y divide-neutral-800">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-neutral-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {asset.hostname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {asset.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {asset.os}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {asset.hardware}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {asset.software.map((sw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-full bg-neutral-800 text-neutral-300"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {asset.lastSeen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        asset.status === "online"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-blue-500 hover:text-blue-400">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssets.length === 0 && (
            <div className="px-6 py-8 text-center text-neutral-400">
              No assets found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
