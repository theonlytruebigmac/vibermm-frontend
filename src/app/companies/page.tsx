"use client";

import React, { useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from 'react';
import { Card, CardContent, Button } from "@/components/ui";
import { BuildingOffice2Icon, PlusIcon, XMarkIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Company {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
  sites: number;
  assets: number;
}

// Sample company data for demonstration
const sampleCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    contactName: 'John Smith',
    email: 'john@acmecorp.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    active: true,
    sites: 3,
    assets: 45
  },
  {
    id: '2',
    name: 'TechSolutions Inc.',
    contactName: 'Sarah Johnson',
    email: 'sarah@techsolutions.com',
    phone: '(555) 987-6543',
    address: '456 Tech Blvd, Innovation City, USA',
    active: true,
    sites: 2,
    assets: 32
  },
  {
    id: '3',
    name: 'Global Enterprises',
    contactName: 'Michael Chen',
    email: 'michael@globalent.com',
    phone: '(555) 555-5555',
    address: '789 Global Ave, Metropolis, USA',
    active: false,
    sites: 5,
    assets: 78
  }
];

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(sampleCompanies);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    active: true,
    sites: 0,
    assets: 0
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const handleAddCompany = () => {
    if (!newCompany.name) return;
    
    const company: Company = {
      ...newCompany as Company,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setCompanies([...companies, company]);
    setIsAddModalOpen(false);
    setNewCompany({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      active: true,
      sites: 0,
      assets: 0
    });
  };

  const handleDeleteCompany = () => {
    if (companyToDelete) {
      setCompanies(companies.filter(c => c.id !== companyToDelete));
      setCompanyToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="w-full h-full p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Companies</h1>
            <p className="text-gray-400">Manage your customers and sites</p>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Company
          </Button>
        </div>
        
        {companies.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <BuildingOffice2Icon className="h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No companies added yet</h3>
              <p className="text-gray-500 mb-4 text-center max-w-md">
                Add your first company to start managing their assets and sites in VibeRMM
              </p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#23a69a] hover:bg-[#1c8c82] text-white"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Company
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-900 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Sites</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Assets</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <BuildingOffice2Icon className="h-5 w-5 text-[#23a69a] mr-2" />
                          <span>{company.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{company.contactName}</td>
                      <td className="px-6 py-4">{company.email}</td>
                      <td className="px-6 py-4">{company.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          company.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {company.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{company.sites}</td>
                      <td className="px-6 py-4">{company.assets}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-[#23a69a] hover:text-white">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-400 hover:text-white"
                            onClick={() => {
                              setCompanyToDelete(company.id);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddModalOpen(false)}>
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
                      Add New Company
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-white"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Company Name*</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newCompany.name}
                        onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Contact Name</label>
                      <input
                        type="text"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newCompany.contactName}
                        onChange={(e) => setNewCompany({...newCompany, contactName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newCompany.email}
                        onChange={(e) => setNewCompany({...newCompany, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newCompany.phone}
                        onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                      <textarea
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-[#23a69a] focus:border-[#23a69a] outline-none"
                        value={newCompany.address}
                        onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="active"
                        type="checkbox"
                        className="h-4 w-4 text-[#23a69a] focus:ring-[#23a69a] border-gray-300 rounded"
                        checked={newCompany.active}
                        onChange={(e) => setNewCompany({...newCompany, active: e.target.checked})}
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-gray-300">
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddCompany}
                      disabled={!newCompany.name}
                    >
                      Add Company
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
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
                      Confirm Deletion
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-white"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to delete this company? This action cannot be undone and will remove all associated data including sites and assets.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteCompany}
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

export default CompaniesPage;