'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker as GoogleMapMarker, InfoWindow, SearchBox } from '@react-google-maps/api';

interface MarkerType {
    position: google.maps.LatLng | google.maps.LatLngLiteral;
    title?: string;
    address?: string;
    rating?: number;
    vicinity?: string;
    place_id?: string;
}

const mapContainerStyle = {
    width: '100%',
    height: '50vh',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

const DondeCompro: React.FC = () => {
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
    const [carniceriaIcon, setCarniceriaIcon] = useState<google.maps.Icon | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.google) {
            setCarniceriaIcon({
                url: '/public/logo-circular',
                scaledSize: new window.google.maps.Size(35, 35),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(17.5, 17.5)
            });
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(pos);
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                    alert('No se pudo obtener tu ubicación. Por favor, búscala manualmente.');
                }
            );
        } else {
            alert('Tu navegador no soporta geolocalización');
        }
    }, []);

    const searchNearbyButchers = useCallback(() => {
        if (!map || !userLocation) return;

        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: userLocation,
            radius: 1500,
            keyword: 'carniceria',
            type: 'store'
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const newMarkers = results.map(place => ({
                    position: {
                        lat: place.geometry?.location?.lat() || 0,
                        lng: place.geometry?.location?.lng() || 0
                    },
                    title: place.name || 'Carnicería',
                    vicinity: place.vicinity || '',
                    rating: place.rating,
                    place_id: place.place_id
                }));

                setMarkers(newMarkers);
            }
        });
    }, [map, userLocation]);

    const onLoad = (ref: google.maps.places.SearchBox) => {
        setSearchBox(ref);
    };

    const onPlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces();
            if (places && places.length > 0) {
                const place = places[0];
                if (place.geometry && place.geometry.location) {
                    const newLocation = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    };
                    setUserLocation(newLocation);
                    if (map) {
                        map.panTo(newLocation);
                        map.setZoom(15);
                        searchNearbyButchers();
                    }
                }
            }
        }
    };

    return (
        <div className="donde-comprar-container p-4 max-w-6xl mx-auto">
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                libraries={['places']}
            >
                <div className="search-container mb-4 flex gap-2">
                    <div className="flex-grow">
                        <SearchBox
                            onLoad={onLoad}
                            onPlacesChanged={onPlacesChanged}
                        >
                            <input
                                type="text"
                                placeholder="Buscar ubicación..."
                                className="w-full p-3 border-2 border-[#E63946] rounded-lg text-lg focus:outline-none focus:border-[#1D3557] shadow-sm"
                            />
                        </SearchBox>
                    </div>
                    <button
                        onClick={searchNearbyButchers}
                        className="px-4 py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#dc2f3c] transition-colors duration-200 flex items-center gap-2 shadow-sm"
                    >
                        <span>🔍</span>
                        <span>Ver Carnicerías</span>
                    </button>
                </div>

                {userLocation && (
                    <div className="map-container">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            zoom={15}
                            center={userLocation}
                            onLoad={setMap}
                            options={{
                                zoomControl: true,
                                streetViewControl: true,
                                mapTypeControl: true,
                                fullscreenControl: true
                            }}
                        >
                            <GoogleMapMarker
                                position={userLocation}
                                title="Tu ubicación"
                                icon={{
                                    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                }}
                            />
                            {markers.map((marker, index) => (
                                <React.Fragment key={index}>
                                    <GoogleMapMarker
                                        position={marker.position}
                                        title={marker.title}
                                        icon={carniceriaIcon || undefined}
                                        onClick={() => setSelectedMarker(marker)}
                                    />
                                    {selectedMarker === marker && (
                                        <InfoWindow
                                            position={marker.position}
                                            onCloseClick={() => setSelectedMarker(null)}
                                        >
                                            <div className="info-window p-3">
                                                <h3 className="text-lg font-bold text-[#E63946] mb-2">
                                                    {marker.title}
                                                </h3>
                                                {marker.vicinity && (
                                                    <p className="text-sm mb-2">
                                                        <strong>Dirección:</strong> {marker.vicinity}
                                                    </p>
                                                )}
                                                {marker.rating && (
                                                    <p className="text-sm mb-2">
                                                        <strong>Calificación:</strong> {marker.rating} ⭐
                                                    </p>
                                                )}
                                                {marker.place_id && (
                                                    <a 
                                                        href={`https://www.google.com/maps/place/?q=place_id:${marker.place_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ver-mas-btn"
                                                    >
                                                        Ver en Google Maps
                                                    </a>
                                                )}
                                            </div>
                                        </InfoWindow>
                                    )}
                                </React.Fragment>
                            ))}
                        </GoogleMap>
                    </div>
                )}
            </LoadScript>
        </div>
    );
};

export default DondeCompro;