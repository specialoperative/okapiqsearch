"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { US_CRIME_HEAT_POINTS } from '@/components/../lib/crimeHeat';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, TrendingUp, Users, Building2, Target, Zap, BarChart3, Filter, MapPin, DollarSign, Calendar, Star, Phone, Mail, ExternalLink, AlertCircle, CheckCircle, Map, Globe, Database, Shield, Activity, Menu } from 'lucide-react';
// Avoid SSR importing of Leaflet by dynamically loading the map component on the client only
const InteractiveMap = dynamic(() => import('./interactive-map-google'), { ssr: false });

interface MarketScannerPageProps {
  onNavigate?: (page: string) => void;
  showHeader?: boolean;
  initialLocation?: string;
}

export default function MarketScannerPage({ onNavigate, showHeader = true, initialLocation }: MarketScannerPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [minRevenue, setMinRevenue] = useState('');
  const [maxRevenue, setMaxRevenue] = useState('');
  const [ownerAge, setOwnerAge] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [userCenter, setUserCenter] = useState<[number, number] | undefined>(undefined);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [resolvedAddresses, setResolvedAddresses] = useState<Record<string | number, string>>({});
  // High-crime city coordinates for lightweight heat overlay
  const computeCrimeHeatPoints = () => US_CRIME_HEAT_POINTS;
  // Removed API Online badge per request
  const [working, setWorking] = useState<{active: boolean; step: string}>({active: false, step: ''});
  const workingSteps = [
    'Starting quick scan…',
    'Finding businesses…',
    'Processing results…',
    'Finalizing…'
  ];
  const [workingIndex, setWorkingIndex] = useState<number>(0);
  const [sources, setSources] = useState<Record<string, boolean>>({
    google_maps: true,
    google_serp: true,
    yelp: true,
    // Apify actors
    apify_gmaps: true,
    apify_gmaps_email: false,
    apify_gmaps_websites: false,
    apify_website_crawler: false,
    apify_apollo: false,
    apify_linkedin_jobs: false,
    // Other signals
    linkedin: false,
    sba_records: false,
  });
  const [advFilters, setAdvFilters] = useState({
    includeRisk: true,
    fragmentation: true,
    linkedinSignals: true,
  });

  const patternBg = '';

  // If an initialLocation is provided (e.g., from /oppy?location=...), seed the input and auto-run once
  useEffect(() => {
    if (!initialLocation) return;
    setSearchTerm(initialLocation);
    // Defer to ensure state applied before scanning
    const id = window.setTimeout(() => {
      void handleScan();
    }, 50);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocation]);

  // Auto-run a default scan on first load to ensure cards render for demos
  useEffect(() => {
    if (initialLocation) return;
    if (searchTerm.trim().length === 0) {
      setSearchTerm('San Francisco');
      const id = window.setTimeout(() => { void handleScan(); }, 100);
      return () => window.clearTimeout(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Geolocate on mount to preset map center
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (typeof lat === 'number' && typeof lng === 'number') {
          setUserCenter([Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // API health badge removed

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
    setWorkingIndex(0);
    setWorking({ active: true, step: workingSteps[0] });
    setError(null);
    setSuccess(null);

    let advancer: number | undefined;
    let timeoutId: number | undefined;

    try {
      // advance step hints while waiting for API
      advancer = window.setInterval(() => {
        setWorkingIndex((i) => {
          const ni = Math.min(i + 1, workingSteps.length - 1);
          setWorking({ active: true, step: workingSteps[ni] });
          return ni;
        });
      }, 600);  // Faster step progression

      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 15000);  // Reduced timeout for faster user feedback

      const response = await fetch(`${apiBase}/intelligence/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          location: searchTerm,
          industry: selectedIndustry || '',
          radius_miles: 15,  // Reduced for speed
          max_businesses: 50,
          crawl_sources: Object.entries(sources).filter(([, v]) => v).map(([k]) => k) || ['google_serp'],
          // Minimal processing for speed
          enrichment_types: [],
          analysis_types: [],
          use_cache: true,  // Use cache when available
          priority: 1  // High priority for speed
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan market');
      }

      const data = await response.json();
      setScanResults(data);
      setSuccess(`Found ${data.businesses?.length || 0} businesses in ${searchTerm}`);
      setWorking({ active: false, step: '' });
      if (advancer !== undefined) window.clearInterval(advancer);
      // Bring results into view so users see cards immediately
      window.setTimeout(() => {
        try { resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
      }, 50);
      
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
      setWorking({ active: false, step: '' });
    } finally {
      setIsScanning(false);
      if (advancer !== undefined) window.clearInterval(advancer);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    }
  };

  const handleBusinessClick = (business: any) => {
    setSelectedBusiness(business);
  };

  const focusBusinessOnMap = (b: any) => {
    setViewMode('map');
    setSelectedBusiness(b);
    const coordArray = Array.isArray(b?.address?.coordinates)
      ? b.address.coordinates
      : (Array.isArray(b?.coordinates) ? b.coordinates : null);
    const lat = b?.location?.lat ?? b?.lat ?? b?.coordinates?.lat ?? (coordArray ? coordArray[0] : undefined);
    const lng = b?.location?.lng ?? b?.lng ?? b?.coordinates?.lng ?? (coordArray ? coordArray[1] : undefined);
    if (typeof window !== 'undefined' && typeof lat === 'number' && typeof lng === 'number') {
      (window as any).__scannerFocus = { lat, lng };
    }
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

  // Display the best-available street line. Prefer explicit street fields; otherwise parse from formatted text.
  const getStreetAddress = (b: any): string => {
    const looksStreet = (s: string) => /\d{1,6}\s+.+/.test(s) || /(street|st\b|avenue|ave\b|road|rd\b|boulevard|blvd\b|drive|dr\b|court|ct\b|lane|ln\b|way\b|place|pl\b)/i.test(s);
    // 1) Common field variants (accept only if looks like a street)
    const candidates = [
      b?.address?.line1,
      b?.address_line1,
      b?.address_line,
      b?.street_address,
      b?.street1,
      b?.street,
      b?.location?.street,
      b?.address1,
      b?.addr1,
      b?.address?.street,
      typeof b?.address === 'string' ? b.address : undefined
    ];
    for (const c of candidates) {
      if (typeof c === 'string') {
        const trimmed = c.trim();
        if (trimmed && looksStreet(trimmed)) return trimmed;
      }
    }
    // 2) Parse from formatted strings
    const formatted = b?.address_formatted || b?.address?.formatted_address || b?.formatted_address || b?.location?.address || '';
    if (typeof formatted === 'string' && formatted.trim()) {
      // If the first comma-separated segment looks like a street (contains a number), use it
      const first = formatted.split(',')[0]?.trim() || '';
      const looksLikeStreet = looksStreet(first);
      if (looksLikeStreet) return first;
      // Otherwise, search anywhere in the string for a street-like pattern
      const m = formatted.match(/\d{1,6}\s+[^,]+?(?:\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Court|Ct|Lane|Ln|Way|Place|Pl))\b/i);
      if (m && m[0]) return m[0].trim();
      // If nothing matches, don't show city as a street line. Defer to resolver.
      return 'Resolving address…';
    }
    // 3) Use any resolved address from client-side Nominatim enrichment
    const id = b?.business_id || b?.id || b?.name;
    if (id && resolvedAddresses[id]) return resolvedAddresses[id];
    return 'Address unavailable';
  };

  // Compose City, State Zip if available or parse from formatted
  const getCityStateZip = (b: any): string => {
    const city = b?.city || b?.address?.city;
    const state = b?.state || b?.address?.state;
    const zip = b?.zip_code || b?.zipcode || b?.address?.zip_code || b?.address?.postal_code;
    if (city || state || zip) {
      const left = [city, state].filter(Boolean).join(', ');
      return [left, zip].filter(Boolean).join(' ');
    }
    const formatted = b?.address_formatted || b?.address?.formatted_address || b?.formatted_address || '';
    if (typeof formatted === 'string' && formatted.trim()) {
      // Try to capture the City, ST ZIP portion after the first comma
      const parts = formatted.split(',').map((s:string)=>s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const tail = parts.slice(1).join(', ');
        // Normalize common patterns like "City, ST 12345" or "City ST 12345"
        const m = tail.match(/([A-Za-z .'-]+),?\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)?/);
        if (m) {
          return [m[1], [m[2], m[3]].filter(Boolean).join(' ')].filter(Boolean).join(', ');
        }
        return tail;
      }
    }
    return '';
  };

  // Opportunistically resolve missing street lines via Nominatim using business name + city
  useEffect(() => {
    const businesses: any[] = Array.isArray(scanResults?.businesses) ? scanResults.businesses : [];
    if (!businesses.length) return;
    // Also verify via Google Places for authoritative addresses
    const loadGoogle = async (): Promise<any> => {
      if (typeof window !== 'undefined' && (window as any).google?.maps?.places) return (window as any).google;
      await new Promise<void>((resolve, reject) => {
        const id = 'gmaps-places-loader';
        const existing = document.getElementById(id) as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('gmaps load error')));
          return;
        }
        const s = document.createElement('script');
        s.id = id;
        s.async = true;
        s.defer = true;
        const key = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) || 'AIzaSyBsiXduDa2PIqnkMnaqUnvuBBGroPy2dnM';
        s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=quarterly&libraries=places`;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('gmaps load error'));
        document.head.appendChild(s);
      });
      return (window as any).google;
    };
    const run = async () => {
      let g: any | null = null;
      try { g = await loadGoogle(); } catch {}
      let svc: any | null = null;
      if (g && g.maps?.places) {
        try { svc = new g.maps.places.PlacesService(document.createElement('div')); } catch {}
      }
      for (const b of businesses) {
        const id = b?.business_id || b?.id || b?.name;
        if (!id || resolvedAddresses[id]) continue;
        const street = getStreetAddress(b);
        const looksMissing = !(typeof street === 'string' && /\d/.test(street));
        if (!looksMissing && !svc) continue; // already adequate
        const cityLine = getCityStateZip(b) || searchTerm;
        const q = [b?.name, cityLine].filter(Boolean).join(' ');
        let resolvedLine: string | null = null;
        // First try Google Places (authoritative)
        if (svc) {
          try {
            await new Promise<void>((resolve) => {
              svc.textSearch({ query: q }, (results: any[], status: string) => {
                try {
                  if (Array.isArray(results) && results.length > 0) {
                    const r0 = results[0];
                    const fa = r0?.formatted_address as string | undefined;
                    if (typeof fa === 'string' && fa.includes(',')) {
                      const first = fa.split(',')[0]?.trim();
                      if (first && /\d/.test(first)) resolvedLine = first;
                    }
                  }
                } finally { resolve(); }
              });
            });
          } catch {}
        }
        // Fallback to Nominatim if Places not available
        if (!resolvedLine) {
          try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&accept-language=en-US&q=${encodeURIComponent(q)}&email=okapiq-support@okapiq.com`;
            const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
            const data = await resp.json();
            if (Array.isArray(data) && data.length > 0 && data[0]?.address) {
              const addr = data[0].address as any;
              const line1 = `${addr.house_number ? addr.house_number + ' ' : ''}${addr.road || addr.street || ''}`.trim();
              if (line1 && /\d/.test(line1)) {
                resolvedLine = line1;
              }
            }
          } catch {}
        }
        if (resolvedLine) setResolvedAddresses(prev => ({ ...prev, [id]: resolvedLine! }));
        // Nominatim usage policy: throttle requests
        await new Promise(res => setTimeout(res, 600));
      }
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(scanResults?.businesses)]);

  return (
    <div className="min-h-screen bg-[#fcfbfa]">
      <div className="relative z-10">
        {/* Header (optional) */}
        {showHeader && (
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
                    onClick={() => onNavigate('landing')}
                    className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 transition-colors"
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
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Source indicators */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {Object.entries(sources).map(([key, enabled]) => (
              <div key={key} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border ${enabled ? 'border-okapi-brown-200 bg-white text-okapi-brown-800' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                {key.replace('_', ' ')}
              </div>
            ))}
          </div>
          {/* Search Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-okapi-brown-200 p-6 mb-8"
          >
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              {/* Location Input + Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-okapi-brown-700 mb-2">
                  Location *
                </label>
                <div className="flex items-stretch gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-okapi-brown-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter city, state, or zip code"
                      className="w-full pl-10 pr-4 py-3 border border-okapi-brown-300 rounded-lg focus:ring-2 focus:ring-okapi-brown-500 focus:border-okapi-brown-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => void handleScan()}
                    className="px-4 py-3 rounded-lg bg-okapi-brown-600 hover:bg-okapi-brown-700 text-white font-semibold shadow-sm"
                  >
                    Search
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {popularLocations.slice(0, 6).map((location) => (
                    <button
                      key={location}
                      onClick={() => { setSearchTerm(location); const id = window.setTimeout(() => { void handleScan(); }, 10); window.setTimeout(() => window.clearTimeout(id), 1000); }}
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
                  Industry *
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

              {/* Min Revenue */}
              <div>
                <label className="block text-sm font-medium text-okapi-brown-700 mb-2">
                  Min Revenue
                </label>
                <input
                  type="text"
                  value={minRevenue}
                  onChange={(e) => setMinRevenue(e.target.value)}
                  placeholder="$1M"
                  className="w-full px-4 py-3 border border-okapi-brown-300 rounded-lg focus:ring-2 focus:ring-okapi-brown-500 focus:border-okapi-brown-500 transition-colors"
                />
              </div>

              {/* Max Revenue */}
              <div>
                <label className="block text-sm font-medium text-okapi-brown-700 mb-2">
                  Max Revenue
                </label>
                <input
                  type="text"
                  value={maxRevenue}
                  onChange={(e) => setMaxRevenue(e.target.value)}
                  placeholder="$10M"
                  className="w-full px-4 py-3 border border-okapi-brown-300 rounded-lg focus:ring-2 focus:ring-okapi-brown-500 focus:border-okapi-brown-500 transition-colors"
                />
              </div>

              {/* Owner Age */}
              <div>
                <label className="block text-sm font-medium text-okapi-brown-700 mb-2">
                  Owner Age
                </label>
                <select
                  value={ownerAge}
                  onChange={(e) => setOwnerAge(e.target.value)}
                  className="w-full px-4 py-3 border border-okapi-brown-300 rounded-lg focus:ring-2 focus:ring-okapi-brown-500 focus:border-okapi-brown-500 transition-colors"
                >
                  <option value="">Any age</option>
                  <option value="under_30">Under 30</option>
                  <option value="30_40">30-40</option>
                  <option value="40_50">40-50</option>
                  <option value="50_60">50-60</option>
                  <option value="60_plus">60+</option>
                </select>
              </div>

              {/* Note: searches use the Location "Search" button. Former scan button removed. */}
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
                    aria-label="List View"
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
                    aria-label="Map View"
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Working overlay */}
          {working.active && (
            <div className="fixed inset-0 z-40 bg-black/10">
              <div className="pointer-events-none fixed inset-x-0 top-20 z-50 mx-auto flex w-full max-w-xl items-center gap-3 rounded-xl border border-okapi-brown-200 bg-white/90 p-3 shadow-lg backdrop-blur">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-okapi-brown-600 border-t-transparent" />
                <div className="flex-1">
                  <div className="text-sm text-okapi-brown-800 mb-1">{working.step}</div>
                  <div className="h-1.5 w-full overflow-hidden rounded bg-okapi-brown-100">
                    <div className="h-1.5 bg-okapi-brown-600 transition-all" style={{ width: `${((workingIndex+1)/workingSteps.length)*100}%` }} />
                  </div>
                </div>
                <div className="pointer-events-auto text-[10px] font-semibold rounded-full px-2 py-1 bg-emerald-600 text-white">AI</div>
              </div>
            </div>
          )}

          {/* Results Section moved ABOVE side panels to ensure immediate visibility */}
          <div ref={resultsRef} />
          {scanResults && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 mb-8"
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
                <h2 className="text-xl font-bold text-okapi-brown-900">Market Results</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-okapi-brown-600">{scanResults.businesses?.length || 0} businesses found</span>
                </div>
              </div>

              {/* List View */}
              {viewMode === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(scanResults.businesses || []).map((business: any, index: number) => (
                    <motion.div
                      key={`${business.name}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-lg border border-okapi-brown-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-okapi-brown-900">{business.name || 'Unknown Business'}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-okapi-brown-600">{business.rating || 'N/A'}</span>
                          </div>
                        </div>
                        {Array.isArray(business.tags) && business.tags.some((t:string)=> t.includes('enriched_with_web_ai') || t.includes('enriched_with_nlp')) && (
                          <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> AI-enhanced
                          </div>
                        )}
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="text-sm text-okapi-brown-600">
                                <div>{(resolvedAddresses[business?.business_id || business?.id || business?.name] || getStreetAddress(business))}</div>
                                <div className="flex gap-4">
                                  <span>{getCityStateZip(business)}</span>
                                  <span>{business?.contact?.phone || business.phone || 'Phone not available'}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200">
                              <span className="text-emerald-700 text-xl font-bold">{(business?.analysis?.lead_score?.overall_score ?? business.lead_score ?? 0) as any}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Business Type</span><span className="text-okapi-brown-900 font-medium">{business?.business_type || business?.category || 'N/A'}</span></div>
                            <div className="flex justify-between truncate"><span className="text-okapi-brown-500">Website</span>{(() => { const s = business?.contact?.website || business?.website; if (!s) return (<span className="text-okapi-brown-900 font-medium">N/A</span>); const url = /^https?:\/\//i.test(s) ? s : `https://${s}`; return (<a className="text-okapi-brown-900 font-medium truncate max-w-[60%]" href={url} target="_blank" rel="noopener noreferrer">{s}</a>); })()}</div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Gmap rating</span><span className="text-okapi-brown-900 font-medium">{business?.gmap_rating ?? business?.metrics?.rating ?? 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Min Revenue</span><span className="text-okapi-brown-900 font-medium">{business?.computed?.min_revenue ? `$${(business.computed.min_revenue).toLocaleString()}` : 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Max Revenue</span><span className="text-okapi-brown-900 font-medium">{business?.computed?.max_revenue ? `$${(business.computed.max_revenue).toLocaleString()}` : 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Owner Age</span><span className="text-okapi-brown-900 font-medium">{business?.computed?.owner_age ?? 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Business phone</span><span className="text-okapi-brown-900 font-medium">{business?.contact?.phone || business?.phone || 'N/A'}</span></div>
                            <div className="flex justify-between truncate"><span className="text-okapi-brown-500">Business email</span><span className="text-okapi-brown-900 font-medium truncate max-w-[60%]">{business?.contact?.email || business?.email || 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">City</span><span className="text-okapi-brown-900 font-medium">{business?.address?.city || ''}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">State</span><span className="text-okapi-brown-900 font-medium">{business?.address?.state || ''}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Zip Code</span><span className="text-okapi-brown-900 font-medium">{business?.address?.zip_code || ''}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500"># Locations</span><span className="text-okapi-brown-900 font-medium">{business?.computed?.num_locations ?? 1}</span></div>
                            <div className="flex justify-between"><span className="text-okapi-brown-500">Source</span><span className="text-okapi-brown-900 font-medium">{business?.computed?.source || business?.source || (Array.isArray(business?.data_sources) ? business.data_sources.join(', ') : 'N/A')}</span></div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-okapi-brown-100">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${getRiskColor(business?.analysis?.succession_risk?.risk_score ?? business.succession_risk_score)}`}>{getRiskLevel(business?.analysis?.succession_risk?.risk_score ?? business.succession_risk_score)}</span>
                            <div className="flex items-center gap-3">
                              {(business?.contact?.website || business.website) && (<a href={business?.contact?.website || business.website} target="_blank" rel="noopener noreferrer" className="text-okapi-brown-600 hover:text-okapi-brown-800 transition-colors"><ExternalLink className="w-4 h-4" /></a>)}
                              <button onClick={() => focusBusinessOnMap(business)} className="text-okapi-brown-600 hover:text-okapi-brown-800 transition-colors"><MapPin className="w-4 h-4" /></button>
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

          {/* Intelligence Sources + Advanced Filters side panel (moved below results) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow border border-okapi-brown-200 p-6">
              <h3 className="text-xl font-bold text-okapi-brown-900 mb-4">Intelligence Sources</h3>
              <div className="space-y-3 text-sm text-okapi-brown-800">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.google_maps} onChange={e=>setSources(s=>({...s,google_maps:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Google Maps</span>
                    <div className="text-okapi-brown-600 text-xs">Local results, ratings, reviews</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.apify_gmaps} onChange={e=>setSources(s=>({...s,apify_gmaps:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Apify Google Maps Scraper</span>
                    <div className="text-okapi-brown-600 text-xs">Turbo GMaps actor (fast, resilient)</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.apify_gmaps_email} onChange={e=>setSources(s=>({...s,apify_gmaps_email:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Apify GMaps Email Extractor</span>
                    <div className="text-okapi-brown-600 text-xs">Emails from listings/websites</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.apify_gmaps_websites} onChange={e=>setSources(s=>({...s,apify_gmaps_websites:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Apify GMaps + Websites</span>
                    <div className="text-okapi-brown-600 text-xs">Leads + website scraping</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.google_serp} onChange={e=>setSources(s=>({...s,google_serp:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Google SERP (SerpAPI)</span>
                    <div className="text-okapi-brown-600 text-xs">Organic results, sites, phones</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.yelp} onChange={e=>setSources(s=>({...s,yelp:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Yelp Intelligence</span>
                    <div className="text-okapi-brown-600 text-xs">Owner detection, sentiment analysis</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={Boolean((sources as any).firecrawl)} onChange={e=>setSources(s=>({...s, firecrawl: e.target.checked}))} />
                  <span>
                    <span className="font-medium">Firecrawl</span>
                    <div className="text-okapi-brown-600 text-xs">Hosted scraping fallback</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.apify_website_crawler} onChange={e=>setSources(s=>({...s,apify_website_crawler:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Apify Website Crawler</span>
                    <div className="text-okapi-brown-600 text-xs">Content for NLP enrichment</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.apify_apollo} onChange={e=>setSources(s=>({...s,apify_apollo:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Apify Apollo</span>
                    <div className="text-okapi-brown-600 text-xs">Firmographics, contacts</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.apify_linkedin_jobs} onChange={e=>setSources(s=>({...s,apify_linkedin_jobs:e.target.checked}))} />
                  <span>
                    <span className="font-medium">Apify LinkedIn Jobs</span>
                    <div className="text-okapi-brown-600 text-xs">Hiring and activity signals</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.linkedin} onChange={e=>setSources(s=>({...s,linkedin:e.target.checked}))} />
                  <span>
                    <span className="font-medium">LinkedIn Signals</span>
                    <div className="text-okapi-brown-600 text-xs">Deal activity, owner profiles</div>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" checked={sources.sba_records} onChange={e=>setSources(s=>({...s,sba_records:e.target.checked}))} />
                  <span>
                    <span className="font-medium">SBA Records</span>
                    <div className="text-okapi-brown-600 text-xs">Loan history, succession signals</div>
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-okapi-brown-200 p-6">
              <h3 className="text-xl font-bold text-okapi-brown-900 mb-4">Advanced Filters</h3>
              <div className="space-y-3 text-sm text-okapi-brown-800">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={advFilters.includeRisk} onChange={e=>setAdvFilters(f=>({...f,includeRisk:e.target.checked}))} />
                  <span>Include succession risk analysis</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={advFilters.fragmentation} onChange={e=>setAdvFilters(f=>({...f,fragmentation:e.target.checked}))} />
                  <span>Fragmentation analysis</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={advFilters.linkedinSignals} onChange={e=>setAdvFilters(f=>({...f,linkedinSignals:e.target.checked}))} />
                  <span>LinkedIn deal signals</span>
                </label>
              </div>
            </div>
          </div>

          {/* Interactive Map - Positioned right after View toggle */}
          {viewMode === 'map' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 rounded-2xl shadow-lg border border-[#D6C6B8] p-4 bg-[#F6F0E9]"
            >
              <InteractiveMap 
                businesses={(scanResults?.businesses || []).map((b:any, i:number)=>{
                  // normalize possible coordinate shapes (API returns address.coordinates)
                  const coordArray = Array.isArray(b?.address?.coordinates)
                    ? b.address.coordinates
                    : (Array.isArray(b?.coordinates) ? b.coordinates : null);
                  const lat = b?.location?.lat ?? b?.lat ?? b?.coordinates?.lat ?? (coordArray ? coordArray[0] : undefined);
                  const lng = b?.location?.lng ?? b?.lng ?? b?.coordinates?.lng ?? (coordArray ? coordArray[1] : undefined);
                  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
                  return {
                    id: b.business_id || b.id || i,
                    name: b.name || b.business_name || 'Business',
                    position: [lat, lng] as [number, number],
                    tam: b?.metrics?.tam_estimate ? `$${Number(b.metrics.tam_estimate).toLocaleString()}` : undefined,
                    score: b?.analysis?.lead_score?.overall_score ?? b?.scores?.overall
                  };
                }).filter(Boolean)}
                center={(scanResults?.center && typeof scanResults.center.lat==='number' && typeof scanResults.center.lng==='number') ? [scanResults.center.lat, scanResults.center.lng] : userCenter}
                onBusinessClick={handleBusinessClick}
                showHeat={true}
                fitToBusinesses={false}
                zoom={4}
                markerItems={(scanResults?.businesses || []).map((b:any, i:number)=>{
                  const coordArray = Array.isArray(b?.address?.coordinates)
                    ? b.address.coordinates
                    : (Array.isArray(b?.coordinates) ? b.coordinates : null);
                  const lat = b?.location?.lat ?? b?.lat ?? b?.coordinates?.lat ?? (coordArray ? coordArray[0] : undefined);
                  const lng = b?.location?.lng ?? b?.lng ?? b?.coordinates?.lng ?? (coordArray ? coordArray[1] : undefined);
                  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
                  return {
                    id: b.business_id || b.id || i,
                    name: b.name || b.business_name || 'Business',
                    position: [lat, lng] as [number, number]
                  };
                }).filter(Boolean)}
                heightClassName="h-[520px]"
                crimeCity={searchTerm}
                crimeDaysBack={180}
              />
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