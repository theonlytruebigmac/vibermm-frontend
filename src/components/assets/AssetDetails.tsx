import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface SystemInfo {
  hostname: string;
  domain: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  biosVersion: string;
  lastBoot: string;
  ram: string;
  cpu: string;
  storage: string;
}

interface HardwareInfo {
  motherboard: {
    manufacturer: string;
    model: string;
    chipset: string;
  };
  cpu: {
    name: string;
    cores: number;
    threads: number;
    speed: string;
    cache: string;
  };
  memory: {
    total: string;
    slots: {
      total: number;
      used: number;
    };
    modules: Array<{
      size: string;
      type: string;
      speed: string;
      manufacturer: string;
    }>;
  };
  storage: Array<{
    name: string;
    size: string;
    type: string;
    interface: string;
    health: string;
  }>;
  networkAdapters: Array<{
    name: string;
    manufacturer: string;
    macAddress: string;
    speed: string;
    status: string;
  }>;
}

interface Application {
  name: string;
  publisher: string;
  version: string;
  installDate: string;
  size: string;
  status: "installed" | "updateAvailable" | "failing";
}

interface Patch {
  kb: string;
  title: string;
  type: "security" | "update" | "hotfix";
  status: "installed" | "pending" | "failed";
  installDate?: string;
  size: string;
}

interface Service {
  name: string;
  displayName: string;
  description: string;
  status: "running" | "stopped" | "starting" | "stopping";
  startType: "automatic" | "manual" | "disabled";
  account: string;
}

interface Port {
  protocol: "TCP" | "UDP";
  localPort: number;
  localAddress: string;
  remotePort?: number;
  remoteAddress?: string;
  state: "LISTENING" | "ESTABLISHED" | "TIME_WAIT" | "CLOSED";
  process: string;
  pid: number;
}

export interface AssetDetailsProps {
  data: {
    systemInfo: SystemInfo;
    applications: Application[];
    patches: Patch[];
    services: Service[];
    ports: Port[];
    hardwareInfo: HardwareInfo;
  };
}

