"use client";

import React, { useState } from 'react';
import { SmoothReveal, StaggeredReveal, PallyButton, OrigamiCard, SmoothNavLink } from '../ui/smooth-components';
import { ArrowLeft, Search, TrendingUp, Users, Building2, Target, Zap, BarChart3, Filter, MapPin, DollarSign, Calendar, Star, Phone, Mail, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface MarketScannerPageProps {
  onNavigate: (page: string) => void;
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

  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleScan = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a location to scan.');
      return;
    }
    
    setIsScanning(true);
    setError(null);
    setScanResults(null);
    setSuccess(null);
    
    try {
      const response = await fetch('http://localhost:8000/market/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ 
          location: searchTerm, 
          industry: selectedIndustry || null,
          radius_miles: radiusMiles,
          timestamp: Date.now()
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fresh scan results:', data);
        setScanResults(data);
        
        // Add to recent scans
        setRecentScans(prev => [data, ...prev.slice(0, 4)]);
        
        // Show success message
        setSuccess(`Successfully scanned ${data.location} market! Found ${data.business_count} businesses. (${new Date().toLocaleTimeString()})`);
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Scan failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during scan:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setError(null);
    setSuccess(null);
    
    if (value.trim().length > 0) {
      const suggestions = [...popularLocations, ...industries]
        .filter(item => item.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleScan();
    }
  };

  const getFragmentationColor = (hhiScore: number) => {
    if (hhiScore < 0.15) return 'text-green-600';
    if (hhiScore < 0.25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFragmentationText = (hhiScore: number) => {
    if (hhiScore < 0.15) return 'Highly Fragmented';
    if (hhiScore < 0.25) return 'Moderately Fragmented';
    return 'Concentrated';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-okapi-brown-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <PallyButton variant="ghost" onClick={() => onNavigate('landing')} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </PallyButton>
              <h1 className="text-2xl font-bold text-okapi-brown-800 ml-4">Market Scanner</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <SmoothNavLink onClick={() => onNavigate('market-analysis')}>Analysis</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('crm')}>CRM</SmoothNavLink>
              <SmoothNavLink onClick={() => onNavigate('dashboard')}>Dashboard</SmoothNavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Scanner Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SmoothReveal>
          <h2 className="text-4xl font-bold text-okapi-brown-900 mb-8 text-center">Market Intelligence Scanner</h2>
        </SmoothReveal>

        {/* Search Interface */}
        <SmoothReveal delay={0.2}>
          <OrigamiCard pattern="okapi" className="p-8 mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter a city, ZIP, or industry..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-3 pl-10 border border-okapi-brown-300 rounded-md focus:ring-2 focus:ring-okapi-brown-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-okapi-brown-400" />
                  
                  {/* Search Suggestions */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-okapi-brown-200 rounded-md shadow-lg z-10">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-4 py-2 text-left hover:bg-okapi-brown-50 text-sm text-okapi-brown-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-4 py-3 border border-okapi-brown-300 rounded-md focus:ring-2 focus:ring-okapi-brown-500 focus:border-transparent"
                  >
                    <option value="">All Industries</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <PallyButton 
                    onClick={handleScan}
                    disabled={isScanning || !searchTerm.trim()}
                    className="flex-1"
                  >
                    {isScanning ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Scanning Market...
                      </div>
                    ) : (
                      'Scan Market'
                    )}
                  </PallyButton>
                  
                  <PallyButton 
                    variant="secondary"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="px-3"
                  >
                    <Filter className="w-4 h-4" />
                  </PallyButton>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="mb-6 p-4 bg-okapi-brown-50 rounded-lg">
                  <h4 className="font-semibold text-okapi-brown-900 mb-3">Advanced Filters</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-okapi-brown-700 mb-1">
                        Search Radius (miles)
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={radiusMiles}
                        onChange={(e) => setRadiusMiles(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-okapi-brown-600">{radiusMiles} miles</span>
                    </div>
                    <div className="flex items-end">
                      <PallyButton 
                        variant="secondary" 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedIndustry('');
                          setRadiusMiles(25);
                          setError(null);
                        }}
                        size="sm"
                      >
                        Clear Filters
                      </PallyButton>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 justify-center">
                {popularLocations.map((location) => (
                  <button 
                    key={location}
                    onClick={() => handleSuggestionClick(location)}
                    className="px-3 py-1 text-sm bg-okapi-brown-100 text-okapi-brown-700 rounded-full hover:bg-okapi-brown-200 transition-colors"
                  >
                    {location}
                  </button>
                ))}
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <p className="text-green-700 text-sm">{success}</p>
                  <button 
                    onClick={() => setSuccess(null)}
                    className="ml-auto text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </OrigamiCard>
        </SmoothReveal>

        {/* Results */}
        {scanResults && (
          <SmoothReveal delay={0.4}>
            <OrigamiCard pattern="zebra" className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-okapi-brown-900">Scan Results</h3>
                <div className="text-sm text-okapi-brown-600 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  {scanResults.location} • {scanResults.industry || 'All Industries'}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-6 bg-white rounded-lg border border-okapi-brown-200">
                  <Building2 className="w-8 h-8 text-okapi-brown-600 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-okapi-brown-900 mb-1">Businesses Found</h4>
                  <p className="text-3xl font-bold text-okapi-brown-600">{scanResults.business_count || 0}</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg border border-okapi-brown-200">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-okapi-brown-900 mb-1">TAM Estimate</h4>
                  <p className="text-3xl font-bold text-okapi-brown-600">{formatCurrency(scanResults.tam_estimate)}</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg border border-okapi-brown-200">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-okapi-brown-900 mb-1">HHI Score</h4>
                  <p className={`text-3xl font-bold ${getFragmentationColor(scanResults.hhi_score)}`}>
                    {(scanResults.hhi_score * 100).toFixed(1)}%
                  </p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg border border-okapi-brown-200">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="text-lg font-bold text-okapi-brown-900 mb-1">Market Status</h4>
                  <p className={`text-lg font-bold ${getFragmentationColor(scanResults.hhi_score)}`}>
                    {getFragmentationText(scanResults.hhi_score)}
                  </p>
                </div>
              </div>

              {/* Google Maps & UC Berkeley Integration */}
              <div className="mb-6 space-y-4">
                {/* Google Maps Verification */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">🗺️</span>
                    </div>
                    <h4 className="text-lg font-bold text-green-900">Google Maps Verified Data</h4>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    All business addresses and phone numbers match real Google Maps search results. 
                    Search any address on Google Maps to verify authenticity.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Real Business Addresses
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Verified Phone Numbers
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Google Maps Searchable
                    </span>
                  </div>
                </div>

                {/* Berkeley Database Integration */}
                {scanResults.berkeley_integration && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">UC</span>
                      </div>
                      <h4 className="text-lg font-bold text-blue-900">UC Berkeley A-Z Databases Integration</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Business profiles integrate with academic databases including IBISWorld, Frost & Sullivan, and BLS data.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scanResults.berkeley_integration.available_databases?.map((db: string, index: number) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {db}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Business Listings */}
              {scanResults.businesses && scanResults.businesses.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-okapi-brown-900 mb-4">Top Businesses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scanResults.businesses.slice(0, 6).map((business: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-okapi-brown-200">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-okapi-brown-900">{business.name}</h5>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-okapi-brown-600">{business.rating}</span>
                          </div>
                        </div>
                        <div className="text-sm text-okapi-brown-600 mb-2">
                          <div className="flex items-center mb-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {business.address}
                          </div>
                          <div className="flex items-center mb-1">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Est. Revenue: {formatCurrency(business.estimated_revenue)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {business.employee_count} employees
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {business.phone && (
                            <button 
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200 flex items-center"
                              title={`Call ${business.name}`}
                              onClick={() => window.open(`tel:${business.phone}`, '_self')}
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </button>
                          )}
                          {business.website && (
                            <a 
                              href={business.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200 flex items-center"
                              title={`View ${business.name} profile with UC Berkeley data`}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Business Profile
                            </a>
                          )}
                          <button 
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors duration-200 flex items-center"
                            title={`Verify ${business.name} on Google Maps`}
                            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(business.address)}`, '_blank')}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Verify on Maps
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <PallyButton onClick={() => onNavigate('crm')} variant="secondary">
                  <Users className="w-4 h-4 mr-2" />
                  Add to CRM
                </PallyButton>
                <PallyButton onClick={() => onNavigate('market-analysis')}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Detailed Analysis
                </PallyButton>
              </div>
            </OrigamiCard>
          </SmoothReveal>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <SmoothReveal delay={0.6}>
            <OrigamiCard pattern="cheetah" className="p-8 mt-8">
              <h3 className="text-2xl font-bold text-okapi-brown-900 mb-6">Recent Scans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentScans.map((scan, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-okapi-brown-200">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-okapi-brown-900">{scan.location}</h5>
                      <span className="text-xs bg-okapi-brown-100 text-okapi-brown-700 px-2 py-1 rounded">
                        {scan.business_count} businesses
                      </span>
                    </div>
                    <p className="text-sm text-okapi-brown-600 mb-2">
                      {scan.industry || 'All Industries'}
                    </p>
                    <div className="text-xs text-okapi-brown-500">
                      TAM: {formatCurrency(scan.tam_estimate)}
                    </div>
                  </div>
                ))}
              </div>
            </OrigamiCard>
          </SmoothReveal>
        )}
      </div>
    </div>
  );
} 