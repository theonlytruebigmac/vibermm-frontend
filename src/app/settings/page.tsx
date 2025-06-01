"use client";
import React, { useState } from "react";

const menu = [
	{
		section: "General",
		items: ["Preferences", "Branding", "Localization"],
	},
	{
		section: "Security",
		items: ["Users", "Roles & Permissions", "MFA", "API Keys"],
	},
	{
		section: "Notifications",
		items: ["Email Settings", "Webhooks", "Integrations"],
	},
	{
		section: "Billing",
		items: ["Subscription", "Invoices", "Payment Methods"],
	},
];

const settingsContent: Record<string, React.ReactNode> = {
	Preferences: <div>Preferences settings content goes here.</div>,
	Branding: <div>Branding settings content goes here.</div>,
	Localization: <div>Localization settings content goes here.</div>,
	Users: <div>Users management content goes here.</div>,
	"Roles & Permissions": <div>Roles & Permissions content goes here.</div>,
	MFA: <div>MFA settings content goes here.</div>,
	"API Keys": <div>API Keys management content goes here.</div>,
	"Email Settings": <div>Email Settings content goes here.</div>,
	Webhooks: <div>Webhooks settings content goes here.</div>,
	Integrations: <div>Integrations settings content goes here.</div>,
	Subscription: <div>Subscription management content goes here.</div>,
	Invoices: <div>Invoices settings content goes here.</div>,
	"Payment Methods": <div>Payment Methods content goes here.</div>,
};

export default function SettingsPage() {
	const [selectedItem, setSelectedItem] = useState("Preferences");

	return (
		<div className="w-full h-full p-6 md:p-10">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<h1 className="text-3xl font-bold">Settings</h1>
				</div>

				<div className="flex flex-col md:flex-row gap-6">
					{/* Settings Navigation */}
					<div className="w-full md:w-64 flex-shrink-0">
						<div className="rounded-xl border border-gray-700 bg-gray-800 overflow-hidden">
							{menu.map((section) => (
								<div key={section.section}>
									<div className="px-4 py-2 bg-gray-900 text-sm font-medium text-gray-400">
										{section.section}
									</div>
									<div className="py-1">
										{section.items.map((item) => (
											<button
												key={item}
												onClick={() => setSelectedItem(item)}
												className={`w-full px-4 py-2 text-sm text-left transition ${
													selectedItem === item
														? "bg-blue-600 text-white"
														: "text-gray-300 hover:bg-gray-700"
												}`}
											>
												{item}
											</button>
										))}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Settings Content */}
					<div className="flex-1">
						<div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
							{settingsContent[selectedItem]}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