export function AssetDetails({ data }: AssetDetailsProps) {
  const { systemInfo, applications, patches, services, ports, hardwareInfo } = data;

  return (
    <Tabs defaultValue="systemInfo" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="systemInfo">System Info</TabsTrigger>
        <TabsTrigger value="hardware">Hardware</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="patching">Windows Patching</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="processes">Processes</TabsTrigger>
        <TabsTrigger value="ports">Ports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="systemInfo">
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <InfoField label="Hostname" value={systemInfo.hostname} />
            <InfoField label="Domain" value={systemInfo.domain} />
            <InfoField label="Manufacturer" value={systemInfo.manufacturer} />
            <InfoField label="Model" value={systemInfo.model} />
            <InfoField label="Serial Number" value={systemInfo.serialNumber} />
            <InfoField label="Bios Version" value={systemInfo.biosVersion} />
            <InfoField label="Last Boot" value={systemInfo.lastBoot} />
            <InfoField label="Ram" value={systemInfo.ram} />
            <InfoField label="Cpu" value={systemInfo.cpu} />
            <InfoField label="Storage" value={systemInfo.storage} />
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="hardware">
        <Card className="p-6">
          <div className="space-y-8">
            {/* CPU Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">CPU Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoField label="Processor" value={hardwareInfo.cpu.name} />
                <InfoField label="Speed" value={hardwareInfo.cpu.speed} />
                <InfoField label="Cores" value={hardwareInfo.cpu.cores.toString()} />
                <InfoField label="Threads" value={hardwareInfo.cpu.threads.toString()} />
                <InfoField label="Cache" value={hardwareInfo.cpu.cache} />
              </div>
            </div>

            {/* Memory Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Memory</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InfoField label="Total RAM" value={hardwareInfo.memory.total} />
                <InfoField 
                  label="Memory Slots" 
                  value={`${hardwareInfo.memory.slots.used}/${hardwareInfo.memory.slots.total}`} 
                />
              </div>
              <div className="space-y-4">
                {hardwareInfo.memory.modules.map((module, index) => (
                  <div key={index} className="bg-slate-800/50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Module {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoField label="Size" value={module.size} />
                      <InfoField label="Type" value={module.type} />
                      <InfoField label="Speed" value={module.speed} />
                      <InfoField label="Manufacturer" value={module.manufacturer} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Storage Devices</h3>
              <div className="space-y-4">
                {hardwareInfo.storage.map((device, index) => (
                  <div key={index} className="bg-slate-800/50 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <InfoField label="Name" value={device.name} />
                      <InfoField label="Size" value={device.size} />
                      <InfoField label="Type" value={device.type} />
                      <InfoField label="Interface" value={device.interface} />
                      <InfoField label="Health" value={device.health} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Network Adapters</h3>
              <div className="space-y-4">
                {hardwareInfo.networkAdapters.map((adapter, index) => (
                  <div key={index} className="bg-slate-800/50 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <InfoField label="Name" value={adapter.name} />
                      <InfoField label="Manufacturer" value={adapter.manufacturer} />
                      <InfoField label="MAC Address" value={adapter.macAddress} />
                      <InfoField label="Speed" value={adapter.speed} />
                      <InfoField label="Status" value={adapter.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="applications">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-200">Applications ({applications.length})</h3>
              <div className="flex gap-4">
                <span className="text-sm text-slate-400">
                  {applications.filter(app => app.status === 'installed').length} Installed
                </span>
                <span className="text-sm text-yellow-400">
                  {applications.filter(app => app.status === 'updateAvailable').length} Updates Available
                </span>
                <span className="text-sm text-red-400">
                  {applications.filter(app => app.status === 'failing').length} Failing
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4 text-sm font-medium text-slate-400 px-4">
              <div className="col-span-2">Name</div>
              <div>Publisher</div>
              <div>Version</div>
              <div>Install Date</div>
              <div>Size</div>
              <div>Status</div>
            </div>
            {applications.map((app, index) => (
              <div 
                key={index}
                className="grid grid-cols-7 gap-4 p-4 rounded-md hover:bg-slate-800/50"
              >
                <div className="col-span-2 font-medium text-slate-200">{app.name}</div>
                <div className="text-slate-300">{app.publisher}</div>
                <div className="text-slate-300">{app.version}</div>
                <div className="text-slate-300">{app.installDate}</div>
                <div className="text-slate-300">{app.size}</div>
                <div>
                  <span className={
                    "px-2 py-1 rounded-full text-xs " + 
                    (app.status === "installed" 
                      ? "bg-green-500/20 text-green-400"
                      : app.status === "updateAvailable"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400")
                  }>
                    {app.status === 'updateAvailable' ? 'Update Available' : 
                     app.status === 'failing' ? 'Failing' : 'Installed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="patching">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-200">Windows Patches ({patches.length})</h3>
              <div className="flex gap-4">
                <span className="text-sm text-green-400">
                  {patches.filter(patch => patch.status === 'installed').length} Installed
                </span>
                <span className="text-sm text-yellow-400">
                  {patches.filter(patch => patch.status === 'pending').length} Pending
                </span>
                <span className="text-sm text-red-400">
                  {patches.filter(patch => patch.status === 'failed').length} Failed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Security Updates</h4>
                <div className="text-2xl font-semibold text-slate-200">
                  {patches.filter(patch => patch.type === 'security').length}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Feature Updates</h4>
                <div className="text-2xl font-semibold text-slate-200">
                  {patches.filter(patch => patch.type === 'update').length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-slate-400 px-4">
              <div>KB</div>
              <div className="col-span-2">Title</div>
              <div>Type</div>
              <div>Status</div>
              <div>Size</div>
            </div>
            {patches.map((patch, index) => (
              <div 
                key={index}
                className="grid grid-cols-6 gap-4 p-4 rounded-md hover:bg-slate-800/50"
              >
                <div className="font-medium text-slate-200">{patch.kb}</div>
                <div className="col-span-2 text-slate-300">{patch.title}</div>
                <div>
                  <span className={
                    "px-2 py-1 rounded-full text-xs " + 
                    (patch.type === "security" 
                      ? "bg-red-500/20 text-red-400"
                      : "bg-blue-500/20 text-blue-400")
                  }>
                    {patch.type}
                  </span>
                </div>
                <div>
                  <span className={
                    "px-2 py-1 rounded-full text-xs " + 
                    (patch.status === "installed" 
                      ? "bg-green-500/20 text-green-400"
                      : patch.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400" 
                      : "bg-red-500/20 text-red-400")
                  }>
                    {patch.status}
                  </span>
                </div>
                <div className="text-slate-300">{patch.size}</div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="services">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-200">Services ({services.length})</h3>
              <div className="flex gap-4">
                <span className="text-sm text-green-400">
                  {services.filter(service => service.status === 'running').length} Running
                </span>
                <span className="text-sm text-yellow-400">
                  {services.filter(service => service.status === 'stopped').length} Stopped
                </span>
                <span className="text-sm text-blue-400">
                  {services.filter(service => service.status === 'starting' || service.status === 'stopping').length} Transitioning
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Automatic Services</h4>
                <div className="text-2xl font-semibold text-slate-200">
                  {services.filter(svc => svc.startType === 'automatic').length}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Manual Services</h4>
                <div className="text-2xl font-semibold text-slate-200">
                  {services.filter(svc => svc.startType === 'manual').length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-slate-400 px-4">
              <div className="col-span-2">Name</div>
              <div>Status</div>
              <div>Start Type</div>
              <div className="col-span-2">Account</div>
            </div>
            {services.map((service, index) => (
              <div 
                key={index}
                className="grid grid-cols-6 gap-4 p-4 rounded-md hover:bg-slate-800/50"
                title={service.description}
              >
                <div className="col-span-2">
                  <div className="font-medium text-slate-200">{service.displayName}</div>
                  <div className="text-sm text-slate-400">{service.name}</div>
                  <div className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</div>
                </div>
                <div>
                  <span className={
                    "px-2 py-1 rounded-full text-xs " + 
                    (service.status === "running" 
                      ? "bg-green-500/20 text-green-400"
                      : service.status === "stopped"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400")
                  }>
                    {service.status}
                  </span>
                </div>
                <div>
                  <span className={
                    "px-2 py-1 rounded-full text-xs " + 
                    (service.startType === "automatic"
                      ? "bg-green-500/20 text-green-400"
                      : service.startType === "manual"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-red-500/20 text-red-400")
                  }>
                    {service.startType}
                  </span>
                </div>
                <div className="col-span-2 text-slate-300">{service.account}</div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="processes">
        <Card className="p-6">
          {/* Processes tab content will be implemented */}
        </Card>
      </TabsContent>

      <TabsContent value="ports">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-200">Network Ports ({ports.length})</h3>
              <div className="flex gap-4">
                <span className="text-sm text-blue-400">
                  {ports.filter(port => port.state === 'LISTENING').length} Listening
                </span>
                <span className="text-sm text-green-400">
                  {ports.filter(port => port.state === 'ESTABLISHED').length} Established
                </span>
                <span className="text-sm text-yellow-400">
                  {ports.filter(port => !['LISTENING', 'ESTABLISHED'].includes(port.state)).length} Other
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">TCP Connections</h4>
                <div className="text-2xl font-semibold text-slate-200">
                  {ports.filter(port => port.protocol === 'TCP').length}
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-slate-400 mb-2">UDP Endpoints</h4>
                <div className="text-2xl font-semibold text-slate-200">
                  {ports.filter(port => port.protocol === 'UDP').length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 text-sm font-medium text-slate-400 px-4">
              <div>Protocol</div>
              <div>Local Address</div>
              <div>Local Port</div>
              <div>Remote Address</div>
              <div>Remote Port</div>
              <div>State</div>
              <div>Process</div>
            </div>
            {ports.map((port, index) => (
              <div 
                key={index}
                className="grid grid-cols-7 gap-4 p-4 rounded-md hover:bg-slate-800/50"
              >
                <div>
                  <span className={
                    "px-2 py-1 rounded-full text-xs " + 
                    (port.protocol === "TCP" 
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-blue-500/20 text-blue-400")
                  }>
                    {port.protocol}
                  </span>
                </div>
                <div className="text-slate-300">{port.localAddress}</div>
                <div className="text-slate-300">{port.localPort}</div>
                <div className="text-slate-300">{port.remoteAddress || "*"}</div>
                <div className="text-slate-300">{port.remotePort || "*"}</div>
                <div>
                  <span className={
                    "px-2 py-1 rounded-full text-xs " + 
                    (port.state === "ESTABLISHED" 
                      ? "bg-green-500/20 text-green-400"
                      : port.state === "LISTENING"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400")
                  }>
                    {port.state}
                  </span>
                </div>
                <div>
                  <div className="text-slate-200">{port.process}</div>
                  <div className="text-sm text-slate-400">PID: {port.pid}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="text-sm text-slate-200">{value}</p>
    </div>
  );
}
