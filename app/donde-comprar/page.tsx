'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, StandaloneSearchBox } from '@react-google-maps/api';

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
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [carniceriasNearby, setCarniceriasNearby] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchNearbyCarniceries = useCallback((location: google.maps.LatLngLiteral) => {
    if (!map || !window.google) return;
    
    setIsLoading(true);
    const service = new google.maps.places.PlacesService(map);
    
    const request = {
      location: location,
      radius: 2000,
      keyword: 'carniceria'
    };

    service.nearbySearch(request, (results, status) => {
      setIsLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setCarniceriasNearby(results);
      }
    });
  }, [map]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    searchNearbyCarniceries(defaultCenter);
  }, [searchNearbyCarniceries]);

  const onLoadSearchBox = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox && map) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          map.setCenter(location);
          map.setZoom(15);
          searchNearbyCarniceries(location);
        }
      }
    }
  };

  const handleUpdateArea = () => {
    if (!map) return;
    const center = map.getCenter();
    if (center) {
      searchNearbyCarniceries({
        lat: center.lat(),
        lng: center.lng()
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Encuentra Carnicerías Cercanas</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <LoadScript 
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          libraries={libraries}
        >
          <div className="flex gap-4 mb-4">
            <div className="flex-grow">
              <StandaloneSearchBox
                onLoad={onLoadSearchBox}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Busca tu dirección..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </StandaloneSearchBox>
            </div>

            <button
              onClick={handleUpdateArea}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Buscando...' : 'Actualizar área'}
            </button>
          </div>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
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