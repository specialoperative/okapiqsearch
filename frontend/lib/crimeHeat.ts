// Crime heat data points for various US cities
export interface CrimeHeatPoint {
  lat: number;
  lng: number;
  intensity: number;
  city: string;
  type?: string;
}

export const US_CRIME_HEAT_POINTS: CrimeHeatPoint[] = [
  // San Francisco crime points
  { lat: 37.7749, lng: -122.4194, intensity: 0.8, city: "San Francisco", type: "assault" },
  { lat: 37.7849, lng: -122.4094, intensity: 0.9, city: "San Francisco", type: "theft" },
  { lat: 37.7649, lng: -122.4294, intensity: 0.7, city: "San Francisco", type: "burglary" },
  { lat: 37.7549, lng: -122.4394, intensity: 0.85, city: "San Francisco", type: "robbery" },
  { lat: 37.7949, lng: -122.3994, intensity: 0.6, city: "San Francisco", type: "vandalism" },
  { lat: 37.7649, lng: -122.4094, intensity: 0.75, city: "San Francisco", type: "theft" },
  { lat: 37.7749, lng: -122.3994, intensity: 0.8, city: "San Francisco", type: "assault" },
  { lat: 37.7849, lng: -122.4394, intensity: 0.9, city: "San Francisco", type: "robbery" },
  { lat: 37.7549, lng: -122.4094, intensity: 0.65, city: "San Francisco", type: "burglary" },
  { lat: 37.7949, lng: -122.4294, intensity: 0.7, city: "San Francisco", type: "vandalism" },
  
  // Berkeley crime points
  { lat: 37.8719, lng: -122.2730, intensity: 0.6, city: "Berkeley", type: "theft" },
  { lat: 37.8619, lng: -122.2630, intensity: 0.7, city: "Berkeley", type: "burglary" },
  { lat: 37.8819, lng: -122.2830, intensity: 0.5, city: "Berkeley", type: "vandalism" },
  { lat: 37.8519, lng: -122.2530, intensity: 0.65, city: "Berkeley", type: "assault" },
  { lat: 37.8919, lng: -122.2930, intensity: 0.8, city: "Berkeley", type: "robbery" },
  
  // Los Angeles crime points  
  { lat: 34.0522, lng: -118.2437, intensity: 0.85, city: "Los Angeles", type: "assault" },
  { lat: 34.0422, lng: -118.2337, intensity: 0.9, city: "Los Angeles", type: "theft" },
  { lat: 34.0622, lng: -118.2537, intensity: 0.75, city: "Los Angeles", type: "burglary" },
  { lat: 34.0322, lng: -118.2637, intensity: 0.8, city: "Los Angeles", type: "robbery" },
  { lat: 34.0722, lng: -118.2137, intensity: 0.7, city: "Los Angeles", type: "vandalism" },
  
  // New York crime points
  { lat: 40.7128, lng: -74.0060, intensity: 0.9, city: "New York", type: "theft" },
  { lat: 40.7228, lng: -73.9960, intensity: 0.85, city: "New York", type: "assault" },
  { lat: 40.7028, lng: -74.0160, intensity: 0.8, city: "New York", type: "burglary" },
  { lat: 40.7328, lng: -73.9860, intensity: 0.95, city: "New York", type: "robbery" },
  { lat: 40.6928, lng: -74.0260, intensity: 0.75, city: "New York", type: "vandalism" },
  
  // Chicago crime points
  { lat: 41.8781, lng: -87.6298, intensity: 0.8, city: "Chicago", type: "assault" },
  { lat: 41.8681, lng: -87.6198, intensity: 0.85, city: "Chicago", type: "theft" },
  { lat: 41.8881, lng: -87.6398, intensity: 0.7, city: "Chicago", type: "burglary" },
  { lat: 41.8581, lng: -87.6098, intensity: 0.9, city: "Chicago", type: "robbery" },
  { lat: 41.8981, lng: -87.6498, intensity: 0.65, city: "Chicago", type: "vandalism" }
];

// Helper function to get crime points for a specific city
export function getCrimePointsForCity(cityName: string): CrimeHeatPoint[] {
  return US_CRIME_HEAT_POINTS.filter(point => 
    point.city.toLowerCase().includes(cityName.toLowerCase())
  );
}

// Helper function to get all unique cities
export function getAllCities(): string[] {
  return Array.from(new Set(US_CRIME_HEAT_POINTS.map(point => point.city)));
}

// Helper function to calculate heat intensity for a given radius
export function calculateHeatIntensity(
  centerLat: number, 
  centerLng: number, 
  radius: number = 0.01,
  cityName?: string
): number {
  const points = cityName ? getCrimePointsForCity(cityName) : US_CRIME_HEAT_POINTS;
  
  let totalIntensity = 0;
  let pointCount = 0;
  
  points.forEach(point => {
    const distance = Math.sqrt(
      Math.pow(point.lat - centerLat, 2) + Math.pow(point.lng - centerLng, 2)
    );
    
    if (distance <= radius) {
      totalIntensity += point.intensity;
      pointCount++;
    }
  });
  
  return pointCount > 0 ? totalIntensity / pointCount : 0;
}
