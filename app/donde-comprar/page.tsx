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
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Encuentra Carnicerías Cercanas</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <LoadScript 
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={defaultCenter}
          >
            {/* Aquí irán los marcadores cuando implementemos la búsqueda */}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}