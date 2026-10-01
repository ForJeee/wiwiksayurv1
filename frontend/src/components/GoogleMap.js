import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: -6.200000,
  lng: 106.816666
};

function GoogleMapComponent({ center = defaultCenter, zoom = 14, markers = [] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((pos, index) => (
          <Marker key={index} position={pos} />
        ))}
      </GoogleMap>
  ) : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">Memuat Peta...</div>;
}

export default React.memo(GoogleMapComponent);
