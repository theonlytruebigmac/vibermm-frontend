"use client";
import React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ToastProvider } from "@/contexts/toast";
import { useAuth } from "@/contexts/auth";
import {
  BuildingOffice2Icon,
  ExclamationCircleIcon,
  CogIcon,
  Squares2X2Icon,
  ChartBarIcon,
  KeyIcon,
  ComputerDesktopIcon,
  ArrowPathIcon, // for Monitoring
  DocumentDuplicateIcon // for Workflows
} from "@heroicons/react/24/outline";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboards", icon: Squares2X2Icon },
  { href: "/companies", label: "Companies", icon: BuildingOffice2Icon },
  { href: "/assets", label: "Assets", icon: ComputerDesktopIcon },
  { href: "/alerts", label: "Alerts", icon: ExclamationCircleIcon },
  { href: "/monitoring", label: "Monitoring", icon: ArrowPathIcon }, // replaced HeartPulseIcon
  { href: "/patching", label: "Patching", icon: CogIcon },
  { href: "/workflows", label: "Workflows", icon: DocumentDuplicateIcon }, // replaced FlowIcon
  { href: "/reporting", label: "Reporting", icon: ChartBarIcon },
  { href: "/settings", label: "Settings", icon: KeyIcon },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static lg:block z-20 transition-all bg-gray-800 h-full ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4">
              <span className={`font-bold text-xl ${isSidebarCollapsed ? "hidden" : "block"}`}>
                VibeRMM
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="py-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  // You may want to add your <li> rendering here
                  return (
                    <li key={link.href} className={`mb-2 ${isActive ? "bg-gray-700" : ""}`}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                      >
                        <Icon className="h-6 w-6 text-[#23a69a]" />
                        {!isSidebarCollapsed && <span>{link.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* User profile at bottom, styled like navigation items */}
            <div className="mt-auto px-4 relative">
              <button
                onClick={() => setUserMenuOpen((open) => !open)}
                className="w-full flex items-center gap-3 px-4 py-2 mb-2 rounded hover:bg-gray-700 transition-colors focus:outline-none"
                aria-label="User menu"
              >
                {user?.email ? (
                  <Image
                    src={`https://www.gravatar.com/avatar/${user.email.trim().toLowerCase().split('').reduce((hash, c) => {
                      hash = ((hash << 5) - hash) + c.charCodeAt(0);
                      return hash & hash;
                    }, 0)}?d=identicon`}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon"
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                {!isSidebarCollapsed && (
                  <span className="text-gray-300">{user?.email || "Zachery Frazier"}</span>
                )}
              </button>
              {/* Popout user menu */}
              {userMenuOpen && (
                <div className="absolute left-full bottom-0 mb-4 ml-2 w-48 bg-gray-800 rounded shadow-lg z-50 flex flex-col py-2">
                  <Link href="/settings" className="px-4 py-2 flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-700 text-left">
                    <CogIcon className="h-5 w-5" />
                    <span>User Settings</span>
                  </Link>
                  <hr className="my-1 border-gray-700" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="px-4 py-2 flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Collapse Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="flex items-center justify-center h-16 w-full hover:bg-gray-900 transition-colors"
            >
              <svg
                className={`w-6 h-6 transition-transform ${isSidebarCollapsed ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Removed empty header to shift main content up */}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
