"use client";

import React, { useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from 'react';
import { Card, CardContent, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import Image from "next/image";
import { 
  UserIcon, 
  KeyIcon, 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon,
  PhotoIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/contexts/toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  position?: string;
  phone?: string;
  timezone: string;
  twoFactorEnabled: boolean;
  darkMode: boolean;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sample user profile data - would be fetched from API in real implementation
  const [profile, setProfile] = useState<UserProfile>({
    id: '123456',
    name: user?.displayName || 'User Name',
    email: user?.email || 'user@example.com',
    role: 'Administrator',
    avatar: user?.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
    department: 'IT Operations',
    position: 'System Administrator',
    phone: '(555) 123-4567',
    timezone: 'America/New_York',
    twoFactorEnabled: false,
    darkMode: true,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
    }
  });

  const handleProfileUpdate = (
    field: keyof UserProfile | 'notificationPreferences.email' | 'notificationPreferences.push' | 'notificationPreferences.sms', 
    value: string | boolean | string[]
  ) => {
    setProfile((prevProfile) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.') as [keyof UserProfile, keyof UserProfile['notificationPreferences']];
        return {
          ...prevProfile,
          [parent]: {
            ...prevProfile[parent] as Record<string, unknown>,
            [child]: value
          }
        };
      }
      return {
        ...prevProfile,
        [field]: value
      };
    });

    // Here you would typically make an API call to update the user profile
    // Simulate success with a small delay
    setIsLoading(true);
    setTimeout(() => {
      // If this is a name or email update, also update the auth context
      if (field === 'name' || field === 'email') {
        updateUserProfile({
          [field === 'name' ? 'displayName' : 'email']: value as string
        });
        toast?.showToast(`Your ${field} has been updated successfully`, "success");
      }
      setIsLoading(false);
    }, 800);
  };

  const handlePasswordChange = () => {
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    // Here you would typically make an API call to change the password
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close the modal after a short delay
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
      }, 1500);
    }, 1000);
  };

  const toggleTwoFactor = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProfile(prev => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled
      }));
      setIsLoading(false);
      setIsTwoFactorModalOpen(false);
    }, 1000);
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">User Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar with user info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    {profile.avatar ? (
                      <div className="relative w-24 h-24 mb-4">
                        <Image 
                          src={profile.avatar} 
                          alt={profile.name}
                          fill
                          className="rounded-full object-cover border-2 border-[#23a69a]"
                          sizes="(max-width: 768px) 100px, 96px"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full mb-4 bg-gray-700 flex items-center justify-center">
                        <UserIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <button 
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute bottom-4 right-0 bg-[#23a69a] hover:bg-[#1c8c82] rounded-full p-1 text-white"
                    >
                      <PhotoIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold mb-1">{profile.name}</h2>
                  <p className="text-gray-400 text-sm mb-3">{profile.role}</p>
                  <div className="w-full border-t border-gray-700 my-3 pt-3">
                    <div className="text-sm mb-2">
                      <span className="text-gray-400 block mb-1">Email</span>
                      <span>{profile.email}</span>
                    </div>
                    {profile.department && (
                      <div className="text-sm mb-2">
                        <span className="text-gray-400 block mb-1">Department</span>
                        <span>{profile.department}</span>
                      </div>
                    )}
                    {profile.position && (
                      <div className="text-sm mb-2">
                        <span className="text-gray-400 block mb-1">Position</span>
                        <span>{profile.position}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="mt-3 w-full"
                  >
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right content area with tabs */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="personal" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex items-center gap-2">
                      <CogIcon className="h-4 w-4" />
                      Preferences
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                      <BellIcon className="h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <ShieldCheckIcon className="h-4 w-4" />
                      Security
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Personal Info Tab */}
                  <TabsContent value="personal">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                            value={profile.name}
                            onChange={(e) => handleProfileUpdate('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                          <input
                            type="email"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                            value={profile.email}
                            onChange={(e) => handleProfileUpdate('email', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                            value={profile.department || ''}
                            onChange={(e) => handleProfileUpdate('department', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                            value={profile.position || ''}
                            onChange={(e) => handleProfileUpdate('position', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                            value={profile.phone || ''}
                            onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                          <input
                            type="text"
                            className="w-full p-2 bg-gray-600 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                            value={profile.role}
                            readOnly
                            disabled
                          />
                          <p className="text-xs text-gray-400 mt-1">Role cannot be changed. Contact administrator for role changes.</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Preferences Tab */}
                  <TabsContent value="preferences">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Dark Mode</h4>
                              <p className="text-sm text-gray-400">Use dark theme across the application</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={profile.darkMode} 
                                onChange={(e) => handleProfileUpdate('darkMode', e.target.checked)}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#23a69a]"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-medium mb-4">Regional Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Timezone</label>
                            <select
                              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                              value={profile.timezone}
                              onChange={(e) => handleProfileUpdate('timezone', e.target.value)}
                            >
                              {timezones.map((tz) => (
                                <option key={tz} value={tz}>
                                  {tz.replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Notifications Tab */}
                  <TabsContent value="notifications">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-400">Receive notifications via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={profile.notificationPreferences.email} 
                              onChange={(e) => handleProfileUpdate('notificationPreferences.email', e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#23a69a]"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-gray-400">Receive push notifications in browser</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={profile.notificationPreferences.push} 
                              onChange={(e) => handleProfileUpdate('notificationPreferences.push', e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#23a69a]"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">SMS Notifications</h4>
                            <p className="text-sm text-gray-400">Receive text messages for critical alerts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={profile.notificationPreferences.sms} 
                              onChange={(e) => handleProfileUpdate('notificationPreferences.sms', e.target.checked)}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#23a69a]"></div>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Security Tab */}
                  <TabsContent value="security">
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="font-medium">Password</h4>
                            <p className="text-sm text-gray-400">Change your account password</p>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsPasswordModalOpen(true)}
                          >
                            Change Password
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-400">{profile.twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Secure your account with two-factor authentication'}</p>
                          </div>
                          <Button 
                            variant={profile.twoFactorEnabled ? "outline" : "default"}
                            className={profile.twoFactorEnabled ? "" : "bg-[#23a69a] hover:bg-[#1c8c82] text-white"}
                            onClick={() => setIsTwoFactorModalOpen(true)}
                          >
                            {profile.twoFactorEnabled ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="font-medium">Session History</h4>
                            <p className="text-sm text-gray-400">View and manage your active sessions</p>
                          </div>
                          <Button variant="outline">
                            View Sessions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Transition appear show={isPasswordModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsPasswordModalOpen(false)}>
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
                      Change Password
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-white"
                      onClick={() => setIsPasswordModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {passwordSuccess ? (
                    <div className="p-4 bg-green-900/30 border border-green-700 rounded-md mb-4 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span>Password changed successfully!</span>
                    </div>
                  ) : passwordError ? (
                    <div className="p-4 bg-red-900/30 border border-red-700 rounded-md mb-4">
                      {passwordError}
                    </div>
                  ) : null}
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsPasswordModalOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePasswordChange}
                      disabled={isLoading || passwordSuccess}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Two-Factor Authentication Modal */}
      <Transition appear show={isTwoFactorModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsTwoFactorModalOpen(false)}>
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
                      {profile.twoFactorEnabled ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-white"
                      onClick={() => setIsTwoFactorModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="mt-2">
                    {profile.twoFactorEnabled ? (
                      <p className="text-sm text-gray-300">
                        Are you sure you want to disable two-factor authentication? This will make your account less secure.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-300">
                          Two-factor authentication adds an extra layer of security to your account. After enabling, you will need to enter a code from your authenticator app whenever you sign in.
                        </p>
                        <div className="p-4 bg-gray-700 rounded-md flex flex-col items-center">
                          <div className="w-48 h-48 bg-gray-600 rounded-md mb-3 flex items-center justify-center">
                            {/* This would be the QR code in a real implementation */}
                            <p className="text-center text-gray-400 p-4">QR Code placeholder for authenticator app</p>
                          </div>
                          <p className="text-sm text-gray-300 text-center">
                            Scan this QR code with your authenticator app
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Verification Code</label>
                          <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsTwoFactorModalOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant={profile.twoFactorEnabled ? "destructive" : "default"}
                      onClick={toggleTwoFactor}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </span>
                      ) : profile.twoFactorEnabled ? (
                        'Disable'
                      ) : (
                        'Enable'
                      )}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Avatar Change Modal */}
      <Transition appear show={isAvatarModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAvatarModalOpen(false)}>
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
                      Change Profile Picture
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-white"
                      onClick={() => setIsAvatarModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-center">
                      {profile.avatar ? (
                        <div className="relative w-32 h-32">
                          <Image 
                            src={profile.avatar} 
                            alt={profile.name}
                            fill
                            className="rounded-full object-cover border-2 border-[#23a69a]"
                            sizes="(max-width: 768px) 128px, 128px"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                          <UserIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        SVG, PNG, JPG or GIF (max. 2MB)
                      </p>
                      <input type="file" className="hidden" accept="image/*" />
                    </div>
                    
                    <p className="text-sm text-gray-400 text-center">
                      Or use a Gravatar based on your email address
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                      onClick={() => setIsAvatarModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#23a69a] rounded hover:bg-[#1c8c82] focus:outline-none"
                      onClick={() => setIsAvatarModalOpen(false)}
                    >
                      Save Changes
                    </button>
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

export default ProfilePage;
