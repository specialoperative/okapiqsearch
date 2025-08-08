"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

// Dynamically import the entire map component to avoid SSR issues
const MapView = dynamic(
  () => import('./MapView'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-8 w-8 bg-gray-300 dark:bg-gray-600 mx-auto mb-2"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    )
  }
);

const locations = [
  {
    name: "Golden Gate HVAC",
    tam: "$12M TAM",
    score: 92,
    position: [37.7825, -122.435],
  },
  {
    name: "Bay Area Plumbing Co",
    tam: "$8M TAM",
    score: 88,
    position: [37.779, -122.418],
  },
  {
    name: "SF Electrical Services",
    tam: "$15M TAM",
    score: 85,
    position: [37.789, -122.401],
  },
];

const CheckMarkIcon = () => (
  <svg
    className="w-4 h-4 text-green-600 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const LandingPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 font-sans">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* Logo - Orange gradient circle with "O" */}
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              O
            </div>
            <span className="font-bold text-xl tracking-tight text-black dark:text-white">Okapiq</span>
          </div>
          <ul className="hidden md:flex space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
            {["How it Works", "Products", "Pricing", "CRM"].map((item) => (
              <li key={item} className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors duration-200">
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-4">
            <button className="hidden md:inline-block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition">
              Sign In
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-lg"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  💼 Bloomberg for Small Businesses
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-black dark:text-white">
                  Find and qualify<br />
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    SMB deals before<br />
                    anyone else
                  </span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg">
                  AI-powered deal sourcing from public data, owner signals, and market intelligence. Get CRM-ready leads with TAM/SAM estimates and ad spend analysis while competitors are still cold calling.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-3"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter a city, ZIP, or industry..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg"
                  onClick={() => alert(`Scanning market for "${query}"`)}
                >
                  Scan Market
                </motion.button>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => alert("Demo requested")}
                >
                  <span className="text-sm">▶️</span> Try Free Demo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => alert("Opening CRM")}
                >
                  <span className="text-sm">📊</span> Open CRM
                </motion.button>
              </motion.div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-6 text-sm font-medium text-emerald-600 dark:text-emerald-400"
              >
                <div className="flex items-center gap-2">
                  <CheckMarkIcon />
                  No setup required
                </div>
                <div className="flex items-center gap-2">
                  <CheckMarkIcon />
                  Instant lead export
                </div>
                <div className="flex items-center gap-2">
                  <CheckMarkIcon />
                  14-day free trial
                </div>
              </motion.div>
            </div>

            {/* Right Column - Market Intelligence Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:ml-8"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 max-w-md mx-auto">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Market Intelligence - San Francisco Bay Area</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    TAM: $2.4B
                  </span>
                </div>

                {/* Business List */}
                <div className="space-y-4 mb-6">
                  {locations.map(({ name, tam, score }) => (
                    <div key={name} className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">{name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{tam}</div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          score > 90 
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" 
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {score}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg"
                  onClick={() => alert("Opening Full Intelligence Suite")}
                >
                  Open Full Intelligence Suite
                </button>
              </div>
            </motion.div>
          </div>

          {/* Interactive Map Section - Below the main content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="h-96 relative">
                  <MapView locations={locations} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Three-Product Ecosystem Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-6xl mx-auto px-8 py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Three-Product Ecosystem for Complete Deal Sourcing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From identifying opportunities to closing deals – our integrated product line covers every step of the acquisition process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Opportunity Finder",
                desc: "Discover new SMB deals in your market with AI-driven insights.",
                color: "bg-emerald-50 dark:bg-emerald-900/20",
                textColor: "text-emerald-700 dark:text-emerald-300",
                icon: "🔍",
              },
              {
                title: "CRM Integration", 
                desc: "Seamlessly export qualified leads to your CRM system.",
                color: "bg-blue-50 dark:bg-blue-900/20",
                textColor: "text-blue-700 dark:text-blue-300",
                icon: "📊",
              },
              {
                title: "Market Analytics",
                desc: "Analyze TAM/SAM and competitor ad spend for smarter decisions.",
                color: "bg-amber-50 dark:bg-amber-900/20", 
                textColor: "text-amber-700 dark:text-amber-300",
                icon: "📈",
              },
            ].map(({ title, desc, color, textColor, icon }) => (
              <motion.div
                key={title}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${color} mb-4 text-lg`}>
                  {icon}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LandingPage;