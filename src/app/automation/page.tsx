"use client";
import React, { useState, useRef } from "react";

// Example data for scripts
const scripts = [
	{
		name: "Example Powershell 1",
		type: "PowerShell",
		category: "Alerts",
		description:
			"This closes an open RMM alert on this asset. This can optionally close tickets that were opened as a result of this alert",
		created: "Sat 05-31-25 07:34 PM",
		scheduledRuns: 0,
	},
	{
		name: "Example Powershell 2",
		type: "PowerShell",
		category: "Alerts",
		description:
			"This fires a custom RMM alert associated with this asset. These can be picked up and used as a condition in our Automated Remediation module",
		created: "Sat 05-31-25 07:34 PM",
		scheduledRuns: 0,
	},
	// ...add more scripts as needed
];

const categories = [
	"All Categories",
	"Alerts",
	"Assets",
	"Email",
	"Event Log",
	"Files",
	"Notifications",
	"Registry",
];

function ScriptRowMenu({ onClose }: { onClose: () => void }) {
	return (
		<div className="absolute right-2 top-8 z-20 w-64 rounded-lg border border-gray-700 bg-gray-800 shadow-lg py-2 text-sm">
			<button
				className="flex items-center w-full px-4 py-2 hover:bg-gray-700 text-left"
				onClick={onClose}
			>
				<span className="mr-2">✏️</span> Edit
			</button>
			<button
				className="flex items-center w-full px-4 py-2 hover:bg-gray-700 text-left"
				onClick={onClose}
			>
				<span className="mr-2">📋</span> Clone
			</button>
			<button
				className="flex items-center w-full px-4 py-2 hover:bg-neutral-800 text-left"
				onClick={onClose}
			>
				Scheduled Runs
			</button>
			<button
				className="flex items-center w-full px-4 py-2 hover:bg-neutral-800 text-left"
				onClick={onClose}
			>
				Add Favorite
			</button>
			<button
				className="flex items-center w-full px-4 py-2 hover:bg-neutral-800 text-left"
				onClick={onClose}
			>
				Make Available on Customer Portal
			</button>
			<button
				className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-red-900/50 text-left"
				onClick={onClose}
			>
				Delete
			</button>
		</div>
	);
}

export default function AutomationPage() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("All Categories");
	const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const filteredScripts = scripts.filter(
		(script) =>
			(category === "All Categories" || script.category === category) &&
			script.name.toLowerCase().includes(search.toLowerCase())
	);

	// Close menu on outside click
	React.useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpenMenuIdx(null);
			}
		}
		if (openMenuIdx !== null) {
			document.addEventListener("mousedown", handleClick);
		}
		return () => document.removeEventListener("mousedown", handleClick);
	}, [openMenuIdx]);

	return (
		<div className="w-full h-full p-6 md:p-10">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<h1 className="text-3xl font-bold">Scripts</h1>
					<div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="Search 20 Scripts..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="px-3 py-1.5 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 transition"
							/>
							<button className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
								Search
							</button>
						</div>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="px-3 py-1.5 rounded border border-gray-700 bg-gray-700 text-sm focus:outline-none"
						>
							{categories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
						<button className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
							+ New Script
						</button>
						<button className="px-4 py-1.5 rounded bg-neutral-800 text-neutral-100 font-semibold hover:bg-neutral-700 transition">
							Add New File
						</button>
					</div>
				</div>

				<div className="rounded-xl border border-gray-700 bg-gray-800 shadow-sm overflow-x-auto mx-auto min-h-[600px] w-full">
					<table className="min-w-full divide-y divide-neutral-800">
						<thead>
							<tr className="bg-gray-900">
								<th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									<input type="checkbox" />
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Name
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Type
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Category
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Description
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Created
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Scheduled Runs
								</th>
								<th className="px-4 py-3"></th>
							</tr>
						</thead>
						<tbody className="bg-gray-800 divide-y divide-gray-700">
							{filteredScripts.map((script, idx) => (
								<tr
									key={script.name}
									className="hover:bg-gray-700 cursor-pointer transition relative"
									onClick={() => {
										/* TODO: open script details or run modal */
									}}
								>
									<td className="px-4 py-3">
										<input type="checkbox" />
									</td>
									<td className="px-4 py-3 font-medium text-blue-400">
										{script.name}
									</td>
									<td className="px-4 py-3">{script.type}</td>
									<td className="px-4 py-3">{script.category}</td>
									<td className="px-4 py-3 text-sm text-neutral-300">
										{script.description}
									</td>
									<td className="px-4 py-3 text-xs">{script.created}</td>
									<td className="px-4 py-3 text-center">
										{script.scheduledRuns}
									</td>
									<td className="px-4 py-3 text-right relative">
										<button
											className="text-neutral-400 hover:text-neutral-200 relative z-10"
											onClick={(e) => {
												e.stopPropagation();
												setOpenMenuIdx(
													idx === openMenuIdx ? null : idx
												);
											}}
										>
											<span className="sr-only">More</span>
											&#x22EE;
										</button>
										{openMenuIdx === idx && (
											<div ref={menuRef}>
												<ScriptRowMenu onClose={() => setOpenMenuIdx(null)} />
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="px-4 py-2 text-xs text-neutral-400 border-t border-neutral-800">
						{filteredScripts.length} scripts
					</div>
				</div>
			</div>
		</div>
	);
}
