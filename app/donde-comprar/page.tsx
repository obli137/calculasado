'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

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

export default function DondeComprar() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [carniceriasNearby, setCarniceriasNearby] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInArea = () => {
    if (!map) return;
    
    setIsLoading(true);
    const center = map.getCenter();
    
    if (center && window.google) {
      const service = new google.maps.places.PlacesService(map);
      
      const request = {
        location: {
          lat: center.lat(),
          lng: center.lng()
        },
        radius: 2000, // 2km radio
        keyword: 'carniceria'
      };

      service.nearbySearch(request, (results, status) => {
        setIsLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setCarniceriasNearby(results);
        }
      });
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Búsqueda inicial
    const service = new google.maps.places.PlacesService(map);
    
    const request = {
      location: defaultCenter,
      radius: 2000,
      keyword: 'carniceria'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setCarniceriasNearby(results);
      }
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Encuentra Carnicerías Cercanas</h1>
        <button 
          onClick={searchInArea}
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-lg font-medium
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white'}
            transition-colors duration-200
            flex items-center space-x-2
          `}
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⭮</span>
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <span>🔄</span>
              <span>Actualizar área</span>
            </>
          )}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <LoadScript 
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={14}
            center={defaultCenter}
            onLoad={onLoad}
          >
            {carniceriasNearby.map((carniceria: any) => (
              <Marker
                key={carniceria.place_id}
                position={{
                  lat: carniceria.geometry.location.lat(),
                  lng: carniceria.geometry.location.lng()
                }}
                onClick={() => setSelectedMarker(carniceria)}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: selectedMarker.geometry.location.lat(),
                  lng: selectedMarker.geometry.location.lng()
                }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">{selectedMarker.name}</h3>
                  <p className="text-gray-600">{selectedMarker.vicinity}</p>
                  {selectedMarker.rating && (
                    <p className="mt-1">Rating: {selectedMarker.rating} ⭐</p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
} 