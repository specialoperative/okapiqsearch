"use client";

import React, { useEffect, useMemo, useRef } from "react";

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
  showHeat?: boolean;
  zoom?: number;
  fitToBusinesses?: boolean;
  markerItems?: MapBusiness[];
  crimeCity?: string;
  crimeDaysBack?: number;
};

const loadGoogleMaps = async (apiKey: string): Promise<any> => {
  if (typeof window !== "undefined" && (window as any).google?.maps) {
    return (window as any).google;
  }
  await new Promise<void>((resolve, reject) => {
    const id = "gmaps-script";
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("gmaps load error")));
      return;
    }
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=quarterly&libraries=places`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("gmaps load error"));
    document.head.appendChild(s);
  });
  return (window as any).google;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  businesses = [
    { id: 1, name: "Golden Gate HVAC", position: [37.7749, -122.4194], tam: "$12M TAM", score: 92 },
    { id: 2, name: "Bay Area Plumbing Co", position: [37.7849, -122.4094], tam: "$8M TAM", score: 88 },
    { id: 3, name: "SF Electrical Services", position: [37.7649, -122.4294], tam: "$15M TAM", score: 85 }
  ],
  center = [37.7749, -122.4194],
  heightClassName = "h-96",
  onBusinessClick,
  showHeat = false,
  zoom = 13,
  fitToBusinesses = true,
  markerItems,
  crimeCity,
  crimeDaysBack = 180
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const overlayRef = useRef<any | null>(null);

  const computedCenter = useMemo<[number, number]>(() => {
    if (center && Array.isArray(center) && typeof center[0] === "number" && typeof center[1] === "number") {
      return center;
    }
    if (businesses && businesses.length > 0) {
      return businesses[0].position;
    }
    return [37.7749, -122.4194];
  }, [center, businesses]);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    const apiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string) || "AIzaSyBsiXduDa2PIqnkMnaqUnvuBBGroPy2dnM";
    loadGoogleMaps(apiKey)
      .then((g) => {
        if (cancelled || !containerRef.current) return;
        const map = new g.maps.Map(containerRef.current, {
          center: { lat: computedCenter[0], lng: computedCenter[1] },
          zoom,
          mapTypeId: g.maps.MapTypeId.ROADMAP,
          clickableIcons: false,
          streetViewControl: false,
          fullscreenControl: false
        });
        mapRef.current = map;

        // Add markers
        const items = (markerItems && markerItems.length > 0 ? markerItems : businesses) || [];
        const bounds = new g.maps.LatLngBounds();
        for (const b of items) {
          const m = new g.maps.Marker({ position: { lat: b.position[0], lng: b.position[1] }, title: b.name, map });
          if (onBusinessClick) m.addListener("click", () => onBusinessClick(b));
          markersRef.current.push(m);
          bounds.extend(m.getPosition());
        }
        if (fitToBusinesses && items.length > 0) {
          map.fitBounds(bounds, 40 as any);
        }

        // Crime overlay
        if (showHeat) {
          const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
          
          const overlay = new g.maps.ImageMapType({
            name: "Crime Heat",
            tileSize: new g.maps.Size(256, 256),
            opacity: 0.95,
            maxZoom: 20,
            minZoom: 1,
            getTileUrl: (coord: any, z: number) => {
              const numTiles = 1 << z;
              const x = ((coord.x % numTiles) + numTiles) % numTiles;
              const y = coord.y;
              const url = `${apiBase}/analytics/crime-tiles/${z}/${x}/${y}?provider=crimeometer&city=${encodeURIComponent("San Francisco")}&days_back=${crimeDaysBack}&_cache=${Date.now()}`;
              return url;
            }
          });
          
          map.overlayMapTypes.insertAt(0, overlay);
          overlayRef.current = overlay;
        }
      })
      .catch((e) => console.error("Google Maps load failed", e));
    return () => {
      cancelled = true;
      try {
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        if (mapRef.current && overlayRef.current) {
          const overlays = mapRef.current.overlayMapTypes;
          for (let i = overlays.getLength() - 1; i >= 0; i--) {
            const o = overlays.getAt(i);
            if (o === overlayRef.current) overlays.removeAt(i);
          }
        }
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update on changes
  useEffect(() => {
    const g = (window as any).google;
    const map = mapRef.current;
    if (!g || !map) return;

    map.setCenter({ lat: computedCenter[0], lng: computedCenter[1] });
    map.setZoom(zoom);

    // Refresh markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    const items = (markerItems && markerItems.length > 0 ? markerItems : businesses) || [];
    const bounds = new g.maps.LatLngBounds();
    for (const b of items) {
      const m = new g.maps.Marker({ position: { lat: b.position[0], lng: b.position[1] }, title: b.name, map });
      if (onBusinessClick) m.addListener("click", () => onBusinessClick(b));
      markersRef.current.push(m);
      bounds.extend(m.getPosition());
    }
    if (fitToBusinesses && items.length > 0) {
      map.fitBounds(bounds, 40 as any);
    }

    // Refresh crime overlay
    try {
      if (overlayRef.current) {
        const overlays = map.overlayMapTypes;
        for (let i = overlays.getLength() - 1; i >= 0; i--) {
          const o = overlays.getAt(i);
          if (o === overlayRef.current) overlays.removeAt(i);
        }
        overlayRef.current = null;
      }
      if (showHeat) {
        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
        
        const overlay = new g.maps.ImageMapType({
          name: "Crime Heat",
          tileSize: new g.maps.Size(256, 256),
          opacity: 0.95,
          maxZoom: 20,
          minZoom: 1,
          getTileUrl: (coord: any, z: number) => {
            const numTiles = 1 << z;
            const x = ((coord.x % numTiles) + numTiles) % numTiles;
            const y = coord.y;
            const url = `${apiBase}/analytics/crime-tiles/${z}/${x}/${y}?provider=crimeometer&city=${encodeURIComponent("San Francisco")}&days_back=${crimeDaysBack}&_cache=${Date.now()}`;
            return url;
          }
        });
        
        map.overlayMapTypes.insertAt(0, overlay);
        overlayRef.current = overlay;
      }
    } catch {}
  }, [JSON.stringify(markerItems), JSON.stringify(businesses), fitToBusinesses, computedCenter[0], computedCenter[1], zoom, showHeat, crimeCity, crimeDaysBack, onBusinessClick]);

  return (
    <div className={`w-full ${heightClassName} border border-gray-200 rounded-lg overflow-hidden`}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
      <div className="text-xs text-gray-500 p-2 bg-white">Map data © Google | Crime data © Crimeometer</div>
    </div>
  );
};

export default InteractiveMap;


