import { useEffect, useRef } from 'react'
import {
  Map,
  NavigationControl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
} from 'maplibre-gl'
import type { GeoEvent } from '@/types/geopolitics'
import { useUiStore } from '@/store/ui'

interface GlobeMapProps {
  events: GeoEvent[]
  onSelectCountry?: (isoHint: string | null) => void
}

export function GlobeMap({ events, onSelectCountry }: GlobeMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const activeCategories = useUiStore((s) => s.activeCategories)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            paint: {
              'raster-saturation': -0.85,
              'raster-contrast': 0.1,
              'raster-brightness-min': 0.05,
              'raster-brightness-max': 0.55,
            },
          },
        ],
      },
      center: [20, 25],
      zoom: 1.4,
      attributionControl: false,
    })

    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right')
    map.on('load', () => {
      map.resize()
    })
    mapRef.current = map

    const observer = new ResizeObserver(() => {
      map.resize()
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const filtered = events.filter((event) =>
      activeCategories.includes(event.category as (typeof activeCategories)[number]),
    )

    const features = filtered
      .filter((event) => event.longitude != null && event.latitude != null)
      .map((event) => ({
        type: 'Feature' as const,
        properties: {
          id: event.id,
          title: event.title,
          category: event.category,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [event.longitude as number, event.latitude as number],
        },
      }))

    const sourceId = 'geopulse-events'
    const data = {
      type: 'FeatureCollection' as const,
      features,
    }

    const apply = () => {
      if (map.getSource(sourceId)) {
        ;(map.getSource(sourceId) as GeoJSONSource).setData(data)
        return
      }
      map.addSource(sourceId, { type: 'geojson', data })
      map.addLayer({
        id: 'event-glow',
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1,
            14,
            4,
            22,
          ],
          'circle-color': '#3dd6c6',
          'circle-opacity': 0.28,
          'circle-blur': 0.65,
        },
      })
      map.addLayer({
        id: 'event-core',
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1,
            5,
            4,
            8,
          ],
          'circle-color': '#f0a35a',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#070b12',
          'circle-opacity': 0.95,
        },
      })
      map.on('click', 'event-core', (e: MapLayerMouseEvent) => {
        const feature = e.features?.[0]
        const title = feature?.properties?.title as string | undefined
        onSelectCountry?.(title?.split('—')[0]?.trim() ?? null)
      })
    }

    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [events, activeCategories, onSelectCountry])

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />
}
