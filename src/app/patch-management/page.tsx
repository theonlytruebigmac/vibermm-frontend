"use client";

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { usePatch, PatchProfile, DeploymentRule } from '@/contexts/patch';

interface PatchStatus {
  id: string;
  deviceId: string;
  deviceName: string;
  osType: string;
  osVersion: string;
  critical: number;
  important: number;
  moderate: number;
  low: number;
  lastScanned: string;
  status: string;
}

export default function PatchManagementPage() {
  const [activeTab, setActiveTab] = useState('status');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<PatchProfile | null>(null);
  const [ruleToEdit, setRuleToEdit] = useState<DeploymentRule | null>(null);
  const { addProfile, updateProfile, addDeploymentRule, updateDeploymentRule } = usePatch();

  const handleEditProfile = (profile: PatchProfile) => {
    setProfileToEdit(profile);
    setShowProfileForm(true);
  };

  const handleSaveProfile = (profileData: Omit<PatchProfile, 'id'>) => {
    if (profileToEdit) {
      updateProfile(profileToEdit.id, profileData);
    } else {
      addProfile(profileData);
    }
    setShowProfileForm(false);
    setProfileToEdit(null);
  };

  const handleEditRule = (rule: DeploymentRule) => {
    setRuleToEdit(rule);
    setShowRuleForm(true);
  };

  const handleSaveRule = (ruleData: Omit<DeploymentRule, 'id'>) => {
    if (ruleToEdit) {
      updateDeploymentRule(ruleToEdit.id, ruleData);
    } else {
      addDeploymentRule(ruleData);
    }
    setShowRuleForm(false);
    setRuleToEdit(null);
  };

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Patch Management</h1>
            <p className="text-gray-400">Monitor and manage system patches across all devices</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="status">Patch Status</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="rules">Deployment Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-6">
              <PatchStatusOverview />
            </TabsContent>

            <TabsContent value="profiles" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg font-semibold">Patch Profiles</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      Configure patch profiles to manage updates
                    </CardDescription>
                  </div>
                  <button 
                    onClick={() => {
                      setProfileToEdit(null);
                      setShowProfileForm(true);
                    }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 bg-blue-600 hover:bg-blue-700"
                  >
                    New Profile
                  </button>
                </CardHeader>
                <CardContent>
                  <PatchProfilesList onEditProfile={handleEditProfile} />
                </CardContent>
              </Card>

              {showProfileForm && (
                <ProfileForm 
                  profile={profileToEdit} 
                  onSave={handleSaveProfile} 
                  onCancel={() => {
                    setShowProfileForm(false);
                    setProfileToEdit(null);
                  }} 
                />
              )}
            </TabsContent>

            <TabsContent value="rules" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg font-semibold">Deployment Rules</CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      Configure when and how patches are deployed
                    </CardDescription>
                  </div>
                  <button 
                    onClick={() => {
                      setRuleToEdit(null);
                      setShowRuleForm(true);
                    }}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 bg-blue-600 hover:bg-blue-700"
                  >
                    New Rule
                  </button>
                </CardHeader>
                <CardContent>
                  <DeploymentRulesList onEditRule={handleEditRule} />
                </CardContent>
              </Card>

              {showRuleForm && (
                <DeploymentRuleForm 
                  rule={ruleToEdit} 
                  onSave={handleSaveRule} 
                  onCancel={() => {
                    setShowRuleForm(false);
                    setRuleToEdit(null);
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PatchStatusOverview() {
  const { stats, refreshPatchStatus, deployPatches } = usePatch();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showDeployConfirmation, setShowDeployConfirmation] = useState(false);
  const [deviceDetailsId, setDeviceDetailsId] = useState<string | null>(null);

  const handleDeviceSelection = (deviceIds: string[]) => {
    setSelectedDevices(deviceIds);
  };

  const handleDeployPatches = async () => {
    await deployPatches(selectedDevices);
    setShowDeployConfirmation(false);
    setSelectedDevices([]);
  };

  const handleViewDetails = (deviceId: string) => {
    setDeviceDetailsId(deviceId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => refreshPatchStatus()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 bg-blue-600 hover:bg-blue-700"
          >
            Run Assessment
          </button>
          <button 
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 shadow ${
              selectedDevices.length > 0 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
            }`}
            onClick={() => selectedDevices.length > 0 && setShowDeployConfirmation(true)}
            disabled={selectedDevices.length === 0}
          >
            Deploy Patches {selectedDevices.length > 0 && `(${selectedDevices.length})`}
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg font-semibold">Patch Status Overview</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Current status of patches across all devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <StatusCard title="Up to Date" count={stats.upToDate} percentage={Math.round((stats.upToDate / (stats.upToDate + stats.needsAttention + stats.critical + stats.notAssessed)) * 100) || 0} color="green" />
            <StatusCard title="Needs Attention" count={stats.needsAttention} percentage={Math.round((stats.needsAttention / (stats.upToDate + stats.needsAttention + stats.critical + stats.notAssessed)) * 100) || 0} color="amber" />
            <StatusCard title="Critical Updates" count={stats.critical} percentage={Math.round((stats.critical / (stats.upToDate + stats.needsAttention + stats.critical + stats.notAssessed)) * 100) || 0} color="red" />
            <StatusCard title="Not Assessed" count={stats.notAssessed} percentage={Math.round((stats.notAssessed / (stats.upToDate + stats.needsAttention + stats.critical + stats.notAssessed)) * 100) || 0} color="gray" />
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Device Patch Status</h3>
            <PatchStatusTable 
              onDeviceSelection={handleDeviceSelection} 
              onViewDetails={handleViewDetails}
            />
          </div>
        </CardContent>
      </Card>

      {showDeployConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Deploy Patches
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to deploy patches to {selectedDevices.length} selected {selectedDevices.length === 1 ? 'device' : 'devices'}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeployConfirmation(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeployPatches}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Deploy Patches
              </button>
            </div>
          </div>
        </div>
      )}

      {deviceDetailsId && (
        <DeviceDetailsModal 
          deviceId={deviceDetailsId} 
          onClose={() => setDeviceDetailsId(null)} 
        />
      )}
    </div>
  );
}

function PatchStatusTable({ 
  onDeviceSelection,
  onViewDetails
}: { 
  onDeviceSelection: (deviceIds: string[]) => void;
  onViewDetails: (deviceId: string) => void;
}) {
  const { patchStatusList } = usePatch();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof PatchStatus>('deviceName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = filteredAndSortedDevices.map(device => device.deviceId);
      setSelectedDevices(newSelected);
      onDeviceSelection(newSelected);
    } else {
      setSelectedDevices([]);
      onDeviceSelection([]);
    }
  };

  const handleSelectDevice = (deviceId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedDevices, deviceId]
      : selectedDevices.filter(id => id !== deviceId);
    setSelectedDevices(newSelected);
    onDeviceSelection(newSelected);
  };

  const handleSort = (field: keyof PatchStatus) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedDevices = useMemo(() => {
    let result = [...patchStatusList];
    
    if (filterText) {
      const lowerFilter = filterText.toLowerCase();
      result = result.filter(device => 
        device.deviceName.toLowerCase().includes(lowerFilter) ||
        device.osType.toLowerCase().includes(lowerFilter) ||
        device.osVersion.toLowerCase().includes(lowerFilter) ||
        device.status.toLowerCase().includes(lowerFilter)
      );
    }
    
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      return 0;
    });
    
    return result;
  }, [patchStatusList, filterText, sortField, sortDirection]);

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Filter devices..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
          />
          <span className="absolute right-2 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
        
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
            {selectedDevices.length} of {filteredAndSortedDevices.length} selected
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedDevices.length === filteredAndSortedDevices.length && filteredAndSortedDevices.length > 0}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('deviceName')}
              >
                Device
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('osVersion')}
              >
                OS
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('critical')}
              >
                Critical
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('important')}
              >
                Important
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('moderate')}
              >
                Moderate
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('low')}
              >
                Low
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('lastScanned')}
              >
                Last Updated
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredAndSortedDevices.map((device) => (
              <tr key={device.id} className={selectedDevices.includes(device.deviceId) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.deviceId)}
                    onChange={(e) => handleSelectDevice(device.deviceId, e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{device.deviceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.osVersion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {device.critical > 0 ? <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">{device.critical}</span> : device.critical}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {device.important > 0 ? <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">{device.important}</span> : device.important}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.moderate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.low}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{device.lastScanned}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge status={device.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button 
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => onViewDetails(device.deviceId)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {filteredAndSortedDevices.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No devices match your filter criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusCard({ 
  title, 
  count, 
  percentage, 
  color 
}: { 
  title: string; 
  count: number; 
  percentage: number; 
  color: string;
}) {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'amber': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold">{count}</p>
        <p className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getColorClass(color)}`}>
          {percentage}%
        </p>
      </div>
    </div>
  );
}

function PatchProfilesList({ 
  onEditProfile 
}: { 
  onEditProfile: (profile: PatchProfile) => void;
}) {
  const { profiles } = usePatch();

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <div key={profile.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{profile.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.description}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-4">{profile.deviceCount} Devices</span>
                <span>Last modified: {profile.lastModified}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onEditProfile(profile)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Edit
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                Duplicate
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DeploymentRulesList({ 
  onEditRule 
}: { 
  onEditRule: (rule: DeploymentRule) => void;
}) {
  const { deploymentRules } = usePatch();

  return (
    <div className="space-y-4">
      {deploymentRules.map((rule) => (
        <div key={rule.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{rule.name}</h3>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${rule.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                  {rule.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{rule.description}</p>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-medium">Schedule:</span> {rule.schedule}
                </div>
                <div>
                  <span className="font-medium">Targets:</span> {rule.targets}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onEditRule(rule)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                Edit
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
                {rule.status === 'Active' ? 'Pause' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileForm({ 
  profile, 
  onSave, 
  onCancel 
}: { 
  profile: PatchProfile | null; 
  onSave: (profile: Omit<PatchProfile, 'id'>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Omit<PatchProfile, 'id'>>({
    name: profile?.name || '',
    description: profile?.description || '',
    deviceCount: profile?.deviceCount || 0,
    lastModified: profile?.lastModified || new Date().toISOString().split('T')[0],
    settings: profile?.settings || {
      autoApprove: false,
      autoApproveCategories: [],
      schedule: {
        enabled: false,
        type: 'weekly',
        time: '00:00',
        days: ['Monday']
      }
    }
  });

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingsChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const handleScheduleChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        schedule: {
          ...prev.settings.schedule,
          [field]: value
        }
      }
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      handleSettingsChange('autoApproveCategories', [...formData.settings.autoApproveCategories, category]);
    } else {
      handleSettingsChange(
        'autoApproveCategories', 
        formData.settings.autoApproveCategories.filter(c => c !== category)
      );
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      lastModified: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile ? 'Edit Profile' : 'Create New Profile'}</CardTitle>
        <CardDescription>Configure patch management settings for devices</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-Approve Settings</p>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={formData.settings.autoApprove}
                  onChange={(e) => handleSettingsChange('autoApprove', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="autoApprove" className="text-sm text-gray-700 dark:text-gray-300">
                  Automatically approve patches
                </label>
              </div>
              
              <div className="pl-6 space-y-2 mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">Categories to auto-approve:</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {['critical', 'security', 'feature', 'driver'].map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={formData.settings.autoApproveCategories.includes(category)}
                        onChange={(e) => handleCategoryChange(category, e.target.checked)}
                        disabled={!formData.settings.autoApprove}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category}`} className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Settings</p>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="scheduleEnabled"
                  checked={formData.settings.schedule.enabled}
                  onChange={(e) => handleScheduleChange('enabled', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="scheduleEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable scheduled patching
                </label>
              </div>
              
              <div className="pl-6 space-y-4 mt-2">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.settings.schedule.type}
                    onChange={(e) => handleScheduleChange('type', e.target.value)}
                    disabled={!formData.settings.schedule.enabled}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.settings.schedule.time}
                    onChange={(e) => handleScheduleChange('time', e.target.value)}
                    disabled={!formData.settings.schedule.enabled}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                  />
                </div>
                
                {formData.settings.schedule.type === 'weekly' && (
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Days of Week
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                        <div key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`day-${day}`}
                            checked={formData.settings.schedule.days?.includes(day) || false}
                            onChange={(e) => {
                              const days = formData.settings.schedule.days || [];
                              if (e.target.checked) {
                                handleScheduleChange('days', [...days, day]);
                              } else {
                                handleScheduleChange('days', days.filter(d => d !== day));
                              }
                            }}
                            disabled={!formData.settings.schedule.enabled}
                            className="mr-2"
                          />
                          <label htmlFor={`day-${day}`} className="text-sm text-gray-700 dark:text-gray-300">
                            {day.slice(0, 3)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.settings.schedule.type === 'monthly' && (
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                      Day of Month
                    </label>
                    <select
                      value={formData.settings.schedule.date || 1}
                      onChange={(e) => handleScheduleChange('date', parseInt(e.target.value))}
                      disabled={!formData.settings.schedule.enabled}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DeploymentRuleForm({ 
  rule, 
  onSave, 
  onCancel 
}: { 
  rule: DeploymentRule | null; 
  onSave: (rule: Omit<DeploymentRule, 'id'>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Omit<DeploymentRule, 'id'>>({
    name: rule?.name || '',
    description: rule?.description || '',
    schedule: rule?.schedule || '',
    targets: rule?.targets || '',
    status: rule?.status || 'Active',
    conditions: rule?.conditions || [
      { type: 'deviceType', value: '' },
      { type: 'online', value: 'true' }
    ],
    actions: rule?.actions || [
      { type: 'install', value: 'approved' },
      { type: 'restart', value: 'ifNeeded' }
    ]
  });

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConditionChange = (index: number, field: string, value: string) => {
    const updatedConditions = [...formData.conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      [field]: value
    };
    handleChange('conditions', updatedConditions);
  };

  const handleActionChange = (index: number, field: string, value: string) => {
    const updatedActions = [...formData.actions];
    updatedActions[index] = {
      ...updatedActions[index],
      [field]: value
    };
    handleChange('actions', updatedActions);
  };

  const addCondition = () => {
    handleChange('conditions', [...formData.conditions, { type: 'deviceType', value: '' }]);
  };

  const removeCondition = (index: number) => {
    handleChange('conditions', formData.conditions.filter((_, i) => i !== index));
  };

  const addAction = () => {
    handleChange('actions', [...formData.actions, { type: 'install', value: '' }]);
  };

  const removeAction = (index: number) => {
    handleChange('actions', formData.actions.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{rule ? 'Edit Deployment Rule' : 'Create New Deployment Rule'}</CardTitle>
        <CardDescription>Configure when and how patches are deployed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rule Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Schedule
              </label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => handleChange('schedule', e.target.value)}
                placeholder="e.g., Daily at 10:00 PM, Weekdays 2:00 PM - 4:00 PM"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Devices
              </label>
              <input
                type="text"
                value={formData.targets}
                onChange={(e) => handleChange('targets', e.target.value)}
                placeholder="e.g., All Workstations, Production Servers"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as 'Active' | 'Paused')}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Conditions</p>
                <button
                  type="button"
                  onClick={addCondition}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add Condition
                </button>
              </div>
              
              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={condition.type}
                    onChange={(e) => handleConditionChange(index, 'type', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                  >
                    <option value="deviceType">Device Type</option>
                    <option value="tag">Tag</option>
                    <option value="online">Online Status</option>
                    <option value="osType">OS Type</option>
                    <option value="osVersion">OS Version</option>
                  </select>
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.conditions.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Actions</p>
                <button
                  type="button"
                  onClick={addAction}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Add Action
                </button>
              </div>
              
              {formData.actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={action.type}
                    onChange={(e) => handleActionChange(index, 'type', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                  >
                    <option value="install">Install Patches</option>
                    <option value="restart">Restart</option>
                    <option value="notify">Notify</option>
                  </select>
                  <input
                    type="text"
                    value={action.value}
                    onChange={(e) => handleActionChange(index, 'value', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeAction(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.actions.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Rule
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface ModalProps {
  deviceId: string;
  onClose: () => void;
}

function DeviceDetailsModal({ 
  deviceId, 
  onClose 
}: ModalProps) {
  const { patchStatusList } = usePatch();
  const device = patchStatusList.find(d => d.deviceId === deviceId);
  
  // Mock data for available updates that would come from an API
  const availableUpdates = [
    { id: 'update-1', name: 'Windows Security Update KB5020953', severity: 'Critical', category: 'Security', size: '35 MB', releaseDate: '2025-05-15' },
    { id: 'update-2', name: 'Microsoft Office Update KB5020123', severity: 'Important', category: 'Feature', size: '22 MB', releaseDate: '2025-05-10' },
    { id: 'update-3', name: 'Windows Defender Update KB5021567', severity: 'Moderate', category: 'Security', size: '18 MB', releaseDate: '2025-05-12' },
    { id: 'update-4', name: 'Microsoft Edge Update', severity: 'Low', category: 'Feature', size: '45 MB', releaseDate: '2025-05-20' },
  ];
  
  // Mock patch history data
  const patchHistory = [
    { id: 'patch-1', name: 'Windows Update KB5019322', installDate: '2025-04-25', status: 'Installed', result: 'Success' },
    { id: 'patch-2', name: 'Microsoft Office Update KB5012345', installDate: '2025-04-10', status: 'Installed', result: 'Success' },
    { id: 'patch-3', name: 'Windows Security Update KB5011234', installDate: '2025-03-15', status: 'Installed', result: 'Success' },
  ];
  
  if (!device) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Device Not Found
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            The requested device could not be found.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {device.deviceName} - Patch Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-md font-medium mb-3 text-gray-900 dark:text-white">Device Information</h4>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 text-sm text-gray-500 dark:text-gray-400">OS:</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{device.osType} {device.osVersion}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm text-gray-500 dark:text-gray-400">Status:</span>
                <span className="text-sm"><StatusBadge status={device.status} /></span>
              </div>
              <div className="flex">
                <span className="w-32 text-sm text-gray-500 dark:text-gray-400">Last Scanned:</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{device.lastScanned}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3 text-gray-900 dark:text-white">Patch Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">{device.critical}</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Important</p>
                <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{device.important}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Moderate</p>
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{device.moderate}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Low</p>
                <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">{device.low}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3 text-gray-900 dark:text-white">Available Updates</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Update</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Released</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {availableUpdates.map((update) => (
                  <tr key={update.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{update.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        update.severity === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        update.severity === 'Important' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                        update.severity === 'Moderate' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {update.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{update.category}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{update.size}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{update.releaseDate}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors">
                        Install
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-3 text-gray-900 dark:text-white">Patch History</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Update</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Install Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {patchHistory.map((patch) => (
                  <tr key={patch.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{patch.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{patch.installDate}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{patch.status}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patch.result === 'Success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {patch.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Deploy All Updates
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Up to Date':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Needs Attention':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(status)}`}>
      {status}
    </span>
  );
}
