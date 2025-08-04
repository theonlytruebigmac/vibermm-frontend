"use client";

import React, { useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from 'react';
import { Card, CardContent, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { 
  ExclamationCircleIcon, 
  PlusIcon, 
  XMarkIcon, 
  PencilIcon, 
  TrashIcon, 
  BellAlertIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";

// Define alert types and severity levels
type AlertSeverity = 'critical' | 'warning' | 'info';
type AlertCategory = 'system' | 'security' | 'performance' | 'availability' | 'backup' | 'custom';

interface AlertPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: AlertSeverity;
  category: AlertCategory;
  conditions: string;
  notificationChannels: string[];
  appliedTo: string[];
  createdAt: string;
}

interface AlertEvent {
  id: string;
  policyId: string;
  policyName: string;
  deviceName: string;
  company: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

const getSeverityColor = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'info': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getSeverityBgColor = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critical': return 'bg-red-600';
    case 'warning': return 'bg-yellow-500';
    case 'info': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

// Sample alert policies
const sampleAlertPolicies: AlertPolicy[] = [
  {
    id: 'ap-001',
    name: 'Critical CPU Usage',
    description: 'Alerts when CPU usage exceeds 90% for more than 10 minutes',
    enabled: true,
    severity: 'critical',
    category: 'performance',
    conditions: 'CPU usage > 90% for 10 minutes',
    notificationChannels: ['Email', 'Slack'],
    appliedTo: ['All Devices'],
    createdAt: '2025-07-15T10:30:00Z'
  },
  {
    id: 'ap-002',
    name: 'Low Disk Space',
    description: 'Alerts when disk space falls below 10%',
    enabled: true,
    severity: 'warning',
    category: 'system',
    conditions: 'Free disk space < 10%',
    notificationChannels: ['Email'],
    appliedTo: ['Windows Servers', 'Linux Servers'],
    createdAt: '2025-07-20T14:15:00Z'
  },
  {
    id: 'ap-003',
    name: 'Failed Backup',
    description: 'Alerts when a scheduled backup fails',
    enabled: true,
    severity: 'critical',
    category: 'backup',
    conditions: 'Backup status = Failed',
    notificationChannels: ['Email', 'SMS'],
    appliedTo: ['All Servers'],
    createdAt: '2025-07-25T09:45:00Z'
  },
  {
    id: 'ap-004',
    name: 'Security Updates Available',
    description: 'Notifies when security updates are available for installation',
    enabled: true,
    severity: 'info',
    category: 'security',
    conditions: 'Security updates available > 0',
    notificationChannels: ['Email'],
    appliedTo: ['Windows Devices', 'Linux Devices'],
    createdAt: '2025-07-28T11:20:00Z'
  }
];

// Sample alert events
const sampleAlertEvents: AlertEvent[] = [
  {
    id: 'ae-001',
    policyId: 'ap-001',
    policyName: 'Critical CPU Usage',
    deviceName: 'WEBSRV-01',
    company: 'Acme Corporation',
    message: 'CPU usage exceeded 90% for 15 minutes',
    severity: 'critical',
    timestamp: '2025-08-03T14:22:00Z',
    acknowledged: false
  },
  {
    id: 'ae-002',
    policyId: 'ap-002',
    policyName: 'Low Disk Space',
    deviceName: 'DBSRV-03',
    company: 'TechSolutions Inc.',
    message: 'Disk C: has only 8% free space remaining',
    severity: 'warning',
    timestamp: '2025-08-03T13:45:00Z',
    acknowledged: false
  },
  {
    id: 'ae-003',
    policyId: 'ap-003',
    policyName: 'Failed Backup',
    deviceName: 'FILSRV-02',
    company: 'Global Enterprises',
    message: 'Daily backup job failed: Access denied',
    severity: 'critical',
    timestamp: '2025-08-03T08:15:00Z',
    acknowledged: true,
    acknowledgedBy: 'Sarah Johnson',
    acknowledgedAt: '2025-08-03T09:22:00Z'
  },
  {
    id: 'ae-004',
    policyId: 'ap-004',
    policyName: 'Security Updates Available',
    deviceName: 'WKSTN-15',
    company: 'Acme Corporation',
    message: '12 security updates available for installation',
    severity: 'info',
    timestamp: '2025-08-02T22:10:00Z',
    acknowledged: false
  }
];

const AlertsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('active-alerts');
  const [alertPolicies, setAlertPolicies] = useState<AlertPolicy[]>(sampleAlertPolicies);
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>(sampleAlertEvents);
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState<boolean>(false);
  const [newPolicy, setNewPolicy] = useState<Partial<AlertPolicy>>({
    name: '',
    description: '',
    enabled: true,
    severity: 'warning',
    category: 'system',
    conditions: '',
    notificationChannels: ['Email'],
    appliedTo: []
  });
  const [isDeletePolicyModalOpen, setIsDeletePolicyModalOpen] = useState<boolean>(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);

  const handleAddPolicy = () => {
    if (!newPolicy.name) return;
    
    const policy: AlertPolicy = {
      ...newPolicy,
      id: `ap-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    } as AlertPolicy;
    
    setAlertPolicies([...alertPolicies, policy]);
    setIsAddPolicyModalOpen(false);
    setNewPolicy({
      name: '',
      description: '',
      enabled: true,
      severity: 'warning',
      category: 'system',
      conditions: '',
      notificationChannels: ['Email'],
      appliedTo: []
    });
  };

  const handleDeletePolicy = () => {
    if (policyToDelete) {
      setAlertPolicies(alertPolicies.filter(p => p.id !== policyToDelete));
      setPolicyToDelete(null);
      setIsDeletePolicyModalOpen(false);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlertEvents(alertEvents.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            acknowledged: true, 
            acknowledgedBy: 'Current User', 
            acknowledgedAt: new Date().toISOString() 
          } 
        : alert
    ));
  };

  const activeAlerts = alertEvents.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alertEvents.filter(alert => alert.acknowledged);

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Alerts</h1>
            <p className="text-gray-400">Monitor and configure alerts for your devices</p>
          </div>
          <Button 
            onClick={() => setActiveTab('alert-policies')}
            className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
            Manage Alert Policies
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active-alerts" className="flex items-center gap-2">
              <ExclamationCircleIcon className="h-5 w-5" />
              Active Alerts
              {activeAlerts.length > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {activeAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5" />
              Alert History
            </TabsTrigger>
            <TabsTrigger value="alert-policies" className="flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5" />
              Alert Policies
            </TabsTrigger>
          </TabsList>
          
          {/* Active Alerts Tab */}
          <TabsContent value="active-alerts">
            {activeAlerts.length === 0 ? (
              <Card className="mt-4">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <CheckCircleIcon className="h-16 w-16 text-[#23a69a] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No active alerts</h3>
                  <p className="text-gray-500 mb-4 text-center max-w-md">
                    All systems are operating normally. No alerts require your attention at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-900 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Severity</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Device</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Alert</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {activeAlerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <ComputerDesktopIcon className="h-5 w-5 text-[#23a69a] mr-2" />
                              <span>{alert.deviceName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{alert.company}</td>
                          <td className="px-6 py-4">{alert.message}</td>
                          <td className="px-6 py-4">{new Date(alert.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <Button 
                              variant="outline" 
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              className="text-sm"
                            >
                              Acknowledge
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Alert History Tab */}
          <TabsContent value="history">
            {acknowledgedAlerts.length === 0 ? (
              <Card className="mt-4">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <DocumentTextIcon className="h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No alert history</h3>
                  <p className="text-gray-500 mb-4 text-center max-w-md">
                    Alert history will appear here once alerts have been acknowledged
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-900 text-left">
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Severity</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Device</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Alert</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Acknowledged By</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Acknowledged At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {acknowledgedAlerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <ComputerDesktopIcon className="h-5 w-5 text-[#23a69a] mr-2" />
                              <span>{alert.deviceName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{alert.company}</td>
                          <td className="px-6 py-4">{alert.message}</td>
                          <td className="px-6 py-4">{new Date(alert.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4">{alert.acknowledgedBy}</td>
                          <td className="px-6 py-4">{alert.acknowledgedAt ? new Date(alert.acknowledgedAt).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Alert Policies Tab */}
          <TabsContent value="alert-policies">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => setIsAddPolicyModalOpen(true)}
                className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                New Alert Policy
              </Button>
            </div>
            
            {alertPolicies.length === 0 ? (
              <Card className="mt-4">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <DocumentTextIcon className="h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No alert policies configured</h3>
                  <p className="text-gray-500 mb-4 text-center max-w-md">
                    Create alert policies to monitor your devices and get notified when issues arise
                  </p>
                  <Button 
                    onClick={() => setIsAddPolicyModalOpen(true)}
                    className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Alert Policy
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alertPolicies.map((policy) => (
                  <Card key={policy.id} className="overflow-hidden">
                    <div className={`h-2 w-full ${getSeverityBgColor(policy.severity)}`}></div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <BellAlertIcon className="h-6 w-6 text-[#23a69a] mr-2" />
                          <h3 className="text-lg font-semibold">{policy.name}</h3>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-[#23a69a] hover:text-white p-1">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-400 hover:text-white p-1"
                            onClick={() => {
                              setPolicyToDelete(policy.id);
                              setIsDeletePolicyModalOpen(true);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-300 mb-4">{policy.description}</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                        <div className="text-gray-400">Severity:</div>
                        <div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(policy.severity)}`}>
                            {policy.severity.charAt(0).toUpperCase() + policy.severity.slice(1)}
                          </span>
                        </div>
                        <div className="text-gray-400">Category:</div>
                        <div className="capitalize">{policy.category}</div>
                        <div className="text-gray-400">Status:</div>
                        <div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {policy.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm mb-2">
                        <div className="text-gray-400 mb-1">Conditions:</div>
                        <div className="p-2 bg-gray-700 rounded">{policy.conditions}</div>
                      </div>
                      <div className="text-sm mb-2">
                        <div className="text-gray-400 mb-1">Applied To:</div>
                        <div className="flex flex-wrap gap-1">
                          {policy.appliedTo.map((target, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs">
                              {target}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-400 mb-1">Notification Channels:</div>
                        <div className="flex flex-wrap gap-1">
                          {policy.notificationChannels.map((channel, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Alert Policy Modal */}
      <Transition appear show={isAddPolicyModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddPolicyModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                      Create Alert Policy
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-white"
                      onClick={() => setIsAddPolicyModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Policy Name*</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newPolicy.name || ''}
                        onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newPolicy.description || ''}
                        onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                        rows={2}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Severity</label>
                      <select
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newPolicy.severity}
                        onChange={(e) => setNewPolicy({...newPolicy, severity: e.target.value as AlertSeverity})}
                      >
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                      <select
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newPolicy.category}
                        onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value as AlertCategory})}
                      >
                        <option value="system">System</option>
                        <option value="security">Security</option>
                        <option value="performance">Performance</option>
                        <option value="availability">Availability</option>
                        <option value="backup">Backup</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Conditions*</label>
                      <textarea
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newPolicy.conditions || ''}
                        onChange={(e) => setNewPolicy({...newPolicy, conditions: e.target.value})}
                        rows={3}
                        placeholder="e.g., CPU usage > 90% for 10 minutes"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Apply To</label>
                      <select
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newPolicy.appliedTo?.[0] || ''}
                        onChange={(e) => setNewPolicy({...newPolicy, appliedTo: [e.target.value]})}
                      >
                        <option value="All Devices">All Devices</option>
                        <option value="Windows Devices">Windows Devices</option>
                        <option value="Linux Devices">Linux Devices</option>
                        <option value="All Servers">All Servers</option>
                        <option value="Windows Servers">Windows Servers</option>
                        <option value="Linux Servers">Linux Servers</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="enabled"
                        type="checkbox"
                        className="h-4 w-4 text-[#23a69a] focus:ring-[#23a69a] border-gray-300 rounded"
                        checked={newPolicy.enabled}
                        onChange={(e) => setNewPolicy({...newPolicy, enabled: e.target.checked})}
                      />
                      <label htmlFor="enabled" className="ml-2 block text-sm text-gray-300">
                        Enable this alert policy
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsAddPolicyModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddPolicy}
                      disabled={!newPolicy.name || !newPolicy.conditions}
                    >
                      Create Policy
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Alert Policy Confirmation Modal */}
      <Transition appear show={isDeletePolicyModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeletePolicyModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                      Delete Alert Policy
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-white"
                      onClick={() => setIsDeletePolicyModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to delete this alert policy? This action cannot be undone.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsDeletePolicyModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeletePolicy}
                    >
                      Delete
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AlertsPage;
