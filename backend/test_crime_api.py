#!/usr/bin/env python3
"""
Simple standalone test server for crime heatmap
"""
import io
import math
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Crime Heatmap Test")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def tile_to_bbox(z, x, y):
    """Convert tile coordinates to geographic bounding box"""
    n = 2.0 ** z
    lon_deg_left = x / n * 360.0 - 180.0
    lon_deg_right = (x + 1) / n * 360.0 - 180.0
    lat_rad_top = math.atan(math.sinh(math.pi * (1 - 2 * y / n)))
    lat_rad_bottom = math.atan(math.sinh(math.pi * (1 - 2 * (y + 1) / n)))
    lat_deg_top = lat_rad_top * 180.0 / math.pi
    lat_deg_bottom = lat_rad_bottom * 180.0 / math.pi
    return (lon_deg_left, lat_deg_bottom, lon_deg_right, lat_deg_top)

def create_crime_heatmap_tile(crime_points, bbox, z, tile_size=256):
    """Create a proper red crime heatmap tile like Crimeometer"""
    try:
        from PIL import Image, ImageDraw, ImageFilter
        import numpy as np
        
        # Create transparent base
        img = Image.new('RGBA', (tile_size, tile_size), (0, 0, 0, 0))
        
        if not crime_points:
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            return buffer.getvalue()
        
        # Create heat intensity array
        heat_array = np.zeros((tile_size, tile_size), dtype=np.float32)
        
        # Process each crime point
        for point in crime_points:
            lat, lng, intensity = point[0], point[1], point[2]
            
            # Check if point is within tile bounds
            if bbox[0] <= lng <= bbox[2] and bbox[1] <= lat <= bbox[3]:
                # Convert to pixel coordinates
                px = int((lng - bbox[0]) / (bbox[2] - bbox[0]) * tile_size)
                py = int((bbox[3] - lat) / (bbox[3] - bbox[1]) * tile_size)
                
                if 0 <= px < tile_size and 0 <= py < tile_size:
                    # Much smaller radius for localized crime hotspots like Crimeometer
                    radius = max(8, min(25, int(20 / max(z-5, 1))))
                    
                    # Add heat at this location
                    for dy in range(-radius, radius + 1):
                        for dx in range(-radius, radius + 1):
                            heat_px = px + dx
                            heat_py = py + dy
                            
                            if 0 <= heat_px < tile_size and 0 <= heat_py < tile_size:
                                distance = math.sqrt(dx*dx + dy*dy)
                                if distance <= radius:
                                    # Gaussian heat distribution - much more localized
                                    sigma = radius / 4.0
                                    heat_value = intensity * math.exp(-(distance**2) / (2 * sigma**2)) * 20.0
                                    heat_array[heat_py, heat_px] += heat_value
        
        # Normalize heat array
        if heat_array.max() > 0:
            heat_array = heat_array / heat_array.max()
            heat_array = np.clip(heat_array, 0, 1)
        
        # Create red crime heatmap like Crimeometer
        colored_data = np.zeros((tile_size, tile_size, 4), dtype=np.uint8)
        
        for y_idx in range(tile_size):
            for x_idx in range(tile_size):
                heat_val = heat_array[y_idx, x_idx]
                if heat_val > 0.001:  # Very low threshold
                    # Crimeometer-style red gradient
                    if heat_val < 0.2:
                        # Light red
                        red, green, blue = 255, 100, 100
                        alpha = int(120 + heat_val * 400)  # 120-200
                    elif heat_val < 0.4:
                        # Medium red
                        red, green, blue = 255, 50, 50
                        alpha = int(150 + heat_val * 300)  # 150-250
                    elif heat_val < 0.6:
                        # Dark red
                        red, green, blue = 255, 20, 20
                        alpha = int(180 + heat_val * 200)  # 180-250
                    elif heat_val < 0.8:
                        # Very dark red
                        red, green, blue = 200, 0, 0
                        alpha = 255
                    else:
                        # Maximum intensity - deep red
                        red, green, blue = 150, 0, 0
                        alpha = 255
                    
                    colored_data[y_idx, x_idx] = [red, green, blue, min(255, alpha)]
        
        # Create image from array
        heat_img = Image.fromarray(colored_data, 'RGBA')
        
        # Apply slight blur for smooth transitions
        heat_img = heat_img.filter(ImageFilter.GaussianBlur(radius=1.5))
        
        buffer = io.BytesIO()
        heat_img.save(buffer, format='PNG')
        return buffer.getvalue()
        
    except Exception as e:
        print(f"Error creating heatmap: {e}")
        # Return red test tile on error
        from PIL import Image
        img = Image.new('RGBA', (tile_size, tile_size), (255, 0, 0, 128))  # Semi-transparent red
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        return buffer.getvalue()

