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

export type MapBusiness = {
  id: string | number;
  name: string;
  position: [number, number];
  tam?: string;
  score?: number;
};

type InteractiveMapProps = {
  businesses?: MapBusiness[];
  center?: [number, number];
  heightClassName?: string;
  onBusinessClick?: (b: MapBusiness) => void;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  businesses = [
    { id: 1, name: "Golden Gate HVAC", position: [37.7749, -122.4194], tam: "$12M TAM", score: 92 },
    { id: 2, name: "Bay Area Plumbing Co", position: [37.7849, -122.4094], tam: "$8M TAM", score: 88 },
    { id: 3, name: "SF Electrical Services", position: [37.7649, -122.4294], tam: "$15M TAM", score: 85 },
  ],
  center = [37.7749, -122.4194],
  heightClassName = "h-96",
  onBusinessClick,
}) => {
  return (
    <div className={`w-full ${heightClassName} border border-gray-200 rounded-lg overflow-hidden`}>
      <MapContainer
        center={center}
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
            eventHandlers={onBusinessClick ? { click: () => onBusinessClick(business) } : undefined}
          >
            <Popup>
              <div className="text-center p-2">
                <h3 className="font-semibold text-gray-900">{business.name}</h3>
                {business.tam && <p className="text-sm text-gray-600">{business.tam}</p>}
                {typeof business.score === 'number' && <p className="text-sm text-gray-600">Score: {business.score}</p>}
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