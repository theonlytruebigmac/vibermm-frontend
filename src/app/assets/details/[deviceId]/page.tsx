"use client";
import { AssetDetails, type AssetDetailsProps } from "@/components/assets/AssetDetails";
import { useParams } from "next/navigation";

// Mock data - replace with actual data fetching logic
const mockData: AssetDetailsProps['data'] = {
  systemInfo: {
    hostname: "DEV001-HOSTNAME",
    domain: "corp.example.com",
    manufacturer: "Dell Inc.",
    model: "OptiPlex 7090",
    serialNumber: "SN123456789",
    biosVersion: "1.5.2",
    lastBoot: "2024-07-29T10:00:00Z",
    ram: "16 GB",
    cpu: "Intel Core i7-11700 @ 2.50GHz",
    storage: "512 GB NVMe SSD",
  },
  applications: [
    { name: "Microsoft Office 365", publisher: "Microsoft", version: "16.0.15330.20230", installDate: "2023-02-10", size: "2.5 GB", status: "installed" },
    { name: "Adobe Acrobat Reader DC", publisher: "Adobe", version: "2023.003.20201", installDate: "2023-03-15", size: "300 MB", status: "updateAvailable" },
  ],
  patches: [
    { kb: "KB5001234", title: "Security Update for Windows", type: "security", status: "installed", installDate: "2024-07-15", size: "150 MB" },
    { kb: "KB5005678", title: "Cumulative Update for .NET Framework", type: "update", status: "pending", size: "80 MB" },
  ],
  services: [
    { name: "Spooler", displayName: "Print Spooler", description: "Manages print jobs", status: "running", startType: "automatic", account: "LocalSystem" },
    { name: "wuauserv", displayName: "Windows Update", description: "Enables the detection, download, and installation of updates for Windows and other programs.", status: "stopped", startType: "manual", account: "LocalSystem" },
  ],
  ports: [
    { protocol: "TCP", localPort: 80, localAddress: "0.0.0.0", state: "LISTENING", process: "nginx", pid: 1234 },
    { protocol: "TCP", localPort: 443, localAddress: "0.0.0.0", state: "LISTENING", process: "nginx", pid: 1234 },
  ],
  hardwareInfo: {
    motherboard: { manufacturer: "Dell Inc.", model: "0VGYD8", chipset: "Intel Q570" },
    cpu: { name: "Intel Core i7-11700", cores: 8, threads: 16, speed: "2.50GHz", cache: "16MB" },
    memory: {
      total: "16 GB",
      slots: { total: 4, used: 2 },
      modules: [
        { size: "8 GB", type: "DDR4", speed: "3200 MHz", manufacturer: "Kingston" },
        { size: "8 GB", type: "DDR4", speed: "3200 MHz", manufacturer: "Kingston" },
      ],
    },
    storage: [
      { name: "NVMe SSD", size: "512 GB", type: "SSD", interface: "NVMe", health: "Good" },
    ],
    networkAdapters: [
      { name: "Ethernet Controller", manufacturer: "Intel", macAddress: "00:1A:2B:3C:4D:5E", speed: "1 Gbps", status: "Connected" },
    ],
  },
};

export default function AssetDetailsPage() {
  const params = useParams();
  const deviceId = params?.deviceId as string;

  // Handle cases where deviceId might not be available or is an array
  if (!deviceId || Array.isArray(deviceId)) {
    // Optionally, render a loading state or an error message
    return <p>Loading asset details or invalid device ID...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Asset Details: {deviceId}</h1>
      <AssetDetails data={mockData} />
    </div>
  );
}
