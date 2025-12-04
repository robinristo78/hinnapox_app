import React, { useEffect, useState, memo, useMemo } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

// --- Web Map Imports ---
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// NOTE: Check these paths match your folder structure
import stations from '../data/tanklad.json'; 
import Filter from 'components/Filter'; // Assuming Filter is in components/
import { useLocation } from 'contexts/LocationContext'; // Adjusted path

// --- Configuration ---
const BRAND_COLORS: Record<string, string> = {
  Alexela: 'blue',
  'Circle K': 'red',
  Olerex: 'yellow',
  NESTE: 'green',
  Premium7: 'black',
  Метанстанция: 'gray',
  Jetoil: 'pink',
  Terminal: 'darkgreen',
  Viada: 'orange',
  Astarte: 'purple',
};

// Helper component to recenter map when user location changes
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

const MapScreen = memo(() => {
  const { t } = useTranslation();
  const { location: userLocation, loading, error, requestLocation, hasPermission } = useLocation();
  const [selectedBrands, setSelectedBrands] = useState<string[]>(Object.keys(BRAND_COLORS));
  const [showFilter, setShowFilter] = useState(false);

  // Dark mode detection
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#9ca3af' : '#4b5563';
  const bgColor = isDark ? '#1f2937' : '#f3f4f6';

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const allBrands = Array.from(new Set(stations.map((s) => s.brand_name)));

  const filteredStations = useMemo(
    () => stations.filter((station) => selectedBrands.includes(station.brand_name)),
    [selectedBrands]
  );

  useEffect(() => {
    if (!hasPermission && !loading) {
       requestLocation(); 
    }
  }, [hasPermission, loading, requestLocation]);

  // --- Loading State ---
  if (loading || (!userLocation && !error)) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10, color: isDark ? '#e5e7eb' : '#374151' }}>
          {t('loadingLocation', 'Locating...')}
        </Text>
      </View>
    );
  }

  // --- Map Display ---
  const defaultLocation = { latitude: 58.5953, longitude: 25.0136 }; 
  const displayLocation = userLocation || defaultLocation;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor, position: 'relative' }}>
      <LeafletStyles />

      {/* Filter Button */}
      <View
        style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: isDark ? '#000' : '#fff',
            borderRadius: 50,
            padding: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }}
      >
        <TouchableOpacity onPress={() => setShowFilter((prev) => !prev)}>
          <Ionicons name="filter" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>

      {/* Filter Menu */}
      {showFilter && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100, pointerEvents: 'box-none' }}>
            <Filter selectedBrands={selectedBrands} toggleBrand={toggleBrand} allBrands={allBrands} />
        </View>
      )}

      {/* --- React Leaflet Map --- */}
      <div style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}>
        <MapContainer
          center={[displayLocation.latitude, displayLocation.longitude]}
          zoom={userLocation ? 13 : 8}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={isDark 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          {userLocation && <MapRecenter lat={userLocation.latitude} lng={userLocation.longitude} />}
          {userLocation && (
             <CircleMarker 
                center={[userLocation.latitude, userLocation.longitude]} 
                pathOptions={{ fillColor: '#3b82f6', color: '#fff', fillOpacity: 1, weight: 2 }}
                radius={8}
             >
                <Popup>{t('youAreHere', 'You are here')}</Popup>
             </CircleMarker>
          )}
          {filteredStations.map((station) => (
            <CircleMarker
              key={station.id}
              center={[station.lat, station.lon]}
              pathOptions={{ 
                  fillColor: BRAND_COLORS[station.brand_name] || 'gray', 
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
    </View>
  );
});

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;