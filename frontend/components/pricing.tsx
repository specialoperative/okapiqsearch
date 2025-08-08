"use client";

import React from "react";

type Plan = {
  name: string;
  price: string;
  color: string;
  features: { label: string; help: string }[];
  cta: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    color: "border-gray-200",
    cta: "Get Started",
    features: [
      { label: "Basic market scans", help: "Limited to 5 scans/day, single location per scan" },
      { label: "Interactive map", help: "View markers and popups, no export" },
      { label: "AI chat", help: "Ask simple questions about data and workflow" },
    ],
  },
  {
    name: "Pro",
    price: "$49/mo",
    color: "border-emerald-400",
    cta: "Upgrade to Pro",
    highlight: true,
    features: [
      { label: "Unlimited scans", help: "Run scans without daily limits" },
      { label: "Lead export", help: "CSV export and CRM sync for results" },
      { label: "Oppy + Fragment Finder", help: "Access to opportunity and fragmentation tools" },
    ],
  },
  {
    name: "Premium",
    price: "$149/mo",
    color: "border-amber-500",
    cta: "Go Premium",
    features: [
      { label: "All Pro features", help: "Everything in Pro plus extras" },
      { label: "Acquisition Assistant", help: "Deal pipeline, docs, LBO/QoE previews" },
      { label: "API Access", help: "Call Okapiq endpoints directly from your stack" },
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Pricing</h2>
      <p className="text-gray-600 text-center mb-10">Choose the plan that fits your acquisition workflow.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className={`bg-white rounded-2xl border ${p.color} shadow p-6 relative`}> 
            {p.highlight && (
              <span className="absolute -top-3 right-4 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">Popular</span>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-1">{p.name}</h3>
            <div className="text-3xl font-extrabold text-gray-900 mb-4">{p.price}</div>
            <ul className="space-y-3 mb-6">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-800">{f.label}</span>
                  <span
                    className="ml-2 text-xs text-gray-500 border border-gray-200 rounded px-2 py-0.5"
                    title={f.help}
                  >
                    ?
                  </span>
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg font-semibold ${p.highlight ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-[#402f23] text-white hover:bg-[#594733]'}`}>{p.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}


