"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
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

// Business data with coordinates in San Francisco
const businesses = [
  {
    id: 1,
    name: "Golden Gate HVAC",
    position: [37.7749, -122.4194], // San Francisco center
    tam: "$12M TAM",
    score: 92
  },
  {
    id: 2,
    name: "Bay Area Plumbing Co", 
    position: [37.7849, -122.4094], // Slightly north
    tam: "$8M TAM",
    score: 88
  },
  {
    id: 3,
    name: "SF Electrical Services",
    position: [37.7649, -122.4294], // Slightly south
    tam: "$15M TAM", 
    score: 85
  }
];

const InteractiveMap: React.FC = () => {
  return (
    <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
      <MapContainer
        center={[37.7749, -122.4194]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {businesses.map((business) => (
          <Marker 
            key={business.id} 
            position={business.position as [number, number]}
          >
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-semibold text-gray-900">{business.name}</h3>
                <p className="text-sm text-gray-600">{business.tam}</p>
                <p className="text-sm text-gray-600">Score: {business.score}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map attribution */}
      <div className="text-xs text-gray-500 p-2 bg-white">
        © Leaflet | © OpenStreetMap contributors
      </div>
    </div>
  );
};

export default InteractiveMap;