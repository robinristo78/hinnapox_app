import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { View } from 'react-native';

// Define the props this component expects
interface WebMapProps {
  userLocation: { latitude: number; longitude: number } | null;
  displayLocation: { latitude: number; longitude: number };
  stations: any[];
  brandColors: Record<string, string>;
  isDark: boolean;
  t: (key: string, defaultText: string) => string;
}

// Helper to recenter map when user location changes
const MapRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

// Helper to inject Leaflet CSS
const LeafletStyles = () => {
  useEffect(() => {
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);
  return null;
};

const WebMap: React.FC<WebMapProps> = ({ 
  userLocation, 
  displayLocation, 
  stations, 
  brandColors, 
  isDark,
  t 
}) => {
  
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}>
      <LeafletStyles />
      <MapContainer
        center={[displayLocation.latitude, displayLocation.longitude]}
        zoom={userLocation ? 13 : 8}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: isDark ? '#202020' : '#ddd' }}
      >
        <TileLayer
          // Update attribution based on the provider
          attribution={isDark 
            ? '&copy; <a href="http://www.esri.com/">Esri</a>' 
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          // Switch between OSM (Light) and Esri Dark Gray (Dark)
          url={isDark 
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        
        {userLocation && <MapRecenter lat={userLocation.latitude} lng={userLocation.longitude} />}
        
        {/* User Location Marker */}
        {userLocation && (
            <CircleMarker 
              center={[userLocation.latitude, userLocation.longitude]} 
              pathOptions={{ fillColor: '#3b82f6', color: '#fff', fillOpacity: 1, weight: 2 }}
              radius={8}
            >
              <Popup>{t('youAreHere', 'You are here')}</Popup>
            </CircleMarker>
        )}

        {/* Station Markers */}
        {stations.map((station) => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lon]}
            pathOptions={{ 
                fillColor: brandColors[station.brand_name] || 'gray', 
                color: '#fff', 
                weight: 1, 
                fillOpacity: 0.8 
            }}
            radius={10}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                  <strong style={{ fontSize: '14px' }}>{station.brand_name} - {station.name}</strong><br/>
                  <span style={{ fontSize: '12px', color: '#666' }}>{station.address}, {station.city}</span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

// Default export is crucial for React.lazy
export default WebMap;