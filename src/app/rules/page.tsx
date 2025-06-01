"use client";
import React from "react";

const rules = [
	{
		name: "Default Rule",
		created: "Sat 05-31-25 07:34 PM",
		updated: "Sat 05-31-25 07:34 PM",
	},
	{
		name: "[Example] Sample Rule",
		created: "Sat 05-31-25 07:34 PM",
		updated: "Sat 05-31-25 07:34 PM",
	},
];

export default function RulesPage() {
	return (
		<div className="w-full h-full p-6 md:p-10">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<h1 className="text-3xl font-bold">Rules</h1>
					<div className="flex flex-wrap gap-2 md:gap-4 items-center justify-start md:justify-end">
						<button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm">
							+ New Rule
						</button>
						<button className="px-4 py-2 rounded-lg bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition shadow-sm">
							Bulk Assign Top-Level Rule
						</button>
						<button className="px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition shadow-sm">
							Rule Modules ▾
						</button>
					</div>
				</div>

				{/* Rules Table */}
				<div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-sm overflow-x-auto">
					<table className="min-w-full divide-y divide-neutral-800">
						<thead>
							<tr className="bg-neutral-950">
								<th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Rule Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Created
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">
									Last Updated
								</th>
								<th className="px-6 py-3"></th>
							</tr>
						</thead>
						<tbody className="bg-neutral-900 divide-y divide-neutral-800">
							{rules.map((rule, index) => (
								<tr key={index} className="hover:bg-neutral-800">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										{rule.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
										{rule.created}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
										{rule.updated}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm">
										<button className="text-blue-500 hover:text-blue-400">
											Edit
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* No Rules Message (shown when rules array is empty) */}
				{rules.length === 0 && (
					<div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center">
						<p className="text-neutral-400">No rules have been created yet.</p>
						<p className="text-sm text-neutral-500 mt-2">
							Click the "New Rule" button to create your first rule.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
