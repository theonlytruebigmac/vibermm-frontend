import { AssetDetails, type AssetDetailsProps } from "@/components/assets/AssetDetails";

// This would normally come from your API
const mockData: AssetDetailsProps['data'] = {
  systemInfo: {
    hostname: "DESKTOP-FFHVSFD",
    domain: "vibermm.local",
    manufacturer: "Dell Inc.",
    model: "Latitude 5520",
    serialNumber: "ABC123XYZ",
    biosVersion: "1.5.3",
    lastBoot: "2025-06-10 08:30:00",
    ram: "32GB",
    cpu: "Intel i7-13700K",
    storage: "1TB SSD",
  },
  applications: [
    {
      name: "Microsoft Office 365",
      publisher: "Microsoft Corporation",
      version: "16.0.16130.20314",
      installDate: "2024-12-01",
      size: "4.2 GB",
      status: "installed" as const,
    },
    {
      name: "Google Chrome",
      publisher: "Google LLC",
      version: "114.0.5735.199",
      installDate: "2025-05-15",
      size: "280 MB",
      status: "updateAvailable" as const,
    },
  ],
  patches: [
    {
      kb: "KB5033375",
      title: "Windows 11 Update for x64-based Systems",
      type: "security" as const,
      status: "installed" as const,
      installDate: "2025-05-20",
      size: "435 MB",
    },
    {
      kb: "KB5033380",
      title: "Security Intelligence Update for Windows Defender",
      type: "security" as const,
      status: "pending" as const,
      size: "12 MB",
    },
  ],
  services: [
    {
      name: "wuauserv",
      displayName: "Windows Update",
      description: "Enables the detection, download, and installation of updates",
      status: "running" as const,
      startType: "automatic" as const,
      account: "LocalSystem",
    },
    {
      name: "WinDefend",
      displayName: "Windows Defender Antivirus Service",
      description: "Helps protect users from malware and other potentially unwanted software",
      status: "running" as const,
      startType: "automatic" as const,
      account: "LocalSystem",
    },
  ],
  ports: [
    {
      protocol: "TCP" as const,
      localPort: 443,
      localAddress: "0.0.0.0",
      state: "LISTENING" as const,
      process: "System",
      pid: 4,
    },
    {
      protocol: "TCP" as const,
      localPort: 3389,
      localAddress: "0.0.0.0",
      remotePort: 52431,
      remoteAddress: "10.0.0.50",
      state: "ESTABLISHED" as const,
      process: "TermService",
      pid: 1234,
    },
  ],
  hardwareInfo: {
    motherboard: {
      manufacturer: "Dell Inc.",
      model: "0XHDK8",
      chipset: "Intel Q670",
    },
    cpu: {
      name: "Intel i7-13700K",
      cores: 16,
      threads: 24,
      speed: "3.4 GHz (up to 5.4 GHz)",
      cache: "30 MB Intel Smart Cache",
    },
    memory: {
      total: "32GB",
      slots: {
        total: 4,
        used: 2,
      },
      modules: [
        {
          size: "16GB",
          type: "DDR5",
          speed: "4800 MHz",
          manufacturer: "Samsung",
        },
        {
          size: "16GB",
          type: "DDR5",
          speed: "4800 MHz",
          manufacturer: "Samsung",
        },
      ],
    },
    storage: [
      {
        name: "Samsung PM9A1 NVMe",
        size: "1TB",
        type: "SSD",
        interface: "NVMe",
        health: "Good",
      },
    ],
    networkAdapters: [
      {
        name: "Intel Wi-Fi 6E AX211",
        manufacturer: "Intel Corporation",
        macAddress: "00:11:22:33:44:55",
        speed: "2.4 Gbps",
        status: "Connected",
      },
      {
        name: "Intel I219-LM",
        manufacturer: "Intel Corporation",
        macAddress: "00:11:22:33:44:66",
        speed: "1 Gbps",
        status: "Connected",
      },
    ],
  },
};

// Define type for the page props for this specific page
interface AssetPageProps {
  params: Promise<{ deviceId: string }>;
}

// Server component with proper typing for the params
export default async function AssetPage({ params: paramsPromise }: AssetPageProps) {
  const params = await paramsPromise;
  const { deviceId } = params;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Asset Details: {deviceId}</h1>
      <AssetDetails data={mockData} />
    </div>
  );
}
