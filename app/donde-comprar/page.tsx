'use client';

import { useState, useCallback, useRef } from 'react';
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
}

export default function DondeComprar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
    autocomplete.setComponentRestrictions({ country: 'ar' }); // Restringir a Argentina
    autocomplete.setTypes(['establishment']); // Restringir a establecimientos
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
        setSelectedPlace(place as Place);
        setSearchQuery(place.formatted_address || '');
      }
    }
  };

  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(newCenter);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Encuentra Carnicerías Cercanas</h1>
      
      <LoadScript 
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={libraries}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar carnicerías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <div id="autocomplete-container" />
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
            zoom={13}
            center={center}
          >
            {selectedPlace && (
              <Marker
                position={{
                  lat: selectedPlace.geometry.location.lat(),
                  lng: selectedPlace.geometry.location.lng()
                }}
                title={selectedPlace.name}
              />
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </div>
  );
}