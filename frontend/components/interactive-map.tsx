"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Star,
  Phone,
  Globe,
  Eye,
  Zap
} from 'lucide-react';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading interactive map...</p>
        </div>
      </div>
    )
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

interface Business {
  name: string;
  address: string;
  estimated_revenue?: number;
  employee_count?: number;
  lead_score?: number;
  succession_risk_score?: number;
  rating?: number;
  phone?: string;
  website?: string;
}

interface InteractiveMapProps {
  businesses: Business[];
  location: string;
  industry: string;
  onBusinessClick?: (business: Business) => void;
}

// Generate random coordinates for businesses (in a real app, these would come from geocoding)
const generateBusinessCoordinates = (businesses: Business[], location: string) => {
  // Base coordinates for different cities
  const cityCoordinates: { [key: string]: [number, number] } = {
    'San Francisco': [37.7749, -122.4194],
    'Los Angeles': [34.0522, -118.2437],
    'New York': [40.7128, -74.0060],
    'Chicago': [41.8781, -87.6298],
    'Miami': [25.7617, -80.1918],
    'Austin': [30.2672, -97.7431],
  };

  const baseCoords = cityCoordinates[location] || [37.7749, -122.4194];
  
  return businesses.map((business, index) => {
    // Generate coordinates within a reasonable radius of the city center
    const lat = baseCoords[0] + (Math.random() - 0.5) * 0.1;
    const lng = baseCoords[1] + (Math.random() - 0.5) * 0.1;
    return {
      ...business,
      coordinates: [lat, lng] as [number, number]
    };
  });
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  businesses, 
  location, 
  industry, 
  onBusinessClick 
}) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [businessesWithCoords, setBusinessesWithCoords] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (businesses.length > 0) {
      const coords = generateBusinessCoordinates(businesses, location);
      setBusinessesWithCoords(coords);
      setIsMapLoaded(true);
    }
  }, [businesses, location]);

  const getRiskColor = (riskScore: number | undefined) => {
    if (!riskScore || isNaN(riskScore)) return '#6B7280';
    if (riskScore >= 70) return '#EF4444';
    if (riskScore >= 40) return '#F59E0B';
    return '#10B981';
  };

  const getRiskLabel = (riskScore: number | undefined) => {
    if (!riskScore || isNaN(riskScore)) return 'Unknown';
    if (riskScore >= 70) return 'High Risk';
    if (riskScore >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount || isNaN(amount)) return '$0';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getPriorityColor = (business: Business) => {
    const signalScore = business.succession_risk_score || 0;
    const leadScore = business.lead_score || 0;

    if (signalScore > 70 && leadScore > 80) return 'bg-red-500';
    if (signalScore > 40 || leadScore > 70) return 'bg-orange-500';
    if (business.estimated_revenue && business.estimated_revenue > 2000000) return 'bg-green-500';
    return 'bg-blue-500';
  };

  if (mapError) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-96 bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl shadow-xl border border-red-200 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 mb-4">Unable to load the interactive map</p>
          <button 
            onClick={() => setMapError(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!isMapLoaded || businessesWithCoords.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl border border-blue-200 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading interactive map...</p>
        </div>
      </motion.div>
    );
  }

  // Calculate center coordinates
  const centerLat = businessesWithCoords[0]?.coordinates[0] || 37.7749;
  const centerLng = businessesWithCoords[0]?.coordinates[1] || -122.4194;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
    >
      {/* Enhanced Map Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Interactive Market Map
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              {businesses.length} businesses found in {location}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white text-xs">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-white text-xs">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-white text-xs">High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Interactive Map */}
      <div className="relative map-container" style={{ height: '500px', overflow: 'hidden' }}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={12}
          style={{ 
            height: '100%', 
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
            tileSize={256}
            zoomOffset={0}
          />
          <ZoomControl position="bottomright" />
          
          {businessesWithCoords.map((business, index) => (
            <CircleMarker
              key={`${business.name}-${index}`}
              center={business.coordinates}
              radius={12}
              fillColor={getRiskColor(business.succession_risk_score)}
              color="white"
              weight={3}
              opacity={0.9}
              fillOpacity={0.8}
              eventHandlers={{
                click: () => {
                  setSelectedBusiness(business);
                  onBusinessClick?.(business);
                },
              }}
            >
              <Popup>
                <div className="p-4 min-w-64">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-gray-900 text-sm">{business.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(business)}`}></div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {business.address}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-600" />
                      <span className="text-gray-500">Revenue:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(business.estimated_revenue)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span className="text-gray-500">Employees:</span>
                      <span className="font-semibold text-gray-900">{business.employee_count || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-purple-600" />
                      <span className="text-gray-500">Lead Score:</span>
                      <span className="font-semibold text-gray-900">{business.lead_score || 'N/A'}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span className="text-gray-500">Risk:</span>
                      <span className="font-semibold text-gray-900">{getRiskLabel(business.succession_risk_score)}</span>
                    </div>
                  </div>
                  {business.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{business.rating} rating</span>
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Enhanced Map Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Click markers for business details
            </span>
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {businesses.length} businesses displayed
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {selectedBusiness && (
              <>
                {selectedBusiness.phone && (
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                )}
                {selectedBusiness.website && (
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Globe className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Business Details Panel */}
      <AnimatePresence>
        {selectedBusiness && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-bold text-gray-900">{selectedBusiness.name}</h4>
              <button 
                onClick={() => setSelectedBusiness(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{selectedBusiness.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="font-semibold text-green-600">{formatCurrency(selectedBusiness.estimated_revenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Employees</p>
                  <p className="font-semibold text-gray-900">{selectedBusiness.employee_count || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lead Score</p>
                  <p className="font-semibold text-purple-600">{selectedBusiness.lead_score || 'N/A'}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Risk Level</p>
                  <p className="font-semibold text-red-600">{getRiskLabel(selectedBusiness.succession_risk_score)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveMap; 