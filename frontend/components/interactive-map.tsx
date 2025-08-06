"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>
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

  useEffect(() => {
    if (businesses.length > 0) {
      const coords = generateBusinessCoordinates(businesses, location);
      setBusinessesWithCoords(coords);
      setIsMapLoaded(true);
    }
  }, [businesses, location]);

  const getRiskColor = (riskScore: number | undefined) => {
    if (!riskScore || isNaN(riskScore)) return '#9CA3AF';
    if (riskScore >= 70) return '#EF4444';
    if (riskScore >= 40) return '#F59E0B';
    return '#10B981';
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount || isNaN(amount)) return '$0';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-okapi-brown-50 to-okapi-brown-100 rounded-xl shadow-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 mb-4">Unable to load the interactive map</p>
          <button 
            onClick={() => setMapError(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isMapLoaded || businessesWithCoords.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-okapi-brown-50 to-okapi-brown-100 rounded-xl shadow-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-okapi-brown-600 mx-auto mb-4"></div>
          <p className="text-okapi-brown-600 font-medium">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  // Calculate center coordinates
  const centerLat = businessesWithCoords[0]?.coordinates[0] || 37.7749;
  const centerLng = businessesWithCoords[0]?.coordinates[1] || -122.4194;

  return (
    <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Map Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interactive Map</h3>
            <p className="text-sm text-gray-600">
              {businesses.length} businesses found in {location}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Low Risk</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">High Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Interactive Map */}
      <div className="h-80 relative map-container">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={12}
          style={{ 
            height: '100%', 
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
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
              radius={8}
              fillColor={getRiskColor(business.succession_risk_score)}
              color="white"
              weight={2}
              opacity={0.8}
              fillOpacity={0.7}
              eventHandlers={{
                click: () => onBusinessClick?.(business),
              }}
            >
              <Popup>
                <div className="p-2 min-w-48">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{business.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{business.address}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Revenue:</span>
                      <p className="font-medium text-gray-900">{formatCurrency(business.estimated_revenue)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Employees:</span>
                      <p className="font-medium text-gray-900">{business.employee_count || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Lead Score:</span>
                      <p className="font-medium text-gray-900">{business.lead_score || 'N/A'}%</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk:</span>
                      <p className="font-medium text-gray-900">
                        {business.succession_risk_score ? 
                          (business.succession_risk_score >= 70 ? 'High' : 
                           business.succession_risk_score >= 40 ? 'Medium' : 'Low') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Map Footer */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Click markers for business details</span>
          <span>{businesses.length} businesses displayed</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap; 