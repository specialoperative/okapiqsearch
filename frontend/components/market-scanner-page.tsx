"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, TrendingUp, Users, Building2, Target, Zap, BarChart3, Filter, MapPin, DollarSign, Calendar, Star, Phone, Mail, ExternalLink, AlertCircle, CheckCircle, Map, Globe, Database, Shield, Activity, Menu } from 'lucide-react';
import InteractiveMap from './interactive-map';

interface MarketScannerPageProps {
  onNavigate?: (page: string) => void;
}

export default function MarketScannerPage({ onNavigate }: MarketScannerPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  const industries = [
    'HVAC', 'Plumbing', 'Electrical', 'Landscaping', 'Restaurant', 
    'Retail', 'Healthcare', 'Automotive', 'Construction', 'Manufacturing',
    'IT Services', 'Real Estate', 'Education', 'Entertainment', 'Transportation'
  ];

  const popularLocations = [
    'San Francisco', 'Los Angeles', 'New York', 'Chicago', 'Miami',
    'Austin', 'Seattle', 'Denver', 'Atlanta', 'Boston', 'Phoenix',
    'Dallas', 'Houston', 'Philadelphia', 'San Diego', 'Detroit',
    'Portland', 'Las Vegas', 'Minneapolis', 'Tampa', 'Orlando'
  ];

  const handleScan = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a location');
      return;
    }

    setIsScanning(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/market/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: searchTerm,
          industry: selectedIndustry || 'hvac',
          radius_miles: radiusMiles
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan market');
      }

      const data = await response.json();
      setScanResults(data);
      setSuccess(`Found ${data.businesses?.length || 0} businesses in ${searchTerm}`);
      
      // Add to recent scans
      setRecentScans(prev => [{
        id: Date.now(),
        location: searchTerm,
        industry: selectedIndustry || 'hvac',
        count: data.businesses?.length || 0,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 4)]);
    } catch (err) {
      setError('Failed to scan market. Please try again.');
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleBusinessClick = (business: any) => {
    setSelectedBusiness(business);
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount || isNaN(amount)) return '$0';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getRiskColor = (riskScore: number | undefined) => {
    if (!riskScore || isNaN(riskScore)) return 'text-gray-600 bg-gray-50';
    if (riskScore >= 70) return 'text-red-600 bg-red-50';
    if (riskScore >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLevel = (riskScore: number | undefined) => {
    if (!riskScore || isNaN(riskScore)) return 'Unknown Risk';
    if (riskScore >= 70) return 'High Risk';
    if (riskScore >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-okapi-brown-50 via-white to-okapi-brown-50">
      {/* Subtle Background Pattern */}
      <div 
        className="fixed inset-0 opacity-3 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(139, 69, 19, 0.03) 20px,
              rgba(139, 69, 19, 0.03) 40px
            )
          `
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md border-b border-okapi-brown-200 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {onNavigate && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate('home')}
                    className="flex items-center space-x-2 text-okapi-brown-600 hover:text-okapi-brown-800 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                  </motion.button>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-okapi-brown-900">
                    Market Intelligence Scanner
                  </h1>
                  <p className="text-okapi-brown-600">
                    Discover acquisition opportunities with data-driven insights
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-okapi-brown-100 rounded-lg"
                >
                  <Database className="w-5 h-5 text-okapi-brown-600" />
                  <span className="text-sm font-medium text-okapi-brown-700">
                    Real-time Data
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-okapi-brown-200 p-6 mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Location Input */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-okapi-brown-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-okapi-brown-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter city, state, or zip code"
                    className="w-full pl-10 pr-4 py-3 border border-okapi-brown-300 rounded-lg focus:ring-2 focus:ring-okapi-brown-500 focus:border-okapi-brown-500 transition-colors"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {popularLocations.slice(0, 6).map((location) => (
                    <button
                      key={location}
                      onClick={() => setSearchTerm(location)}
                      className="px-3 py-1 text-xs bg-okapi-brown-100 text-okapi-brown-700 rounded-full hover:bg-okapi-brown-200 transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry Selection */}
              <div>
                <label className="block text-sm font-medium text-okapi-brown-700 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-okapi-brown-300 rounded-lg focus:ring-2 focus:ring-okapi-brown-500 focus:border-okapi-brown-500 transition-colors"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Scan Button */}
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-okapi-brown-600 to-okapi-brown-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-okapi-brown-700 hover:to-okapi-brown-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Scanning...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Scan Market</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="mt-4 flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2 text-okapi-brown-600 hover:text-okapi-brown-800 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Filters</span>
              </motion.button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-okapi-brown-600">View:</span>
                <div className="flex bg-okapi-brown-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-okapi-brown-900 shadow-sm' 
                        : 'text-okapi-brown-600 hover:text-okapi-brown-800'
                    }`}
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      viewMode === 'map' 
                        ? 'bg-white text-okapi-brown-900 shadow-sm' 
                        : 'text-okapi-brown-600 hover:text-okapi-brown-800'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Map - Positioned right after View toggle */}
          {viewMode === 'map' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <InteractiveMap 
                businesses={scanResults?.businesses || []}
                location={searchTerm}
                industry={selectedIndustry || 'hvac'}
                onBusinessClick={handleBusinessClick}
              />
            </motion.div>
          )}

          {/* Results Section */}
          {scanResults && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Success Message */}
              {success && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">{success}</span>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">{error}</span>
                  </div>
                </motion.div>
              )}

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-okapi-brown-900">
                  Market Results
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-okapi-brown-600">
                    {scanResults.businesses?.length || 0} businesses found
                  </span>
                </div>
              </div>

              {/* List View */}
              {viewMode === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scanResults.businesses?.map((business: any, index: number) => (
                    <motion.div
                      key={`${business.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg border border-okapi-brown-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-okapi-brown-900">
                            {business.name || 'Unknown Business'}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-okapi-brown-600">
                              {business.rating || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-okapi-brown-600">
                            <div className="flex items-center space-x-4">
                              <span>{business.address || 'Address not available'}</span>
                              <span>{business.phone || 'Phone not available'}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-okapi-brown-400" />
                              <div>
                                <p className="text-xs text-okapi-brown-500">Revenue</p>
                                <p className="text-sm font-medium text-okapi-brown-900">
                                  {formatCurrency(business.estimated_revenue)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-okapi-brown-400" />
                              <div>
                                <p className="text-xs text-okapi-brown-500">Employees</p>
                                <p className="text-sm font-medium text-okapi-brown-900">
                                  {business.employee_count || 'N/A'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-okapi-brown-400" />
                              <div>
                                <p className="text-xs text-okapi-brown-500">Years</p>
                                <p className="text-sm font-medium text-okapi-brown-900">
                                  {business.years_in_business || 'N/A'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-okapi-brown-400" />
                              <div>
                                <p className="text-xs text-okapi-brown-500">Lead Score</p>
                                <p className={`text-sm font-medium ${
                                  business.lead_score >= 80 ? 'text-green-600' :
                                  business.lead_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {business.lead_score || 'N/A'}%
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-okapi-brown-100">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              getRiskColor(business.succession_risk_score)
                            }`}>
                              {getRiskLevel(business.succession_risk_score)}
                            </span>
                            <div className="flex items-center space-x-2">
                              {business.website && (
                                <a
                                  href={business.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-okapi-brown-600 hover:text-okapi-brown-800 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleBusinessClick(business)}
                                className="text-okapi-brown-600 hover:text-okapi-brown-800 transition-colors"
                              >
                                <MapPin className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <h3 className="text-lg font-semibold text-okapi-brown-900 mb-4">
                Recent Scans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentScans.map((scan) => (
                  <motion.div
                    key={scan.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg shadow-md border border-okapi-brown-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-okapi-brown-900">
                        {scan.location}
                      </span>
                      <span className="text-xs text-okapi-brown-500">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-okapi-brown-600 capitalize">
                        {scan.industry}
                      </span>
                      <span className="text-sm font-semibold text-okapi-brown-900">
                        {scan.count} businesses
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 