import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

const mapStyles = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#E3F2FD' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#F5F5F5' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#E8F5E9' }]
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }]
  }
];

const Map = ({ selectedProfile, onError }) => {
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapError = (error) => {
    setMapError('Failed to load Google Maps');
    onError?.(error);
  };

  const handleMarkerError = (error) => {
    setMapError('Failed to place marker on map');
    onError?.(error);
  };

  if (mapError) {
    return (
      <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Error</h3>
          <p className="text-gray-600">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200/50 backdrop-blur-sm">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedProfile?.location || defaultCenter}
        zoom={selectedProfile ? 13 : 4}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onError={handleMapError}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapTypeId: 'terrain'
        }}
      >
        {selectedProfile && (
          <Marker
            position={selectedProfile.location}
            title={selectedProfile.name}
            animation={window.google?.maps.Animation.DROP}
            onError={handleMarkerError}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
