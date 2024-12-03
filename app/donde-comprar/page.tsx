'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker as GoogleMapMarker, Autocomplete, InfoWindow } from '@react-google-maps/api';

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
    height: '60vh',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

const center = {
    lat: -34.397,
    lng: 150.644,
};

const DondeComprar: React.FC = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries: ['places'],
    });

    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>({
        lat: -34.397,
        lng: 150.644
    });
    const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);

    const searchNearbyButchers = useCallback(() => {
        if (!map) return;
        
        const currentCenter = map.getCenter();
        if (!currentCenter) return;

        const service = new google.maps.places.PlacesService(map);
        const request = {
            location: currentCenter,
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
                    place_id: place.place_id,
                    // Agregamos más detalles del lugar
                    address: place.formatted_address,
                    phone: place.formatted_phone_number,
                    opening_hours: place.opening_hours?.weekday_text,
                }));

                // Para cada lugar, obtener detalles adicionales
                newMarkers.forEach((marker, index) => {
                    if (marker.place_id) {
                        service.getDetails(
                            {
                                placeId: marker.place_id,
                                fields: ['formatted_address', 'formatted_phone_number', 'opening_hours']
                            },
                            (place, detailStatus) => {
                                if (detailStatus === google.maps.places.PlacesServiceStatus.OK && place) {
                                    newMarkers[index] = {
                                        ...newMarkers[index],
                                        address: place.formatted_address,
                                        phone: place.formatted_phone_number,
                                        opening_hours: place.opening_hours?.weekday_text
                                    };
                                }
                            }
                        );
                    }
                });

                setMarkers(newMarkers);
            }
        });
    }, [map]);

    const handleSearch = useCallback(() => {
        searchNearbyButchers();
    }, [searchNearbyButchers]);

    useEffect(() => {
        if (isLoaded) {
            handleSearch();
        }
    }, [isLoaded, handleSearch]);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setSearchBox(autocomplete);
    };

    const onPlaceChanged = () => {
        if (searchBox) {
            const place = searchBox.getPlace();
            if (place.geometry) {
                map?.panTo(place.geometry.location);
                map?.setZoom(15);
                searchNearbyButchers();
            }
        }
    };

    // Función para obtener la ubicación del usuario
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(pos);
                    if (map) {
                        map.panTo(pos);
                        map.setZoom(15);
                        searchNearbyButchers();
                    }
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                    alert('No se pudo obtener tu ubicación. Por favor, búscala manualmente.');
                }
            );
        } else {
            alert('Tu navegador no soporta geolocalización');
        }
    };

    // Botón para obtener ubicación actual
    const LocationButton = () => (
        <button 
            className="location-button"
            onClick={getUserLocation}
        >
            <span>📍</span>
            <span>Mi ubicación</span>
        </button>
    );

    // Obtener ubicación al cargar el componente
    useEffect(() => {
        if (isLoaded) {
            getUserLocation();
        }
    }, [isLoaded]);

    const carniceriaIcon = {
        url: '/logo-circular.png',
        scaledSize: window.google?.maps?.Size ? new window.google.maps.Size(35, 35) : undefined,
        origin: window.google?.maps?.Point ? new window.google.maps.Point(0, 0) : undefined,
        anchor: window.google?.maps?.Point ? new window.google.maps.Point(17.5, 17.5) : undefined
    };

    const handleMarkerClick = (marker: MarkerType) => {
        setSelectedMarker(marker);
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps</div>;

    return (
        <div className="donde-comprar-container">
            <div className="search-container">
                <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                >
                    <input
                        type="text"
                        placeholder="Ingresá tu ubicación..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </Autocomplete>
                <LocationButton />
                <button 
                    onClick={handleSearch}
                    className="search-button"
                >
                    Buscar carnicerías
                </button>
            </div>
            <div className="map-container">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={userLocation}
                    onLoad={map => setMap(map)}
                >
                    {/* Marcador del usuario */}
                    <GoogleMapMarker
                        position={userLocation}
                        title="Tu ubicación"
                        icon={{
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        }}
                    />
                    {/* Marcadores de carnicerías con InfoWindows */}
                    {markers.map((marker, index) => (
                        <React.Fragment key={index}>
                            <GoogleMapMarker
                                position={marker.position}
                                title={marker.title}
                                icon={carniceriaIcon}
                                onClick={() => handleMarkerClick(marker)}
                            />
                            {selectedMarker === marker && (
                                <InfoWindow
                                    position={marker.position}
                                    onCloseClick={() => setSelectedMarker(null)}
                                >
                                    <div className="info-window">
                                        <h3>{marker.title}</h3>
                                        {marker.vicinity && (
                                            <p>
                                                <strong>Dirección:</strong> {marker.vicinity}
                                            </p>
                                        )}
                                        {marker.rating && (
                                            <p>
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
        </div>
    );
};

const styles = `
.donde-comprar-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.search-container {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.search-input {
    flex: 1;
    padding: 12px;
    border: 2px solid #E63946; /* Color rojo de CalculAsado */
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: #1D3557; /* Color azul oscuro de CalculAsado */
    box-shadow: 0 0 0 2px rgba(29, 53, 87, 0.1);
}

.search-button, .location-button {
    padding: 12px 24px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    font-size: 14px;
    letter-spacing: 0.5px;
}

.search-button {
    background-color: #E63946; /* Rojo de CalculAsado */
    color: white;
}

.location-button {
    background-color: #1D3557; /* Azul oscuro de CalculAsado */
    color: white;
    display: flex;
    align-items: center;
    gap: 8px;
}

.search-button:hover {
    background-color: #dc2f3c; /* Rojo más oscuro */
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.location-button:hover {
    background-color: #162840; /* Azul más oscuro */
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-button:active,
.location-button:active {
    transform: translateY(0);
    box-shadow: none;
}

/* Estilos para el contenedor del mapa */
.map-container {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 2px solid #F1FAEE; /* Color claro de CalculAsado */
}

/* Estilo para hacer el marcador circular */
.circular-marker {
    border-radius: 50%;
    border: 2px solid #E63946; /* Borde rojo de CalculAsado */
    background-color: white;
    padding: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Asegurarse de que la imagen dentro del marcador sea circular */
.circular-marker img {
    border-radius: 50%;
    object-fit: cover;
}

.info-window {
    padding: 12px;
    max-width: 300px;
}

.info-window h3 {
    margin: 0 0 12px 0;
    color: #E63946;
    font-size: 18px;
    border-bottom: 2px solid #E63946;
    padding-bottom: 8px;
}

.info-window p {
    margin: 8px 0;
    font-size: 14px;
    color: #1D3557;
    line-height: 1.4;
}

.horarios {
    margin: 12px 0;
}

.horarios ul {
    list-style: none;
    padding: 0;
    margin: 8px 0;
    font-size: 13px;
}

.horarios li {
    margin: 4px 0;
    color: #666;
}

.ver-mas-btn {
    display: inline-block;
    margin-top: 12px;
    padding: 8px 16px;
    background-color: #E63946;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
    text-align: center;
    width: 100%;
}

.ver-mas-btn:hover {
    background-color: #dc2f3c;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default DondeComprar;