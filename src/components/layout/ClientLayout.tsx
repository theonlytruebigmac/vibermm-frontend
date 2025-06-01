"use client";
import React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/contexts/toast";
import {
  HomeIcon,
  ComputerDesktopIcon,
  BellAlertIcon,
  ClipboardDocumentListIcon,
  CommandLineIcon,
  Cog6ToothIcon,
  CircleStackIcon
} from "@heroicons/react/24/outline";

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/devices", label: "Devices", icon: ComputerDesktopIcon },
  { href: "/monitoring", label: "Monitoring", icon: BellAlertIcon },
  { href: "/asset-inventory", label: "Asset Inventory", icon: CircleStackIcon },
  { href: "/automation", label: "Automation", icon: CommandLineIcon },
  { href: "/reports", label: "Reports", icon: ClipboardDocumentListIcon },
  { href: "/settings", label: "Settings", icon: Cog6ToothIcon },
];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

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
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-900 hover:text-white transition-colors ${
                          pathname === link.href ? "bg-gray-900 text-white" : ""
                        } ${isSidebarCollapsed ? "justify-center p-0" : ""}`}
                      >
                        <Icon className={`h-6 w-6${!isSidebarCollapsed ? " mr-3" : ""}`} />
                        <span className={isSidebarCollapsed ? "hidden" : "block"}>{link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

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
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-4">
            {/* Left side - empty or for breadcrumbs */}
            <div></div>
            
            {/* Right side - user profile */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-200">John Doe</span>
                <span className="text-xs text-gray-400">Administrator</span>
              </div>
              <div className="h-10 w-10 bg-gray-900 rounded-full flex items-center justify-center border-2 border-blue-500">
                <span className="text-lg font-semibold text-gray-200">JD</span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