@app.get("/")
async def root():
    return {"message": "Crime Heatmap Test Server"}

@app.get("/analytics/crime-tiles/{z}/{x}/{y}")
async def get_crime_tiles(z: int, x: int, y: int, city: str = "San Francisco"):
    """Generate crime heat tiles for any US city"""
    
    # Get bounding box for this tile
    bbox = tile_to_bbox(z, x, y)
    
    # Create realistic crime choropleth with many small localized hotspots for any city
    crime_data = []
    
    # Define crime patterns for major US cities
    city_crime_patterns = {
        "san francisco": {
            "high": [
                (37.7849, -122.4094, "Tenderloin"),
                (37.7753, -122.4180, "SOMA"), 
                (37.7599, -122.4148, "Mission"),
                (37.7809, -122.4149, "Union Square"),
            ],
            "medium": [
                (37.7609, -122.4348, "Castro"),
                (37.7693, -122.4463, "Haight"),
                (37.7749, -122.4094, "Financial"),
                (37.7941, -122.4078, "Chinatown"),
            ],
            "low": [
                (37.7599, -122.4499, "Richmond"),
                (37.7899, -122.3999, "North Beach"),
                (37.7549, -122.4399, "Noe Valley"),
                (37.7899, -122.4399, "Pacific Heights"),
            ]
        },
        "new york city": {
            "high": [
                (40.7831, -73.9712, "Harlem"),
                (40.6892, -73.9442, "Bedford-Stuyvesant"),
                (40.6782, -73.9442, "Crown Heights"),
                (40.8176, -73.9182, "Bronx South"),
            ],
            "medium": [
                (40.7282, -73.7949, "Queens"),
                (40.7505, -73.9934, "Times Square"),
                (40.7831, -73.9442, "Upper Manhattan"),
                (40.6892, -73.9712, "Brooklyn"),
            ],
            "low": [
                (40.7831, -73.9712, "Upper East Side"),
                (40.7505, -73.9772, "Chelsea"),
                (40.7282, -73.9942, "Lower Manhattan"),
                (40.6892, -73.9442, "Park Slope"),
            ]
        },
        "los angeles": {
            "high": [
                (34.0522, -118.2437, "Downtown LA"),
                (33.9425, -118.4081, "South LA"),
                (34.0928, -118.2951, "Hollywood"),
                (34.0194, -118.2863, "Mid-Wilshire"),
            ],
            "medium": [
                (34.1367, -118.3532, "Van Nuys"),
                (34.0730, -118.4003, "Beverly Hills"),
                (34.0928, -118.2768, "Los Feliz"),
                (33.9731, -118.2468, "Inglewood"),
            ],
            "low": [
                (34.0194, -118.4912, "Santa Monica"),
                (34.1522, -118.2437, "Pasadena"),
                (34.0194, -118.2863, "Westwood"),
                (34.0730, -118.4003, "Bel Air"),
            ]
        },
        "chicago": {
            "high": [
                (41.8369, -87.6847, "West Side"),
                (41.7587, -87.6998, "South Side"),
                (41.8781, -87.6298, "Downtown"),
                (41.9028, -87.6847, "North Side"),
            ],
            "medium": [
                (41.9484, -87.6553, "Lincoln Park"),
                (41.8369, -87.6053, "Hyde Park"),
                (41.8781, -87.6553, "Loop"),
                (41.9169, -87.6847, "Lakeview"),
            ],
            "low": [
                (41.9484, -87.6298, "Gold Coast"),
                (41.8587, -87.6053, "Millennium Park"),
                (41.9169, -87.6553, "River North"),
                (41.8928, -87.6053, "Navy Pier"),
            ]
        },
        "houston": {
            "high": [
                (29.7604, -95.3698, "Downtown Houston"),
                (29.6516, -95.3698, "South Houston"),
                (29.8044, -95.4194, "Northwest Houston"),
                (29.7604, -95.4194, "Southwest Houston"),
            ],
            "medium": [
                (29.7372, -95.4194, "Galleria"),
                (29.8044, -95.3698, "The Heights"),
                (29.7604, -95.3202, "East Houston"),
                (29.6847, -95.3698, "Medical Center"),
            ],
            "low": [
                (29.7372, -95.3202, "River Oaks"),
                (29.8044, -95.3202, "Memorial"),
                (29.7604, -95.2706, "Museum District"),
                (29.6847, -95.3202, "Rice Village"),
            ]
        },
        "phoenix": {
            "high": [
                (33.4484, -112.0740, "Downtown Phoenix"),
                (33.3895, -112.0740, "South Phoenix"),
                (33.5073, -112.0740, "North Phoenix"),
                (33.4484, -112.1336, "West Phoenix"),
            ],
            "medium": [
                (33.4484, -112.0144, "East Phoenix"),
                (33.5073, -112.0144, "Paradise Valley"),
                (33.3895, -112.0144, "Ahwatukee"),
                (33.4484, -111.9548, "Scottsdale Border"),
            ],
            "low": [
                (33.5073, -111.9548, "North Scottsdale"),
                (33.4484, -111.8952, "Tempe Border"),
                (33.3895, -111.9548, "Chandler Border"),
                (33.5662, -112.0144, "Deer Valley"),
            ]
        },
        "philadelphia": {
            "high": [
                (39.9526, -75.1652, "North Philadelphia"),
                (39.9042, -75.1652, "South Philadelphia"),
                (39.9284, -75.1652, "Center City"),
                (39.9526, -75.2128, "West Philadelphia"),
            ],
            "medium": [
                (39.9768, -75.1652, "North Philly"),
                (39.9284, -75.1176, "East Philadelphia"),
                (39.9042, -75.1176, "University City"),
                (39.9526, -75.1176, "Temple Area"),
            ],
            "low": [
                (39.9768, -75.1176, "Fishtown"),
                (39.9042, -75.2128, "Southwest Philly"),
                (39.9284, -75.2128, "Fairmount"),
                (39.9768, -75.2128, "Mount Airy"),
            ]
        },
        "seattle": {
            "high": [
                (47.6097, -122.3331, "Downtown Seattle"),
                (47.5952, -122.3331, "International District"),
                (47.6097, -122.3807, "Ballard"),
                (47.6242, -122.3331, "Capitol Hill"),
            ],
            "medium": [
                (47.6387, -122.3331, "University District"),
                (47.6097, -122.2855, "Bellevue Border"),
                (47.5807, -122.3331, "Georgetown"),
                (47.6242, -122.3807, "Fremont"),
            ],
            "low": [
                (47.6387, -122.2855, "Eastside"),
                (47.6532, -122.3331, "Green Lake"),
                (47.6097, -122.4283, "West Seattle"),
                (47.5662, -122.3331, "Tukwila Border"),
            ]
        },
        "denver": {
            "high": [
                (39.7392, -104.9903, "Downtown Denver"),
                (39.7247, -104.9903, "South Denver"),
                (39.7392, -105.0379, "West Denver"),
                (39.7537, -104.9903, "North Denver"),
            ],
            "medium": [
                (39.7392, -104.9427, "East Denver"),
                (39.7247, -104.9427, "Cherry Creek"),
                (39.7537, -104.9427, "Highlands"),
                (39.7247, -105.0379, "Lakewood Border"),
            ],
            "low": [
                (39.7682, -104.9903, "Westminster Border"),
                (39.7102, -104.9903, "Littleton Border"),
                (39.7392, -104.8951, "Aurora Border"),
                (39.7537, -105.0379, "Arvada Border"),
            ]
        },
        "boston": {
            "high": [
                (42.3601, -71.0589, "Downtown Boston"),
                (42.3456, -71.0589, "South End"),
                (42.3601, -71.1065, "Cambridge Border"),
                (42.3746, -71.0589, "North End"),
            ],
            "medium": [
                (42.3456, -71.0113, "Back Bay"),
                (42.3746, -71.0113, "Beacon Hill"),
                (42.3601, -71.0113, "Financial District"),
                (42.3311, -71.0589, "Dorchester"),
            ],
            "low": [
                (42.3891, -71.0589, "Charlestown"),
                (42.3456, -71.1065, "Jamaica Plain"),
                (42.3746, -71.1065, "Harvard Area"),
                (42.3601, -70.9637, "East Boston"),
            ]
        },
        "las vegas": {
            "high": [
                (36.1699, -115.1398, "Downtown Las Vegas"),
                (36.1554, -115.1398, "South Las Vegas"),
                (36.1699, -115.1874, "West Las Vegas"),
                (36.1844, -115.1398, "North Las Vegas"),
            ],
            "medium": [
                (36.1699, -115.0922, "East Las Vegas"),
                (36.1410, -115.1398, "Henderson Border"),
                (36.1988, -115.1398, "Summerlin"),
                (36.1554, -115.0922, "Airport Area"),
            ],
            "low": [
                (36.2133, -115.1398, "North Summerlin"),
                (36.1265, -115.1398, "Henderson"),
                (36.1699, -115.0446, "Lake Las Vegas"),
                (36.1554, -115.2350, "Red Rock"),
            ]
        }
    }
    
    # Normalize city name and get crime pattern
    city_key = city.lower().replace(" ", " ").strip()
    if city_key not in city_crime_patterns:
        # Default to San Francisco pattern for unlisted cities
        city_key = "san francisco"
    
    pattern = city_crime_patterns[city_key]
    high_crime_centers = pattern["high"]
    medium_crime_centers = pattern["medium"] 
    low_crime_centers = pattern["low"]
    
    # Generate clusters around each center for realistic choropleth
    import random
    
    # High crime clusters (intense red)
    for lat, lng, name in high_crime_centers:
        for _ in range(25):  # Dense clusters
            offset_lat = random.uniform(-0.005, 0.005)  # ~500m variation
            offset_lng = random.uniform(-0.005, 0.005)
            intensity = random.uniform(0.7, 1.0)  # High intensity
            crime_data.append((lat + offset_lat, lng + offset_lng, intensity))
    
    # Medium crime clusters (medium red)
    for lat, lng, name in medium_crime_centers:
        for _ in range(15):  # Medium density
            offset_lat = random.uniform(-0.008, 0.008)  # ~800m variation
            offset_lng = random.uniform(-0.008, 0.008)
            intensity = random.uniform(0.4, 0.7)  # Medium intensity
            crime_data.append((lat + offset_lat, lng + offset_lng, intensity))
    
    # Low crime clusters (light red)
    for lat, lng, name in low_crime_centers:
        for _ in range(8):  # Low density
            offset_lat = random.uniform(-0.012, 0.012)  # ~1.2km variation
            offset_lng = random.uniform(-0.012, 0.012)
            intensity = random.uniform(0.1, 0.4)  # Low intensity
            crime_data.append((lat + offset_lat, lng + offset_lng, intensity))
    
    # Create the crime heatmap tile
    tile_data = create_crime_heatmap_tile(crime_data, bbox, z)
    
    return Response(
        content=tile_data,
        media_type="image/png",
        headers={
            "Cache-Control": "max-age=300",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

if __name__ == "__main__":
    print("Starting Crime Heatmap Test Server on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
