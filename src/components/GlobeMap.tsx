import { useEffect, useRef } from 'react'
import {
  Map as MapLibreMap,
  NavigationControl,
  Popup,
  type GeoJSONSource,
  type MapGeoJSONFeature,
  type MapLayerMouseEvent,
  type MapMouseEvent,
} from 'maplibre-gl'
import type { GeoEvent } from '@/types/geopolitics'
import { categoryColor, categoryColorMatch, categoryLabel } from '@/lib/categories'
import { formatRelative } from '@/lib/utils'
import { useUiStore } from '@/store/ui'

interface GlobeMapProps {
  events: GeoEvent[]
  onSelectCountry?: (isoHint: string | null) => void
}

const SOURCE_ID = 'geopulse-events'
const GLOW_LAYER_ID = 'event-glow'
const CORE_LAYER_ID = 'event-core'

function formatSigned(value: number | null | undefined, digits = 2): string {
  if (value == null || Number.isNaN(value)) return '—'
  const fixed = value.toFixed(digits)
  return value > 0 ? `+${fixed}` : fixed
}

function buildPopupContent(event: GeoEvent): HTMLElement {
  const root = document.createElement('div')
  root.className = 'geopulse-popup'

  const header = document.createElement('div')
  header.className = 'geopulse-popup__header'

  const badge = document.createElement('span')
  badge.className = 'geopulse-popup__badge'
  const color = categoryColor(event.category)
  badge.style.color = color
  badge.style.borderColor = color
  badge.style.background = `color-mix(in srgb, ${color} 18%, transparent)`
  badge.textContent = categoryLabel(event.category)
  header.appendChild(badge)

  const when = document.createElement('span')
  when.className = 'geopulse-popup__when'
  when.textContent = formatRelative(event.occurred_at)
  header.appendChild(when)
  root.appendChild(header)

  const title = document.createElement('h3')
  title.className = 'geopulse-popup__title'
  title.textContent = event.title
  root.appendChild(title)

  const rows: Array<[string, string]> = [
    ['Location', event.location_name ?? '—'],
    [
      'Country',
      event.country_name
        ? `${event.country_name}${event.country_iso2 ? ` (${event.country_iso2})` : ''}`
        : '—',
    ],
    ['Actors', event.actors?.length ? event.actors.join(' · ') : '—'],
    ['CAMEO type', event.event_type ?? '—'],
    ['Sentiment', formatSigned(event.sentiment, 3)],
    ['Goldstein', formatSigned(event.goldstein_scale, 1)],
    ['Source', event.source],
    ['Occurred', new Date(event.occurred_at).toUTCString()],
  ]
  if (event.summary) {
    rows.splice(1, 0, ['Summary', event.summary])
  }

  const dl = document.createElement('dl')
  dl.className = 'geopulse-popup__details'
  for (const [label, value] of rows) {
    const dt = document.createElement('dt')
    dt.textContent = label
    const dd = document.createElement('dd')
    dd.textContent = value
    dl.appendChild(dt)
    dl.appendChild(dd)
  }
  root.appendChild(dl)

  if (event.source_url) {
    const link = document.createElement('a')
    link.className = 'geopulse-popup__link'
    link.href = event.source_url
    link.target = '_blank'
    link.rel = 'noreferrer'
    link.textContent = 'Open source article'
    root.appendChild(link)
  }

  return root
}

function toFeatureCollection(events: GeoEvent[]) {
  return {
    type: 'FeatureCollection' as const,
    features: events
      .filter((event) => event.longitude != null && event.latitude != null)
      .map((event) => ({
        type: 'Feature' as const,
        properties: {
          id: event.id,
          title: event.title,
          category: event.category,
          country_iso2: event.country_iso2 ?? '',
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [event.longitude as number, event.latitude as number],
        },
      })),
  }
}

