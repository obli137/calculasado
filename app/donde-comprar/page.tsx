'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from "@nextui-org/react";

const mapContainerStyle = {
  width: '100%',
  height: '70vh',
  borderRadius: '8px'
};

const defaultCenter = {
  lat: -34.603722,
  lng: -58.381592
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

interface Place {
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  name: string;
  vicinity?: string;
}

interface MarkerType {
  setMap: (map: google.maps.Map | null) => void;
  getTitle: () => string | undefined;
}

export default function DondeComprar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [locationIcon, setLocationIcon] = useState<any>(null);
  const [butcherIcon, setButcherIcon] = useState<any>(null);

  useEffect(() => {
    if (window.google) {
      setLocationIcon({
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(50, 50),
        zIndex: 1000
      });

      setButcherIcon({
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="#dc2626">
            <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"/>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(35, 35),
        anchor: new google.maps.Point(17.5, 35),
        zIndex: 1
      });
    }
  }, [map]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    if (inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'ar' },
        fields: ['geometry', 'name', 'formatted_address'],
        types: ['address', 'establishment']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setCenter(newCenter);
          setSelectedPlace(place as Place);
          setSearchQuery(place.formatted_address || '');
          searchNearbyButchers(newCenter);
        }
      });
    }
  }, []);

  const searchNearbyButchers = useCallback((location: { lat: number; lng: number }) => {
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 1500, // 1.5km
      keyword: 'carniceria',
      type: 'store'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyPlaces(results as Place[]);
      }
    });
  }, [map]);

  const handleUpdateLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(newCenter);
          searchNearbyButchers(newCenter);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [searchNearbyButchers]);

  const handleLoadError = (error: Error) => {
    console.error('Error loading Google Maps:', error);
    setLoadError('Error al cargar Google Maps. Por favor, intenta más tarde.');
  };

  const handleLoadSuccess = () => {
    console.log('Google Maps loaded successfully');
    setLoadError(null);
  };

  const createMarker = useCallback((position: google.maps.LatLngLiteral, title?: string) => {
    if (!map) return null;

    const marker = new google.maps.Marker({
      map,
      position,
      title,
    });

    setMarkers(prev => [...prev, marker]);
    return marker;
  }, [map]);

  useEffect(() => {
    if (!map || !selectedPlace) return;

    // Limpiar marcadores anteriores
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // Crear marcador para la ubicación seleccionada
    if (selectedPlace.geometry) {
      const position = {
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng()
      };
      createMarker(position, 'Ubicación seleccionada');
    }
  }, [map, selectedPlace, createMarker]);

  useEffect(() => {
    if (!map) return;

    // Limpiar marcadores de carnicerías anteriores
    markers.forEach(marker => {
      if (marker.getTitle() !== 'Ubicación seleccionada') {
        marker.setMap(null);
      }
    });
    setMarkers(prev => prev.filter(marker => marker.getTitle() === 'Ubicación seleccionada'));

    // Crear marcadores para las carnicerías cercanas
    nearbyPlaces.forEach(place => {
      const position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      createMarker(position, place.name);
    });
  }, [map, nearbyPlaces, createMarker]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    const geocoder = new google.maps.Geocoder();
    
    try {
      const result = await geocoder.geocode({
        address: searchQuery,
        componentRestrictions: { country: 'AR' }
      });

      if (result.results[0]) {
        const location = result.results[0].geometry.location;
        const newCenter = {
          lat: location.lat(),
          lng: location.lng()
        };
        setCenter(newCenter);
        setSelectedPlace({
          geometry: {
            location: {
              lat: () => location.lat(),
              lng: () => location.lng()
            }
          },
          name: result.results[0].formatted_address
        });
        searchNearbyButchers(newCenter);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      setLoadError('No se pudo encontrar la dirección especificada');
    }
  }, [searchQuery, searchNearbyButchers]);

  if (loadError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{loadError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Encuentra Carnicerías Cercanas</h1>
      
      <LoadScript 
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={libraries}
        onLoad={handleLoadSuccess}
        onError={handleLoadError}
        loadingElement={
          <div className="w-full h-[70vh] flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-gray-600">Cargando mapa...</div>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                color="primary"
                variant="solid"
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="solid"
              onClick={handleUpdateLocation}
            >
              Ver Carnicerías
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-4">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={14}
            center={center}
            onLoad={onMapLoad}
          >
            {nearbyPlaces.map((place, index) => (
              <Marker
                key={index}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }}
                icon={butcherIcon}
                title={place.name}
                zIndex={1}
              />
            ))}
            {selectedPlace && locationIcon && (
              <Marker
                position={{
                  lat: selectedPlace.geometry.location.lat(),
                  lng: selectedPlace.geometry.location.lng()
                }}
                icon={locationIcon}
                title="Ubicación seleccionada"
                zIndex={1000}
              />
            )}
          </GoogleMap>

          {/* Leyenda de marcadores */}
          {locationIcon && butcherIcon && (
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <img src={locationIcon.url} alt="Ubicación" className="w-6 h-6" />
                <span>Ubicación buscada</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={butcherIcon.url} alt="Carnicería" className="w-6 h-6" />
                <span>Carnicerías</span>
              </div>
            </div>
          )}
        </div>
      </LoadScript>
    </div>
  );
}