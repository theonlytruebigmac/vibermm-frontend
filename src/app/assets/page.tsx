"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger, Button } from "@/components/ui";
import { TableSettings } from "@/components/table/TableSettings";
import { Settings2 } from "lucide-react";

interface AssetDetailsModalProps {
  asset: {
    id: number;
    name: string;
    type: string;
    remote: string;
    ip: string;
    lastCheckIn: string;
    customer: string;
    osName: string;
    osArch: string;
    cpu: string;
    ram: string;
    hdd: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Application {
  name: string;
  publisher: string;
  version: string;
  installDate: string;
  size: string;
  status: 'installed' | 'updateAvailable';
}

interface Patch {
  kb: string;
  title: string;
  type: 'security' | 'update';
  status: 'installed' | 'pending' | 'failed';
  installDate?: string;
  size: string;
}

interface Service {
  displayName: string;
  name: string;
  status: 'running' | 'stopped';
  startType: 'automatic' | 'manual';
  account: string;
}

interface Port {
  protocol: 'TCP' | 'UDP';
  localAddress: string;
  localPort: number;
  remoteAddress: string;
  remotePort: number;
  state: 'LISTENING' | 'ESTABLISHED';
  process: string;
  pid: number;
}

function AssetDetailsModal({ asset, isOpen, onClose }: AssetDetailsModalProps) {
  if (!asset) return null;

  const systemInfo = {
    hostname: asset.name,
    domain: "vibermm.local",
    manufacturer: "Dell Inc.",
    model: "Latitude 5520",
    serialNumber: "ABC123XYZ",
    biosVersion: "1.5.3",
    lastBoot: "2025-06-10 08:30:00",
    cpu: asset.cpu,
    ram: asset.ram,
    storage: asset.hdd,
  };

  const applications: Application[] = [
    { 
      name: "Google Chrome",
      publisher: "Google LLC",
      version: "115.0.5790.171",
      installDate: "2023-01-15",
      size: "285 MB",
      status: "updateAvailable"
    },
    { 
      name: "Microsoft Office",
      publisher: "Microsoft Corporation",
      version: "16.0.15629.20208",
      installDate: "2023-02-01",
      size: "4.2 GB",
      status: "installed"
    },
    { 
      name: "Adobe Acrobat Reader",
      publisher: "Adobe Inc.",
      version: "23.003.20201",
      installDate: "2023-03-10",
      size: "462 MB",
      status: "installed"
    }
  ];

  const patches: Patch[] = [
    { 
      kb: "KB5025355",
      title: "Windows 11 Security Update",
      type: "security",
      status: "installed",
      installDate: "2025-05-15",
      size: "435 MB"
    },
    { 
      kb: "KB5025417",
      title: "Windows Feature Update",
      type: "update",
      status: "pending",
      size: "2.1 GB"
    },
    { 
      kb: "KB5025382",
      title: "Microsoft Defender Update",
      type: "security",
      status: "failed",
      size: "85 MB"
    }
  ];

  const services: Service[] = [
    { 
      displayName: "Windows Update",
      name: "wuauserv",
      status: "running",
      startType: "automatic",
      account: "LocalSystem"
    },
    { 
      displayName: "Print Spooler",
      name: "spooler",
      status: "running",
      startType: "automatic",
      account: "LocalSystem"
    },
    { 
      displayName: "SQL Server",
      name: "MSSQLSERVER",
      status: "stopped",
      startType: "manual",
      account: "NT Service\\MSSQLSERVER"
    }
  ];

  const ports: Port[] = [
    { 
      protocol: "TCP",
      localAddress: "0.0.0.0",
      localPort: 80,
      remoteAddress: "*",
      remotePort: 0,
      state: "LISTENING",
      process: "httpd.exe",
      pid: 4120
    },
    { 
      protocol: "TCP",
      localAddress: "192.168.1.100",
      localPort: 49232,
      remoteAddress: "52.96.165.44",
      remotePort: 443,
      state: "ESTABLISHED",
      process: "Teams.exe",
      pid: 8756
    },
    { 
      protocol: "UDP",
      localAddress: "0.0.0.0",
      localPort: 5353,
      remoteAddress: "*",
      remotePort: 0,
      state: "LISTENING",
      process: "chrome.exe",
      pid: 6543
    }
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {asset.name} Details
                    </Dialog.Title>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Syncing asset data...');
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sync Now
                    </button>
                  </div>

                  <Tabs defaultValue="system" className="w-full">
                    <TabsList className="inline-flex h-10 items-center justify-start gap-4 rounded-lg bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      <TabsTrigger value="system">System Info</TabsTrigger>
                      <TabsTrigger value="applications">Applications</TabsTrigger>
                      <TabsTrigger value="patching">Windows Patching</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                      <TabsTrigger value="ports">Ports</TabsTrigger>
                    </TabsList>

                    <TabsContent value="system">
                      <Card>
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(systemInfo).map(([key, value]) => (
                              <div key={key} className="flex flex-col">
                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="applications">
                      <Card>
                        <div className="p-6">
                          <div className="grid gap-4">
                            {applications.map((app, index) => (
                              <div 
                                key={index}
                                className="grid grid-cols-5 items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                              >
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{app.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{app.publisher}</div>
                                </div>
                                <div className="text-gray-900 dark:text-gray-100">{app.version}</div>
                                <div className="text-gray-900 dark:text-gray-100">{app.installDate}</div>
                                <div className="text-gray-900 dark:text-gray-100">{app.size}</div>
                                <div>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    app.status === 'installed' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {app.status === 'installed' ? 'Installed' : 'Update Available'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="patching">
                      <Card>
                        <div className="p-6">
                          <div className="grid gap-4">
                            {patches.map((patch, index) => (
                              <div 
                                key={index}
                                className="grid grid-cols-5 items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                              >
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{patch.kb}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{patch.title}</div>
                                </div>
                                <div className="capitalize text-gray-900 dark:text-gray-100">{patch.type}</div>
                                <div>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    patch.status === 'installed' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : patch.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}>
                                    {patch.status.charAt(0).toUpperCase() + patch.status.slice(1)}
                                  </span>
                                </div>
                                <div className="text-gray-900 dark:text-gray-100">{patch.size}</div>
                                <div className="text-gray-900 dark:text-gray-100">
                                  {patch.installDate || 'Not installed'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="services">
                      <Card>
                        <div className="p-6">
                          <div className="grid gap-4">
                            {services.map((service, index) => (
                              <div 
                                key={index}
                                className="grid grid-cols-4 items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-900 dark:text-gray-100">{service.displayName}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{service.name}</div>
                                </div>
                                <div>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    service.status === 'running' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}>
                                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                  </span>
                                </div>
                                <div className="capitalize text-gray-900 dark:text-gray-100">{service.startType}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{service.account}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="ports">
                      <Card>
                        <div className="p-6">
                          <div className="grid gap-4">
                            {ports.map((port, index) => (
                              <div 
                                key={index}
                                className="grid grid-cols-5 items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
                              >
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {port.protocol} {port.localPort}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {port.localAddress}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {port.remotePort || '-'}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {port.remoteAddress}
                                  </div>
                                </div>
                                <div>
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    port.state === 'ESTABLISHED' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : port.state === 'LISTENING'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                  }`}>
                                    {port.state}
                                  </span>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{port.process}</div>
                                <div className="text-gray-500 dark:text-gray-400">PID: {port.pid}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="rounded-md bg-[#23a69a] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1c8c82] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#23a69a]"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

interface Column {
  id: string;
  title: string;
  visible: boolean;
}

interface TableSettings {
  rowHeight: "compact" | "default" | "relaxed";
  showBorders: boolean;
  stripedRows: boolean;
}

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [osFilter, setOsFilter] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<(typeof assets)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    { id: "name", title: "Name", visible: true },
    { id: "type", title: "Type", visible: true },
    { id: "ip", title: "IP Address", visible: true },
    { id: "lastCheckIn", title: "Last Check In", visible: true },
    { id: "customer", title: "Customer", visible: true },
    { id: "osName", title: "OS", visible: true },
    { id: "status", title: "Status", visible: true },
  ]);

  const [tableSettings, setTableSettings] = useState<TableSettings>({
    rowHeight: "default",
    showBorders: true,
    stripedRows: true,
  });

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('tableColumns');
    const savedSettings = localStorage.getItem('tableSettings');

    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }

    if (savedSettings) {
      setTableSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Example asset data (should be replaced with real data)
  const assets = [
    {
      id: 1,
      name: "DESKTOP-FFHVSFD",
      type: "workstation",
      remote: "—",
      ip: "192.168.1.100",
      lastCheckIn: "2025-06-11 10:30 AM",
      customer: "—",
      osName: "Windows 11",
      osArch: "x64",
      cpu: "Intel i7-13700K",
      ram: "32GB",
      hdd: "1TB SSD",
    },
    // Add more assets as needed
  ];

  const handleAssetClick = (asset: typeof assets[0]) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedActionAsset, setSelectedActionAsset] = useState<(typeof assets)[0] | null>(null);

  const handleAssetAction = (action: string) => {
    // Handle different actions here
    if (!selectedActionAsset) return;
    
    switch (action) {
      case 'runScript':
        console.log('Run script on asset:', selectedActionAsset.name);
        break;
      case 'reboot':
        console.log('Reboot asset:', selectedActionAsset.name);
        break;
      case 'shutdown':
        console.log('Shutdown asset:', selectedActionAsset.name);
        break;
    }
    setActionModalOpen(false);
  };

  // Mock stats for the cards at the top
  const stats = [
    { title: "Total Assets", value: "156", trend: "up", change: "12%" },
    { title: "Online", value: "143", trend: "up", change: "8%" },
    { title: "Offline", value: "13", trend: "down", change: "3%" },
    { title: "Needs Attention", value: "5", trend: "up", change: "2" },
  ];

  const handleColumnsChange = (newColumns: Column[]) => {
    setColumns(newColumns);
    localStorage.setItem('tableColumns', JSON.stringify(newColumns));
  };

  const handleSettingsChange = (newSettings: TableSettings) => {
    setTableSettings(newSettings);
    localStorage.setItem('tableSettings', JSON.stringify(newSettings));
  };

  const getRowHeightClass = (rowHeight: "compact" | "default" | "relaxed") => {
    switch (rowHeight) {
      case "compact":
        return "py-2";
      case "relaxed":
        return "py-4";
      default:
        return "py-3";
    }
  };

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Assets</h1>
            <p className="text-gray-400">Manage and monitor your assets</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {/* TODO: Add asset modal */}}
            >
              Add Asset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Export assets */}}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTableSettingsOpen(true)}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Table Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    stat.trend === 'up' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <div className="mb-4 flex items-center gap-4">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            />
            <select
              value={osFilter}
              onChange={(e) => setOsFilter(e.target.value)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
            >
              <option value="">All OS</option>
              <option value="Windows">Windows</option>
              <option value="macOS">macOS</option>
              <option value="Linux">Linux</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="relative overflow-x-auto">
              <table className={`w-full text-sm text-left ${
                tableSettings.showBorders ? "border-collapse border border-gray-200 dark:border-gray-700" : ""
              } ${
                tableSettings.stripedRows ? "divide-y divide-gray-200 dark:divide-gray-700" : ""
              }`}>
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {columns
                      .filter(col => col.visible)
                      .map(column => (
                        <th
                          key={column.id}
                          className={`px-6 ${getRowHeightClass(tableSettings.rowHeight)}`}
                        >
                          {column.title}
                        </th>
                      ))}
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, idx) => (
                    <tr
                      key={asset.id}
                      onClick={() => handleAssetClick(asset)}
                      className={`${
                        tableSettings.stripedRows && idx % 2 === 0 
                          ? "bg-gray-50 dark:bg-gray-900" 
                          : ""
                      } hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                    >
                      {columns
                        .filter(col => col.visible)
                        .map(column => (
                          <td
                            key={column.id}
                            className={`px-6 ${getRowHeightClass(tableSettings.rowHeight)}`}
                          >
                            {asset[column.id as keyof typeof asset]}
                          </td>
                        ))}
                      <td className={`px-6 ${getRowHeightClass(tableSettings.rowHeight)}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActionAsset(asset);
                            setActionModalOpen(true);
                          }}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AssetDetailsModal
        asset={selectedAsset}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Asset Actions Modal */}
      <Transition appear show={actionModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setActionModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="p-6">
                    <Dialog.Title as="h3" className="text-lg font-medium mb-4">
                      {selectedActionAsset?.name} Actions
                    </Dialog.Title>
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => handleAssetAction('runScript')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Run Script
                      </button>
                      <button
                        onClick={() => handleAssetAction('reboot')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        Reboot
                      </button>
                      <button
                        onClick={() => handleAssetAction('shutdown')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-500"
                      >
                        Shutdown
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Table Settings Modal */}
      <Transition.Root show={isTableSettingsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsTableSettingsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="p-6">
                    <Dialog.Title as="h3" className="text-lg font-medium mb-4">
                      Table Settings
                    </Dialog.Title>
                    <TableSettings
                      columns={columns}
                      settings={tableSettings}
                      onColumnsChange={handleColumnsChange}
                      onSettingsChange={handleSettingsChange}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