export function GlobeMap({ events, onSelectCountry }: GlobeMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const popupRef = useRef<Popup | null>(null)
  const eventsByIdRef = useRef(new Map<number, GeoEvent>())
  const onSelectCountryRef = useRef(onSelectCountry)
  const activeCategories = useUiStore((s) => s.activeCategories)

  onSelectCountryRef.current = onSelectCountry

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new MapLibreMap({
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
      center: [10, 20],
      zoom: 1.35,
      attributionControl: false,
    })

    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right')
    mapRef.current = map
    popupRef.current = new Popup({
      closeButton: true,
      closeOnClick: false,
      // Keep the card close to the marker so the pointer can reach it.
      offset: 12,
      maxWidth: '320px',
      className: 'geopulse-popup-anchor',
      focusAfterOpen: false,
    })

    const resize = () => map.resize()
    map.on('load', resize)

    const observer = new ResizeObserver(resize)
    observer.observe(containerRef.current)

    let hideTimer: number | null = null
    let activeEventId: number | null = null
    let popupListeners: AbortController | null = null

    const clearHideTimer = () => {
      if (hideTimer != null) {
        window.clearTimeout(hideTimer)
        hideTimer = null
      }
    }

    const isPointerOverPopup = () => {
      const element = popupRef.current?.getElement()
      return Boolean(element?.matches(':hover'))
    }

    const hidePopup = () => {
      clearHideTimer()
      activeEventId = null
      popupListeners?.abort()
      popupListeners = null
      popupRef.current?.remove()
    }

    const scheduleHide = () => {
      clearHideTimer()
      hideTimer = window.setTimeout(() => {
        if (isPointerOverPopup()) return
        hidePopup()
      }, 400)
    }

    const bindPopupPointer = () => {
      const element = popupRef.current?.getElement()
      if (!element) return
      popupListeners?.abort()
      popupListeners = new AbortController()
      const { signal } = popupListeners
      element.addEventListener(
        'mouseenter',
        () => {
          clearHideTimer()
        },
        { signal },
      )
      element.addEventListener(
        'mouseleave',
        () => {
          scheduleHide()
        },
        { signal },
      )
    }

    const openPopup = (feature: MapGeoJSONFeature) => {
      if (!popupRef.current || feature.geometry?.type !== 'Point') return
      const id = Number(feature.properties?.id)
      const event = eventsByIdRef.current.get(id)
      if (!event) return

      const [lng, lat] = feature.geometry.coordinates
      clearHideTimer()

      if (activeEventId !== id || !popupRef.current.isOpen()) {
        activeEventId = id
        popupRef.current
          .setLngLat([lng, lat])
          .setDOMContent(buildPopupContent(event))
          .addTo(map)
        bindPopupPointer()
        return
      }

      // Same event already open — leave DOM alone so the link stays interactive.
      popupRef.current.setLngLat([lng, lat])
    }

    const onEnter = (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer'
      const feature = e.features?.[0]
      if (feature) openPopup(feature)
    }
    const onLeave = () => {
      map.getCanvas().style.cursor = ''
      scheduleHide()
    }
    const onClick = (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      if (feature) openPopup(feature)
      const iso = (feature?.properties?.country_iso2 as string | undefined) || undefined
      if (iso) {
        onSelectCountryRef.current?.(iso)
        return
      }
      const id = Number(feature?.properties?.id)
      const event = eventsByIdRef.current.get(id)
      onSelectCountryRef.current?.(event?.country_iso2 ?? null)
    }

    const onMapClick = (e: MapMouseEvent) => {
      const hits = map.queryRenderedFeatures(e.point, { layers: [CORE_LAYER_ID] })
      if (hits.length === 0 && !isPointerOverPopup()) hidePopup()
    }

    map.on('mouseenter', CORE_LAYER_ID, onEnter)
    map.on('mouseleave', CORE_LAYER_ID, onLeave)
    map.on('click', CORE_LAYER_ID, onClick)
    map.on('click', onMapClick)

    return () => {
      clearHideTimer()
      popupListeners?.abort()
      observer.disconnect()
      popupRef.current?.remove()
      popupRef.current = null
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
    eventsByIdRef.current = new Map(filtered.map((event) => [event.id, event]))
    const data = toFeatureCollection(filtered)
    const colorExpr = categoryColorMatch()

    const ensureLayers = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, { type: 'geojson', data })
      } else {
        ;(map.getSource(SOURCE_ID) as GeoJSONSource).setData(data)
      }

      if (!map.getLayer(GLOW_LAYER_ID)) {
        map.addLayer({
          id: GLOW_LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 2, 16, 5, 28],
            'circle-color': colorExpr,
            'circle-opacity': 0.35,
            'circle-blur': 0.55,
          },
        })
      } else {
        map.setPaintProperty(GLOW_LAYER_ID, 'circle-color', colorExpr)
      }

      if (!map.getLayer(CORE_LAYER_ID)) {
        map.addLayer({
          id: CORE_LAYER_ID,
          type: 'circle',
          source: SOURCE_ID,
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 4, 2, 7, 5, 12],
            'circle-color': colorExpr,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#070b12',
            'circle-opacity': 0.95,
          },
        })
      } else {
        map.setPaintProperty(CORE_LAYER_ID, 'circle-color', colorExpr)
      }

      map.resize()
    }

    const sync = () => {
      if (!map.isStyleLoaded()) return false
      ensureLayers()
      return true
    }

    if (sync()) {
      return
    }

    const onReady = () => {
      sync()
    }
    map.on('load', onReady)

    // If `load` already fired before we subscribed, retry briefly.
    const retryId = window.setInterval(() => {
      if (sync()) window.clearInterval(retryId)
    }, 100)
    const retryTimeout = window.setTimeout(() => window.clearInterval(retryId), 5000)

    return () => {
      map.off('load', onReady)
      window.clearInterval(retryId)
      window.clearTimeout(retryTimeout)
    }
  }, [events, activeCategories])

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />
}
