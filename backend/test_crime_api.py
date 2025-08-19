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
                    # Large radius for visibility
                    radius = max(40, min(120, int(80 * (15 / max(z, 1)))))
                    
                    # Add heat at this location
                    for dy in range(-radius, radius + 1):
                        for dx in range(-radius, radius + 1):
                            heat_px = px + dx
                            heat_py = py + dy
                            
                            if 0 <= heat_px < tile_size and 0 <= heat_py < tile_size:
                                distance = math.sqrt(dx*dx + dy*dy)
                                if distance <= radius:
                                    # Gaussian heat distribution
                                    sigma = radius / 3.0
                                    heat_value = intensity * math.exp(-(distance**2) / (2 * sigma**2)) * 100.0
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
async def get_crime_tiles(z: int, x: int, y: int):
    """Generate crime heat tiles for San Francisco"""
    
    # Get bounding box for this tile
    bbox = tile_to_bbox(z, x, y)
    
    # Dense San Francisco crime data with realistic locations
    sf_crime_data = [
        # Tenderloin (high crime)
        (37.7849, -122.4094, 1.0),
        (37.7839, -122.4104, 0.9),
        (37.7859, -122.4084, 0.95),
        (37.7829, -122.4114, 0.85),
        (37.7869, -122.4074, 0.9),
        
        # SOMA (high crime)
        (37.7753, -122.4180, 0.85),
        (37.7743, -122.4190, 0.8),
        (37.7763, -122.4170, 0.9),
        (37.7733, -122.4200, 0.75),
        (37.7773, -122.4160, 0.85),
        
        # Mission District (medium-high crime)
        (37.7599, -122.4148, 0.8),
        (37.7589, -122.4158, 0.75),
        (37.7609, -122.4138, 0.8),
        (37.7579, -122.4168, 0.7),
        (37.7619, -122.4128, 0.75),
        
        # Castro (medium crime)
        (37.7609, -122.4348, 0.6),
        (37.7599, -122.4358, 0.55),
        (37.7619, -122.4338, 0.65),
        
        # Haight (medium crime)
        (37.7693, -122.4463, 0.65),
        (37.7683, -122.4473, 0.6),
        (37.7703, -122.4453, 0.7),
        
        # Financial District (medium crime)
        (37.7949, -122.4031, 0.55),
        (37.7939, -122.4041, 0.5),
        (37.7959, -122.4021, 0.6),
        
        # Union Square area (medium-high crime)
        (37.7879, -122.4075, 0.75),
        (37.7869, -122.4085, 0.7),
        (37.7889, -122.4065, 0.8),
        
        # Chinatown (low-medium crime)
        (37.7941, -122.4078, 0.4),
        (37.7931, -122.4088, 0.35),
        (37.7951, -122.4068, 0.45),
        
        # Additional scattered points for density
        (37.7749, -122.4194, 0.8),  # Central SF
        (37.7849, -122.4294, 0.6),  # Western SF
        (37.7649, -122.4094, 0.7),  # Southern SF
        (37.7949, -122.4194, 0.5),  # Northern SF
    ]
    
    # Create the crime heatmap tile
    tile_data = create_crime_heatmap_tile(sf_crime_data, bbox, z)
    
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
