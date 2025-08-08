"use client";

import React, { useState } from "react";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";

const navLinks = [
  { name: "How it Works", href: "#" },
  { name: "Products", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "CRM", href: "#" },
];

const businesses = [
  { name: "Golden Gate HVAC", tam: "$12M TAM", score: 92 },
  { name: "Bay Area Plumbing Co", tam: "$8M TAM", score: 88 },
  { name: "SF Electrical Services", tam: "$15M TAM", score: 85 },
];

export default function LandingPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-emerald-600" />
            <span className="font-bold text-[18px] tracking-tight">Okapiq</span>
          </div>
          <nav className="hidden md:flex gap-8 text-[14px] font-medium text-gray-700">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-black transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="hidden md:inline-flex items-center px-4 py-2 rounded-lg font-semibold text-gray-800 border border-gray-200 hover:bg-gray-50 transition">
              Sign In
            </button>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Open menu">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 items-start">
        {/* Left: Hero */}
        <section className="flex-1 max-w-xl">
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full px-3 py-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
              Bloomberg for Small Businesses
            </span>
          </div>
          <h1 className="text-[46px] leading-[1.1] md:text-[56px] font-extrabold tracking-tight mb-4">
            Find and qualify SMB deals <span className="text-emerald-700">before</span> <br /> <span className="text-emerald-700">anyone else</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-gray-700 mb-8">
            AI-powered deal sourcing from public data, owner signals, and market intelligence. Get CRM-ready leads with TAM/SAM estimates and ad spend analysis while competitors are still cold calling.
          </p>

          {/* Search group */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex flex-col sm:flex-row gap-4 mb-5"
          >
            <div className="flex-1">
              <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500">
                <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter a city, ZIP, or industry..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3 bg-transparent outline-none text-[15px]"
                  aria-label="Market scan input"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#402f23] text-white px-7 py-3 rounded-xl whitespace-nowrap font-semibold shadow-lg hover:bg-[#594733] transition-colors"
              aria-label="Scan Market"
            >
              <span>Scan Market</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Secondary actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <button className="flex items-center justify-center gap-2 flex-1 border border-gray-300 px-5 py-2.5 rounded-full font-semibold text-gray-800 bg-white hover:bg-gray-50 transition">
              Try Free Demo
            </button>
            <button className="flex items-center justify-center gap-2 flex-1 border border-gray-300 px-5 py-2.5 rounded-full font-semibold text-gray-800 bg-white hover:bg-gray-50 transition">
              Open CRM
            </button>
          </div>

          {/* Checklist */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No setup required</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Instant lead export</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 14-day free trial</span>
          </div>
        </section>

        {/* Right: Market Intelligence Card */}
        <aside className="flex-1 flex justify-center w-full">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs text-gray-400">app.okapiq.com</span>
              </div>
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold rounded-full px-2.5 py-1">TAM: $2.4B</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Market Intelligence - San Francisco Bay Area</h2>

            <div className="flex flex-col divide-y divide-gray-100 rounded-xl bg-gray-50 border border-gray-100">
              {businesses.map((biz, i) => (
                <div key={biz.name} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-semibold text-gray-900">{biz.name}</div>
                    <div className="text-xs text-gray-500">{biz.tam}</div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${i === 0 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{biz.score}</span>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full bg-[#402f23] text-white font-semibold py-3 rounded-xl shadow hover:bg-[#594733] transition">
              Open Full Intelligence Suite
            </button>
          </div>
        </aside>
      </main>

      {/* Three-Product Ecosystem Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3 text-center">Three-Product Ecosystem for Complete Deal Sourcing</h2>
        <p className="text-[16px] text-gray-600 mb-10 text-center max-w-3xl mx-auto">From identifying opportunities to closing deals – our integrated product line covers every step of the acquisition process.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Opportunity Finder */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
            <div className="mb-4 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <span className="text-xl">🔍</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Opportunity Finder</h3>
            <p className="text-gray-600">Discover new SMB deals in your market with AI-driven insights.</p>
          </div>
          {/* CRM Integration */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
            <div className="mb-4 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-bold mb-2">CRM Integration</h3>
            <p className="text-gray-600">Seamlessly export qualified leads to your CRM system.</p>
          </div>
          {/* Deal Analytics */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
            <div className="mb-4 w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Deal Analytics</h3>
            <p className="text-gray-600">Advanced analytics for deal evaluation and market intelligence.</p>
          </div>
        </div>
      </section>
    </div>
  );
}