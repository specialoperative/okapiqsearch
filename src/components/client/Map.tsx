"use client"
import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string

export default function Map({ data }: { data: any }) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-96.8, 32.77],
      zoom: 4,
    })
    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || !data) return
    // Add data layers to map
    console.log("[v0] Map data received:", data)
  }, [data])

  return <div ref={containerRef} className="w-full h-full" />
}
