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
						<button className="px-4 py-2 rounded-lg bg-[#23a69a] text-white font-semibold hover:bg-[#1c8c82] transition shadow-sm">
							+ New Rule
						</button>
						<button className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition shadow-sm">
							Bulk Assign Top-Level Rule
						</button>
						<button className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white font-semibold hover:bg-gray-700 transition shadow-sm">
							Rule Modules ▾
						</button>
					</div>
				</div>

				{/* Rules Table */}
				<div className="rounded-xl border border-gray-700 bg-gray-800 shadow-sm overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr className="bg-gray-900">
								<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
									Created
								</th>
								<th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
									Last Updated
								</th>
								<th className="px-6 py-3"></th>
							</tr>
						</thead>
						<tbody className="bg-gray-800 divide-y divide-gray-700">
							{rules.map((rule, index) => (
								<tr key={index} className="hover:bg-gray-700">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{rule.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
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
					<div className="rounded-xl border border-gray-700 bg-gray-800 p-8 text-center">
						<p className="text-gray-400">No rules have been created yet.</p>
						<p className="text-sm text-gray-500 mt-2">
							Click the &quot;New Rule&quot; button to create your first rule.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
