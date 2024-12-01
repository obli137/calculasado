'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Input, Button } from "@nextui-org/react";

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

export default function DondeComprar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Encuentra Carnicerías Cercanas</h1>
      
      <LoadScript 
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={libraries}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
            {selectedPlace && (
              <Marker
                position={{
                  lat: selectedPlace.geometry.location.lat(),
                  lng: selectedPlace.geometry.location.lng()
                }}
                icon={{
                  url: '/location-pin.png',
                  scaledSize: new google.maps.Size(40, 40)
                }}
              />
            )}
            
            {nearbyPlaces.map((place, index) => (
              <Marker
                key={index}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }}
                title={place.name}
              />
            ))}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
}