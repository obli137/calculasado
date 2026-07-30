'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from '@react-google-maps/api'
import {
  DEFAULT_CENTER,
  MAP_CONTAINER_STYLE,
  MAP_OPTIONS,
  MAPS_LIBRARIES,
  MIN_MOVE_METERS,
  SEARCH_RADIUS_METERS,
  distanceMeters,
} from '@/lib/maps'

export type Carniceria = {
  placeId: string
  name: string
  position: google.maps.LatLngLiteral
  vicinity?: string
  rating?: number
}

type DetailExtras = {
  address?: string
  phone?: string
  mapsUrl?: string
  openNow?: boolean
}

function MapSkeleton({ message }: { message: string }) {
  return (
    <div className="flex h-[60vh] items-center justify-center rounded-lg bg-gray-100 text-gray-600">
      <p>{message}</p>
    </div>
  )
}

export default function CarniceriasMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: MAPS_LIBRARIES,
  })

  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(14)
  const [carnicerias, setCarnicerias] = useState<Carniceria[]>([])
  const [selected, setSelected] = useState<Carniceria | null>(null)
  const [details, setDetails] = useState<DetailExtras | null>(null)
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [geoStatus, setGeoStatus] = useState<'pending' | 'ok' | 'denied'>('pending')
  const [statusMsg, setStatusMsg] = useState('Buscando carnicerías...')

  const mapRef = useRef<google.maps.Map | null>(null)
  const lastSearchCenter = useRef<google.maps.LatLngLiteral | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const placesRef = useRef<google.maps.places.PlacesService | null>(null)

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    placesRef.current = new google.maps.places.PlacesService(map)
  }, [])

  const searchCarnicerias = useCallback((location: google.maps.LatLngLiteral) => {
    const service = placesRef.current
    if (!service) return

    if (
      lastSearchCenter.current &&
      distanceMeters(lastSearchCenter.current, location) < MIN_MOVE_METERS
    ) {
      return
    }

    lastSearchCenter.current = location
    setLoadingSearch(true)
    setStatusMsg('Buscando carnicerías...')

    service.nearbySearch(
      {
        location,
        radius: SEARCH_RADIUS_METERS,
        keyword: 'carnicería',
        type: 'store',
      },
      (results, status) => {
        setLoadingSearch(false)

        if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.length) {
          setCarnicerias([])
          setSelected(null)
          setStatusMsg('No encontramos carnicerías cerca. Probá otra zona.')
          return
        }

        const mapped: Carniceria[] = results
          .filter((p) => p.geometry?.location && p.place_id)
          .map((p) => ({
            placeId: p.place_id!,
            name: p.name || 'Carnicería',
            position: {
              lat: p.geometry!.location!.lat(),
              lng: p.geometry!.location!.lng(),
            },
            vicinity: p.vicinity,
            rating: p.rating,
          }))

        setCarnicerias(mapped)
        setStatusMsg(`${mapped.length} carnicería${mapped.length === 1 ? '' : 's'} en la zona`)
      }
    )
  }, [])

  const scheduleSearch = useCallback(
    (location: google.maps.LatLngLiteral) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => searchCarnicerias(location), 450)
    },
    [searchCarnicerias]
  )

  useEffect(() => {
    if (!isLoaded) return

    if (!navigator.geolocation) {
      setGeoStatus('denied')
      scheduleSearch(DEFAULT_CENTER)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCenter(next)
        setGeoStatus('ok')
        mapRef.current?.panTo(next)
        scheduleSearch(next)
      },
      () => {
        setGeoStatus('denied')
        scheduleSearch(DEFAULT_CENTER)
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    )

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [isLoaded, scheduleSearch])

  const onIdle = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const c = map.getCenter()
    if (!c) return
    const next = { lat: c.lat(), lng: c.lng() }
    setCenter(next)
    scheduleSearch(next)
  }, [scheduleSearch])

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace()
    const loc = place?.geometry?.location
    if (!loc || !mapRef.current) return

    const next = { lat: loc.lat(), lng: loc.lng() }
    lastSearchCenter.current = null
    setCenter(next)
    setZoom(15)
    mapRef.current.panTo(next)
    mapRef.current.setZoom(15)
    searchCarnicerias(next)
  }, [searchCarnicerias])

  const goToMyLocation = useCallback(() => {
    if (!navigator.geolocation || !mapRef.current) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        lastSearchCenter.current = null
        setCenter(next)
        setGeoStatus('ok')
        mapRef.current?.panTo(next)
        mapRef.current?.setZoom(15)
        searchCarnicerias(next)
      },
      () => setGeoStatus('denied')
    )
  }, [searchCarnicerias])

  const openMarker = useCallback((item: Carniceria) => {
    setSelected(item)
    setDetails(null)

    const service = placesRef.current
    if (!service) return

    service.getDetails(
      {
        placeId: item.placeId,
        fields: ['formatted_address', 'formatted_phone_number', 'url', 'opening_hours'],
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return
        setDetails({
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          mapsUrl: place.url,
          openNow: place.opening_hours?.isOpen?.(),
        })
      }
    )
  }, [])

  const markers = useMemo(
    () =>
      carnicerias.map((c) => (
        <Marker
          key={c.placeId}
          position={c.position}
          title={c.name}
          onClick={() => openMarker(c)}
        />
      )),
    [carnicerias, openMarker]
  )

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <p className="font-semibold">Falta configurar Google Maps</p>
        <p className="mt-2 text-sm">
          Agregá <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> en
          tu <code className="rounded bg-amber-100 px-1">.env.local</code> y en Vercel, con Maps
          JavaScript API y Places API habilitadas.
        </p>
      </div>
    )
  }

  if (loadError) {
    return <MapSkeleton message="No se pudo cargar Google Maps. Revisá la API key." />
  }

  if (!isLoaded) {
    return <MapSkeleton message="Cargando mapa..." />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Autocomplete
            onLoad={(ac) => {
              autocompleteRef.current = ac
            }}
            onPlaceChanged={onPlaceChanged}
            options={{
              componentRestrictions: { country: 'ar' },
              fields: ['geometry', 'name', 'formatted_address'],
            }}
          >
            <input
              type="text"
              placeholder="Buscar otra dirección o barrio..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-800 shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </Autocomplete>
        </div>
        <button
          type="button"
          onClick={goToMyLocation}
          className="shrink-0 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
        >
          Mi ubicación
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 text-sm text-gray-600">
        <p>
          {loadingSearch ? 'Buscando...' : statusMsg}
          {geoStatus === 'denied' && (
            <span className="ml-1 text-gray-400">
              (ubicación no disponible — arrastrá el mapa o buscá una dirección)
            </span>
          )}
        </p>
        <p className="hidden text-xs text-gray-400 sm:block">
          Arrastrá el mapa para cambiar de zona
        </p>
      </div>

      <div className="h-[60vh] overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={center}
          zoom={zoom}
          options={MAP_OPTIONS}
          onLoad={onMapLoad}
          onIdle={onIdle}
        >
          <Marker
            position={center}
            title="Centro de búsqueda"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#dc2626',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
          {markers}
          {selected && (
            <InfoWindow
              position={selected.position}
              onCloseClick={() => {
                setSelected(null)
                setDetails(null)
              }}
            >
              <div className="max-w-[220px] space-y-1 p-1 text-sm text-gray-800">
                <p className="font-semibold">{selected.name}</p>
                {selected.rating != null && (
                  <p>⭐ {selected.rating.toFixed(1)}</p>
                )}
                {details?.openNow != null && (
                  <p className={details.openNow ? 'text-green-700' : 'text-red-600'}>
                    {details.openNow ? 'Abierto ahora' : 'Cerrado ahora'}
                  </p>
                )}
                <p className="text-gray-600">
                  {details?.address || selected.vicinity || 'Cargando dirección...'}
                </p>
                {details?.phone && <p>{details.phone}</p>}
                {details?.mapsUrl && (
                  <a
                    href={details.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-red-600 underline"
                  >
                    Ver en Google Maps
                  </a>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {carnicerias.length > 0 && (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {carnicerias.slice(0, 8).map((c) => (
            <li key={c.placeId}>
              <button
                type="button"
                onClick={() => {
                  mapRef.current?.panTo(c.position)
                  openMarker(c)
                }}
                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-red-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.vicinity}</p>
                </div>
                {c.rating != null && (
                  <span className="shrink-0 text-sm text-gray-600">⭐ {c.rating.toFixed(1)}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
