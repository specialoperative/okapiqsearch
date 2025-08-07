"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
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

const LandingPage: React.FC = () => {
  const [query, setQuery] = useState("");

  // For dark mode toggle simulation (light only here for simplicity)
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#fefbf9] dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 font-sans">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className="w-10 h-10 bg-green-400 rounded flex items-center justify-center font-bold text-white select-none cursor-default" aria-label="Okapiq logo">
              OQ
            </div>
            <span className="font-semibold text-lg tracking-wide select-none cursor-default">Okapiq</span>
          </div>
          <ul className="hidden md:flex space-x-8 text-sm font-medium">
            {["How it Works", "Products", "Pricing", "CRM"].map((item) => (
              <li key={item} className="hover:text-green-700 cursor-pointer transition-colors duration-200">
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-4">
            <button
              className="hidden md:inline-block px-5 py-2 border border-gray-400 dark:border-gray-600 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Sign in"
            >
              Sign In
            </button>
            <button
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M7.05 16.95l-.707.707M16.95 16.95l-.707-.707M7.05 7.05l-.707-.707"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-900 dark:text-gray-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-14 md:pt-20 flex flex-col md:flex-row gap-16 items-start">
          {/* Left Text Area */}
          <div className="max-w-xl flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-xs mb-3 select-none">
                Bloomberg for Small Businesses
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight max-w-[28rem]">
                Find and qualify SMB deals{" "}
                <span className="text-olive-700 dark:text-olive-400 font-extrabold">before</span>{" "}
                <br />
                <span className="text-green-700 dark:text-green-400 font-extrabold">anyone else</span>
              </h1>
              <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
                AI-powered deal sourcing from public data, owner signals, and market intelligence. Get CRM-ready leads with TAM/SAM estimates and ad spend analysis while competitors are still cold calling.
              </p>
            </motion.div>

            {/* Search and Buttons */}
            <motion.form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Scanning market for "${query}" (demo only)`);
              }}
              className="flex flex-col sm:flex-row gap-4 mt-6"
            >
              <input
                type="text"
                placeholder="Enter a city, ZIP, or industry..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow rounded-lg border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-white dark:text-gray-900"
                aria-label="Market scan input"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#402f23] text-white px-8 py-3 rounded-lg whitespace-nowrap font-semibold shadow-lg hover:bg-[#594733] transition-colors"
                aria-label="Scan Market"
              >
                Scan Market
              </motion.button>
            </motion.form>

            {/* Secondary buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 border border-gray-300 px-6 py-3 rounded-lg text-gray-900 bg-white hover:bg-gray-100 font-semibold shadow-md transition"
                aria-label="Try Free Demo"
                onClick={() => alert("Demo requested (demo only)")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-6.586-3.79A1 1 0 007 8.237v7.525a1 1 0 001.166.986l6.586-1.66a1 1 0 000-1.852z" />
                </svg>
                Try Free Demo
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 border border-gray-300 px-6 py-3 rounded-lg text-gray-900 bg-white hover:bg-gray-100 font-semibold shadow-md transition"
                aria-label="Open CRM"
                onClick={() => alert("Opening CRM (demo only)")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 11h18M3 15h18M3 19h18" />
                </svg>
                Open CRM
              </motion.button>
            </div>

            {/* Trust icons or checklist */}
            <div className="flex flex-wrap gap-6 text-green-600 text-sm mt-6 font-semibold">
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
            </div>
          </div>

          {/* Right Section: Market Intelligence + Map */}
          <div className="flex flex-col gap-12">
            {/* Market Intelligence Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
              style={{filter: "drop-shadow(0 10px 20px rgba(64,47,35,0.15))"}}
            >
              <div className="text-sm text-gray-600 font-semibold mb-4 flex items-center justify-between">
                <span>Market Intelligence - San Francisco Bay Area</span>
                <span className="border border-gray-300 px-3 py-1 rounded-full text-xs">TAM: $2.4B</span>
              </div>
              <ul className="divide-y divide-gray-300 text-gray-900">
                {locations.map(({ name, tam, score }) => (
                  <li
                    key={name}
                    className="flex justify-between items-center py-4"
                  >
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="text-xs text-gray-500">{tam}</div>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold ${score > 90 ? "bg-red-600 text-white" : "bg-gray-300 text-gray-700"}`}
                    >
                      {score}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full mt-8 py-3 rounded-xl font-semibold bg-[#402f23] text-white hover:bg-[#593f30] transition-shadow shadow-2xl"
                aria-label="Open Full Intelligence Suite"
                onClick={() => alert("Opening Full Intelligence Suite (demo only)")}
              >
                Open Full Intelligence Suite
              </button>
            </motion.div>

            {/* Interactive Map - San Francisco */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-80 md:h-96 rounded-2xl shadow-xl overflow-hidden max-w-md w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
            >
              <MapContainer
                center={[37.7749, -122.4194]}
                zoom={12}
                scrollWheelZoom={false}
                className="h-full w-full"
                aria-label="Interactive map of San Francisco"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map(({ name, tam, position }) => (
                  <Marker key={name} position={position}>
                    <Popup>
                      <strong>{name}</strong>
                      <br />
                      {tam}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="max-w-5xl mx-auto px-6 lg:px-12 mt-24 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Three-Product Ecosystem for Complete Deal Sourcing
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            From identifying opportunities to closing deals – our integrated product line covers every step of the acquisition process.
          </p>
          {/* Placeholder product cards */}
          <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center">
            {[
              {
                title: "Opportunity Finder",
                desc: "Discover new SMB deals in your market with AI-driven insights.",
                color: "bg-green-100 text-green-800",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m.15-4.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "CRM Integration",
                desc: "Seamlessly export qualified leads to your CRM system.",
                color: "bg-blue-100 text-blue-800",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h18M3 11h18M3 15h18M3 19h18"
                    />
                  </svg>
                ),
              },
              {
                title: "Market Analytics",
                desc: "Analyze TAM/SAM and competitor ad spend for smarter decisions.",
                color: "bg-yellow-100 text-yellow-800",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 3v18m-4-4h8"
                    />
                  </svg>
                ),
              },
            ].map(({ title, desc, color, icon }) => (
              <div
                key={title}
                className={`flex flex-col gap-4 p-6 rounded-2xl shadow-lg max-w-xs mx-auto ${color} bg-opacity-30`}
              >
                <div>{icon}</div>
                <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const CheckMarkIcon = () => (
  <svg
    className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
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

export default LandingPage; 