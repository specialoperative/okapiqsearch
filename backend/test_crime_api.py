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

def get_city_crime_data(city_name):
    """Get crime data for different cities"""
    city_crime_data = {
        "san francisco": {
            "high_crime": [
                (37.7849, -122.4094, "Tenderloin"),
                (37.7753, -122.4180, "SOMA"),
                (37.7599, -122.4148, "Mission"),
                (37.7809, -122.4149, "Union Square"),
            ],
            "medium_crime": [
                (37.7609, -122.4348, "Castro"),
                (37.7693, -122.4463, "Haight"),
                (37.7749, -122.4094, "Financial"),
                (37.7941, -122.4078, "Chinatown"),
            ],
            "low_crime": [
                (37.7599, -122.4499, "Richmond"),
                (37.7899, -122.3999, "North Beach"),
                (37.7549, -122.4399, "Noe Valley"),
                (37.7899, -122.4399, "Pacific Heights"),
            ]
        },
        "new york city": {
            "high_crime": [
                (40.7589, -73.9851, "Times Square"),
                (40.7505, -73.9934, "Hell's Kitchen"),
                (40.6782, -73.9442, "East New York"),
                (40.8176, -73.9482, "Washington Heights"),
            ],
            "medium_crime": [
                (40.7831, -73.9712, "Upper West Side"),
                (40.7282, -73.7949, "Queens"),
                (40.6892, -73.9442, "Bedford-Stuyvesant"),
                (40.7505, -73.9442, "Midtown East"),
            ],
            "low_crime": [
                (40.7749, -73.9442, "Upper East Side"),
                (40.7282, -74.0776, "Tribeca"),
                (40.7505, -73.9776, "Greenwich Village"),
                (40.7831, -73.9442, "Central Park East"),
            ]
        },
        "los angeles": {
            "high_crime": [
                (34.0522, -118.2437, "Downtown LA"),
                (34.0928, -118.2888, "Hollywood"),
                (33.9425, -118.4081, "Inglewood"),
                (34.0195, -118.4912, "Venice"),
            ],
            "medium_crime": [
                (34.1478, -118.1445, "Pasadena"),
                (34.0736, -118.4004, "West Hollywood"),
                (34.0430, -118.2673, "Koreatown"),
                (33.9731, -118.2468, "South LA"),
            ],
            "low_crime": [
                (34.1184, -118.3004, "Beverly Hills"),
                (34.0522, -118.3437, "West LA"),
                (34.1408, -118.2258, "Glendale"),
                (34.0195, -118.4437, "Santa Monica"),
            ]
        },
        "chicago": {
            "high_crime": [
                (41.8781, -87.6298, "The Loop"),
                (41.8902, -87.6348, "Near North Side"),
                (41.7637, -87.6062, "Englewood"),
                (41.7493, -87.6256, "West Englewood"),
            ],
            "medium_crime": [
                (41.9484, -87.6553, "Lincoln Park"),
                (41.9742, -87.6566, "Lakeview"),
                (41.8369, -87.6847, "Little Village"),
                (41.8902, -87.6737, "Wicker Park"),
            ],
            "low_crime": [
                (41.9278, -87.6556, "Gold Coast"),
                (41.8902, -87.6556, "River North"),
                (42.0083, -87.6566, "Lincoln Square"),
                (41.8781, -87.6237, "Millennium Park"),
            ]
        },
        "houston": {
            "high_crime": [
                (29.7604, -95.3698, "Downtown Houston"),
                (29.7372, -95.3897, "Third Ward"),
                (29.6910, -95.2091, "South Park"),
                (29.8044, -95.4739, "Acres Homes"),
            ],
            "medium_crime": [
                (29.7749, -95.4194, "Galleria"),
                (29.7390, -95.3986, "Midtown"),
                (29.7272, -95.3386, "East End"),
                (29.8077, -95.4194, "Heights"),
            ],
            "low_crime": [
                (29.7749, -95.4637, "West University"),
                (29.7390, -95.4739, "River Oaks"),
                (29.8077, -95.3698, "Memorial"),
                (29.6910, -95.4194, "Bellaire"),
            ]
        },
        "phoenix": {
            "high_crime": [
                (33.4484, -112.0740, "Downtown Phoenix"),
                (33.5387, -112.1859, "Maryvale"),
                (33.4734, -112.0901, "South Mountain"),
                (33.4255, -112.0370, "Laveen"),
            ],
            "medium_crime": [
                (33.5387, -112.0740, "Central Phoenix"),
                (33.6160, -112.0370, "North Phoenix"),
                (33.4484, -111.9260, "Tempe"),
                (33.3061, -111.8413, "Chandler"),
            ],
            "low_crime": [
                (33.5387, -111.9260, "Scottsdale"),
                (33.6160, -111.8413, "Paradise Valley"),
                (33.4484, -111.8413, "Ahwatukee"),
                (33.3831, -111.9260, "South Scottsdale"),
            ]
        },
        "philadelphia": {
            "high_crime": [
                (39.9526, -75.1652, "Center City"),
                (39.9742, -75.1624, "North Philadelphia"),
                (39.9259, -75.1716, "South Philadelphia"),
                (39.9612, -75.2009, "West Philadelphia"),
            ],
            "medium_crime": [
                (40.0259, -75.1399, "Fishtown"),
                (39.9526, -75.1399, "Northern Liberties"),
                (39.9259, -75.1399, "Queen Village"),
                (40.0742, -75.1309, "Germantown"),
            ],
            "low_crime": [
                (39.9526, -75.1309, "Rittenhouse Square"),
                (40.0259, -75.1716, "Chestnut Hill"),
                (39.9259, -75.1309, "Society Hill"),
                (40.0742, -75.1624, "Mount Airy"),
            ]
        },
        "san antonio": {
            "high_crime": [
                (29.4241, -98.4936, "Downtown San Antonio"),
                (29.3913, -98.5428, "West Side"),
                (29.4669, -98.4425, "East Side"),
                (29.3844, -98.4936, "South Side"),
            ],
            "medium_crime": [
                (29.5047, -98.4936, "North Side"),
                (29.4241, -98.4425, "Midtown"),
                (29.5516, -98.4936, "Stone Oak"),
                (29.3372, -98.5939, "South West"),
            ],
            "low_crime": [
                (29.5516, -98.4425, "Alamo Heights"),
                (29.4669, -98.3914, "Terrell Hills"),
                (29.5047, -98.3914, "Olmos Park"),
                (29.5849, -98.4936, "Castle Hills"),
            ]
        },
        "san diego": {
            "high_crime": [
                (32.7157, -117.1611, "Downtown San Diego"),
                (32.6953, -117.1394, "Southeastern San Diego"),
                (32.7157, -117.1394, "East Village"),
                (32.7464, -117.1394, "Hillcrest"),
            ],
            "medium_crime": [
                (32.7464, -117.1611, "Balboa Park"),
                (32.7670, -117.1828, "Pacific Beach"),
                (32.7157, -117.2394, "Ocean Beach"),
                (32.6847, -117.1828, "Chula Vista"),
            ],
            "low_crime": [
                (32.8170, -117.2394, "La Jolla"),
                (32.7670, -117.2611, "Del Mar"),
                (32.8477, -117.2394, "Solana Beach"),
                (32.7157, -117.2828, "Point Loma"),
            ]
        },
        "dallas": {
            "high_crime": [
                (32.7767, -96.7970, "Downtown Dallas"),
                (32.7420, -96.8550, "Oak Cliff"),
                (32.8542, -96.7970, "South Dallas"),
                (32.7767, -96.7459, "Deep Ellum"),
            ],
            "medium_crime": [
                (32.8073, -96.8550, "North Dallas"),
                (32.7767, -96.8550, "Oak Lawn"),
                (32.8073, -96.7459, "Uptown"),
                (32.7420, -96.7459, "Bishop Arts"),
            ],
            "low_crime": [
                (32.8847, -96.7970, "Plano"),
                (32.8073, -96.7970, "Preston Center"),
                (32.8847, -96.7459, "Richardson"),
                (32.7767, -96.7100, "Lakewood"),
            ]
        },
        "austin": {
            "high_crime": [
                (30.2672, -97.7431, "Downtown Austin"),
                (30.2240, -97.7594, "South Austin"),
                (30.3072, -97.7431, "North Austin"),
                (30.2672, -97.7100, "East Austin"),
            ],
            "medium_crime": [
                (30.3405, -97.7431, "Round Rock"),
                (30.2240, -97.8094, "West Austin"),
                (30.2672, -97.6756, "Mueller"),
                (30.3072, -97.6756, "Pflugerville"),
            ],
            "low_crime": [
                (30.3738, -97.7431, "Cedar Park"),
                (30.2240, -97.8550, "Westlake"),
                (30.4405, -97.7431, "Georgetown"),
                (30.2672, -97.6245, "Del Valle"),
            ]
                  },
          "charlotte": {
              "high_crime": [
                  (35.2271, -80.8431, "Downtown Charlotte"),
                  (35.1971, -80.8751, "West Charlotte"),
                  (35.2571, -80.8751, "North Charlotte"),
                  (35.1971, -80.8111, "East Charlotte"),
              ],
              "medium_crime": [
                  (35.2571, -80.8111, "University Area"),
                  (35.2271, -80.7431, "Matthews"),
                  (35.1651, -80.8431, "South Charlotte"),
                  (35.2271, -80.9431, "Huntersville"),
              ],
              "low_crime": [
                  (35.2891, -80.8431, "Cornelius"),
                  (35.2571, -80.7111, "Mint Hill"),
                  (35.1351, -80.8111, "Pineville"),
                  (35.3271, -80.8751, "Davidson"),
              ]
          },
          "indianapolis": {
              "high_crime": [
                  (39.7684, -86.1581, "Downtown Indianapolis"),
                  (39.7364, -86.1901, "West Indianapolis"),
                  (39.8004, -86.1901, "North Indianapolis"),
                  (39.7364, -86.1261, "East Indianapolis"),
              ],
              "medium_crime": [
                  (39.8004, -86.1261, "Broad Ripple"),
                  (39.7684, -86.0581, "Fishers"),
                  (39.7044, -86.1581, "Greenwood"),
                  (39.7684, -86.2581, "Speedway"),
              ],
              "low_crime": [
                  (39.8364, -86.1581, "Carmel"),
                  (39.8004, -86.0261, "Noblesville"),
                  (39.6684, -86.1261, "Franklin"),
                  (39.9004, -86.1901, "Zionsville"),
              ]
          },
          "san jose": {
              "high_crime": [
                  (37.3382, -121.8863, "Downtown San Jose"),
                  (37.3062, -121.9183, "West San Jose"),
                  (37.3702, -121.9183, "North San Jose"),
                  (37.3062, -121.8543, "East San Jose"),
              ],
              "medium_crime": [
                  (37.3702, -121.8543, "Milpitas"),
                  (37.3382, -121.7863, "Evergreen"),
                  (37.2742, -121.8863, "South San Jose"),
                  (37.3382, -121.9863, "Cupertino"),
              ],
              "low_crime": [
                  (37.4062, -121.8863, "Santa Clara"),
                  (37.3702, -121.7543, "Alum Rock"),
                  (37.2382, -121.8543, "Morgan Hill"),
                  (37.4382, -121.9183, "Sunnyvale"),
              ]
          },
          "seattle": {
              "high_crime": [
                  (47.6062, -122.3321, "Downtown Seattle"),
                  (47.5742, -122.3641, "South Seattle"),
                  (47.6382, -122.3641, "North Seattle"),
                  (47.5742, -122.3001, "East Seattle"),
              ],
              "medium_crime": [
                  (47.6382, -122.3001, "University District"),
                  (47.6062, -122.2321, "Bellevue"),
                  (47.5422, -122.3321, "Renton"),
                  (47.6062, -122.4321, "West Seattle"),
              ],
              "low_crime": [
                  (47.6742, -122.3321, "Shoreline"),
                  (47.6382, -122.2001, "Redmond"),
                  (47.5062, -122.3001, "Tukwila"),
                  (47.7062, -122.3641, "Lynnwood"),
              ]
          },
          "denver": {
              "high_crime": [
                  (39.7392, -104.9903, "Downtown Denver"),
                  (39.7072, -105.0223, "West Denver"),
                  (39.7712, -105.0223, "North Denver"),
                  (39.7072, -104.9583, "East Denver"),
              ],
              "medium_crime": [
                  (39.7712, -104.9583, "Commerce City"),
                  (39.7392, -104.8903, "Aurora"),
                  (39.6752, -104.9903, "Littleton"),
                  (39.7392, -105.0903, "Lakewood"),
              ],
              "low_crime": [
                  (39.8072, -104.9903, "Westminster"),
                  (39.7712, -104.8583, "Centennial"),
                  (39.6392, -104.9583, "Highlands Ranch"),
                  (39.8392, -105.0223, "Arvada"),
              ]
          },
          "oklahoma city": {
              "high_crime": [
                  (35.4676, -97.5164, "Downtown Oklahoma City"),
                  (35.4356, -97.5484, "Southwest OKC"),
                  (35.4996, -97.5484, "Northwest OKC"),
                  (35.4356, -97.4844, "Southeast OKC"),
              ],
              "medium_crime": [
                  (35.4996, -97.4844, "North OKC"),
                  (35.4676, -97.4164, "Midwest City"),
                  (35.4036, -97.5164, "Moore"),
                  (35.4676, -97.6164, "Yukon"),
              ],
              "low_crime": [
                  (35.5356, -97.5164, "Edmond"),
                  (35.4996, -97.3844, "Del City"),
                  (35.3676, -97.4844, "Norman"),
                  (35.5676, -97.5484, "Nichols Hills"),
              ]
          },
          "nashville": {
              "high_crime": [
                  (36.1627, -86.7816, "Downtown Nashville"),
                  (36.1307, -86.8136, "South Nashville"),
                  (36.1947, -86.8136, "North Nashville"),
                  (36.1307, -86.7496, "East Nashville"),
              ],
              "medium_crime": [
                  (36.1947, -86.7496, "Goodlettsville"),
                  (36.1627, -86.6816, "Hermitage"),
                  (36.0987, -86.7816, "Antioch"),
                  (36.1627, -86.8816, "Belle Meade"),
              ],
              "low_crime": [
                  (36.2307, -86.7816, "Hendersonville"),
                  (36.1947, -86.6496, "Mount Juliet"),
                  (36.0627, -86.7496, "Brentwood"),
                  (36.2627, -86.8136, "Madison"),
              ]
          },
          "jacksonville": {
              "high_crime": [
                  (30.3322, -81.6557, "Downtown Jacksonville"),
                  (30.3078, -81.6983, "Riverside"),
                  (30.3678, -81.7103, "Northwest Jacksonville"),
                  (30.2881, -81.6557, "San Marco"),
              ],
              "medium_crime": [
                  (30.3322, -81.5557, "Beaches"),
                  (30.4322, -81.6557, "North Jacksonville"),
                  (30.3678, -81.5557, "Arlington"),
                  (30.2881, -81.7103, "Westside"),
              ],
              "low_crime": [
                  (30.2881, -81.5557, "Southside"),
                  (30.4678, -81.6557, "Ponte Vedra"),
                  (30.3322, -81.4557, "Atlantic Beach"),
                  (30.4322, -81.5557, "Fernandina Beach"),
              ]
          },
          "fort worth": {
              "high_crime": [
                  (32.7555, -97.3308, "Downtown Fort Worth"),
                  (32.7235, -97.3628, "South Fort Worth"),
                  (32.7875, -97.3628, "East Fort Worth"),
                  (32.7235, -97.2988, "Southeast Fort Worth"),
              ],
              "medium_crime": [
                  (32.7875, -97.2988, "North Fort Worth"),
                  (32.7555, -97.2308, "Northeast Fort Worth"),
                  (32.6875, -97.3308, "Southwest Fort Worth"),
                  (32.7555, -97.4308, "West Fort Worth"),
              ],
              "low_crime": [
                  (32.8235, -97.3308, "Keller"),
                  (32.7875, -97.2000, "Colleyville"),
                  (32.6875, -97.2308, "Burleson"),
                  (32.8555, -97.2988, "Southlake"),
              ]
          },
          "columbus": {
              "high_crime": [
                  (39.9612, -82.9988, "Downtown Columbus"),
                  (39.9292, -83.0308, "South Columbus"),
                  (39.9932, -83.0308, "North Columbus"),
                  (39.9292, -82.9668, "East Columbus"),
              ],
              "medium_crime": [
                  (39.9932, -82.9668, "Worthington"),
                  (39.9612, -82.8988, "New Albany"),
                  (39.8932, -82.9988, "Grove City"),
                  (39.9612, -83.0988, "Hilliard"),
              ],
              "low_crime": [
                  (40.0292, -82.9988, "Delaware"),
                  (39.9932, -82.8668, "Pickerington"),
                  (39.8612, -82.9668, "Lancaster"),
                  (40.0612, -83.0308, "Dublin"),
              ]
          },
          "sacramento": {
              "high_crime": [
                  (38.5816, -121.4944, "Downtown Sacramento"),
                  (38.5496, -121.5264, "South Sacramento"),
                  (38.6136, -121.5264, "North Sacramento"),
                  (38.5496, -121.4624, "East Sacramento"),
              ],
              "medium_crime": [
                  (38.6136, -121.4624, "Natomas"),
                  (38.5816, -121.3944, "Rancho Cordova"),
                  (38.5136, -121.4944, "Elk Grove"),
                  (38.5816, -121.5944, "West Sacramento"),
              ],
              "low_crime": [
                  (38.6496, -121.4944, "Roseville"),
                  (38.6136, -121.3624, "Folsom"),
                  (38.4816, -121.4624, "Galt"),
                  (38.7136, -121.4944, "Lincoln"),
              ]
          },
          "el paso": {
              "high_crime": [
                  (31.7619, -106.4850, "Downtown El Paso"),
                  (31.7299, -106.5170, "West El Paso"),
                  (31.7939, -106.5170, "Northeast El Paso"),
                  (31.7299, -106.4530, "East El Paso"),
              ],
              "medium_crime": [
                  (31.7939, -106.4530, "Far East El Paso"),
                  (31.7619, -106.3850, "Horizon City"),
                  (31.6979, -106.4850, "South El Paso"),
                  (31.7619, -106.5850, "West Side"),
              ],
              "low_crime": [
                  (31.8299, -106.4850, "North El Paso"),
                  (31.7939, -106.3530, "Socorro"),
                  (31.6619, -106.4530, "Mission Valley"),
                  (31.8619, -106.5170, "Canutillo"),
              ]
          }
    }
    
    return city_crime_data.get(city_name)

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
    """Generate crime heat tiles for any city"""
    
    # Get bounding box for this tile
    bbox = tile_to_bbox(z, x, y)
    
    # Get city-specific crime data
    city_data = get_city_crime_data(city.lower())
    
    if not city_data:
        # Return empty tile for unsupported cities
        from PIL import Image
        img = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        return Response(content=buffer.getvalue(), media_type="image/png")
    
    high_crime_centers = city_data["high_crime"]
    medium_crime_centers = city_data["medium_crime"] 
    low_crime_centers = city_data["low_crime"]
    
    # Generate clusters around each center for realistic choropleth
    import random
    city_crime_data = []
    
    # High crime clusters (intense red)
    for lat, lng, name in high_crime_centers:
        for _ in range(25):  # Dense clusters
            offset_lat = random.uniform(-0.005, 0.005)  # ~500m variation
            offset_lng = random.uniform(-0.005, 0.005)
            intensity = random.uniform(0.7, 1.0)  # High intensity
            city_crime_data.append((lat + offset_lat, lng + offset_lng, intensity))
    
    # Medium crime clusters (medium red)
    for lat, lng, name in medium_crime_centers:
        for _ in range(15):  # Medium density
            offset_lat = random.uniform(-0.008, 0.008)  # ~800m variation
            offset_lng = random.uniform(-0.008, 0.008)
            intensity = random.uniform(0.4, 0.7)  # Medium intensity
            city_crime_data.append((lat + offset_lat, lng + offset_lng, intensity))
    
    # Low crime clusters (light red)
    for lat, lng, name in low_crime_centers:
        for _ in range(8):  # Low density
            offset_lat = random.uniform(-0.012, 0.012)  # ~1.2km variation
            offset_lng = random.uniform(-0.012, 0.012)
            intensity = random.uniform(0.1, 0.4)  # Low intensity
            city_crime_data.append((lat + offset_lat, lng + offset_lng, intensity))
    
    # Create the crime heatmap tile
    tile_data = create_crime_heatmap_tile(city_crime_data, bbox, z)
    
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
