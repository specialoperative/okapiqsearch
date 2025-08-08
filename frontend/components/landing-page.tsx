"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

// Import the interactive map component
const InteractiveMap = dynamic(
  () => import('./interactive-map'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-96 w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-8 w-8 bg-gray-300 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }
);

const LandingPage: React.FC = () => {
  const [query, setQuery] = useState("");

  // Market intelligence data exactly like in the screenshot
  const marketData = {
    region: "San Francisco Bay Area",
    tam: "$2.4B",
    businesses: [
      {
        name: "Golden Gate HVAC",
        tam: "$12M TAM",
        score: 92
      },
      {
        name: "Bay Area Plumbing Co",
        tam: "$8M TAM", 
        score: 88
      },
      {
        name: "SF Electrical Services",
        tam: "$15M TAM",
        score: 85
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with trial info */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-600">14-day free trial</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Market Intelligence Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Market Intelligence - {marketData.region}
          </h1>
          
          {/* Market Data Display */}
          <div className="space-y-2">
            <div className="text-lg font-semibold text-gray-900">
              TAM: {marketData.tam}
            </div>
            
            {marketData.businesses.map((business, index) => (
              <div key={index} className="text-gray-700">
                <div className="font-medium">{business.name}</div>
                <div className="text-sm text-gray-600">{business.tam}</div>
                <div className="text-sm text-gray-600">{business.score}</div>
              </div>
            ))}
          </div>

          {/* Open Full Intelligence Suite Button */}
          <button className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded border border-blue-200 hover:bg-blue-200 transition-colors">
            Open Full Intelligence Suite
          </button>
        </div>

        {/* Interactive Map */}
        <div className="mb-8">
          <InteractiveMap />
        </div>

        {/* Three-Product Ecosystem Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Three-Product Ecosystem for Complete Deal Sourcing
          </h2>
          <p className="text-gray-600 mb-8">
            From identifying opportunities to closing deals – our integrated product line covers every step of the acquisition process.
          </p>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Opportunity Finder */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-8 h-8 bg-blue-100 rounded mb-4 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Opportunity Finder
              </h3>
              <p className="text-gray-600 text-sm">
                Discover new SMB deals in your market with AI-driven insights.
              </p>
            </div>

            {/* CRM Integration */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-8 h-8 bg-green-100 rounded mb-4 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                CRM Integration
              </h3>
              <p className="text-gray-600 text-sm">
                Seamlessly export qualified leads to your CRM system.
              </p>
            </div>

            {/* Deal Analytics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="w-8 h-8 bg-purple-100 rounded mb-4 flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deal Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Advanced analytics for deal evaluation and market intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;