"use client";
import { useState } from "react";
import { ToastProvider } from "./toast-context";
import { usePathname } from "next/navigation";

const navLinks = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
				/>
			</svg>
		),
	},
	{
		href: "/devices",
		label: "Devices",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect width="20" height="14" x="2" y="5" rx="2" />
				<path d="M8 21h8" />
			</svg>
		),
	},
	{
		href: "/monitoring",
		label: "Monitoring",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M3 12h3l3 8 4-16 3 8h4" />
			</svg>
		),
	},
	{
		href: "/asset-inventory",
		label: "Asset Inventory",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect width="18" height="14" x="3" y="5" rx="2" />
				<path d="M7 10h10M7 14h6" />
			</svg>
		),
	},
	{
		href: "/automation",
		label: "Automation",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 6v6l4 2" />
			</svg>
		),
	},
	{
		href: "/rules",
		label: "Rules",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<rect width="18" height="14" x="3" y="5" rx="2" />
				<path d="M7 10h10M7 14h6" />
			</svg>
		),
	},
	{
		href: "/reports",
		label: "Reports",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<path d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2" />
				<rect width="20" height="14" x="2" y="5" rx="2" />
			</svg>
		),
	},
	{
		href: "/settings",
		label: "Settings",
		icon: (
			<svg
				className="w-5 h-5 mr-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
			>
				<circle cx="12" cy="12" r="3" />
				<path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
				/>
			</svg>
		),
	},
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();
	return (
		<ToastProvider>
			<div className="flex min-h-screen bg-neutral-950">
				<aside className="fixed md:sticky top-0 left-0 h-screen w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0 translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out">
					<div className="flex items-center gap-2 px-6 py-6 border-b border-neutral-800">
						<span className="font-bold text-2xl tracking-tight text-white">
							VibeRMM
						</span>
					</div>
					<nav className="flex-1 flex flex-col gap-1 mt-6 px-2">
						{navLinks.map(({ href, label, icon }) => {
							const isActive = pathname === href;
							const linkClass = `flex items-center px-4 py-2 rounded-lg text-base font-medium transition-colors mb-1 focus:outline-none focus:bg-blue-900/80 ${
								isActive ? "bg-blue-900/80 text-white" : "text-neutral-300 hover:bg-blue-900/40 hover:text-white"
							}`;
							
							return (
								<a
									key={href}
									href={href}
									className={linkClass}
								>
									{icon}
									{label}
								</a>
							);
						})}
					</nav>
				</aside>
				{/* Overlay for mobile */}
				{sidebarOpen && (
					<div
						className="fixed inset-0 z-30 bg-black/40 md:hidden"
						onClick={() => setSidebarOpen(false)}
					/>
				)}
				{/* Main content area */}
				<div className="flex-1 flex flex-col min-w-0">
					<header className="h-16 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4">
						<button
							type="button"
							className="md:hidden text-gray-400 hover:text-white"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<svg
								width="28"
								height="28"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
						<div className="flex items-center gap-4">
							<button className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-gray-200 border border-blue-900">
								N
							</button>
						</div>
					</header>
					<main className="flex-1 p-4 lg:p-8">
						{children}
					</main>
				</div>
			</div>
		</ToastProvider>
	);
}
