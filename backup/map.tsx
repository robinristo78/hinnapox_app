import React, { useEffect, useState, memo, useMemo } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';


import stations from '../data/tanklad.json';
import Filter from '../../components/Filter';
import { useLocation } from '../../contexts/LocationContext';

import { useColorScheme } from 'nativewind';


// Defines an object to map gas station brand names to specific marker colors on the map.
const BRAND_COLORS: Record<string, string> = {
  Alexela: 'blue',
  'Circle K': 'red',
  Olerex: 'yellow',
  NESTE: 'green',
  Premium7: 'black',
  Метанстанция: 'white',
  Jetoil: 'pink',
  Terminal: 'darkgreen',
  Viada: 'orange',
  Astarte: 'purple',
};

const DARK_MAP_STYLE = [
  // This is a condensed example. A full dark style JSON is very long.
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  // ... many more styles
];

// Defines the Map component, wrapped in React.memo for performance optimization (prevents unnecessary re-renders).
const Map = memo(() => {
  const { t } = useTranslation();
  const { location: userLocation, loading, error, requestLocation, hasPermission } = useLocation();
  const [selectedBrands, setSelectedBrands] = useState<string[]>(Object.keys(BRAND_COLORS));
  const [showFilter, setShowFilter] = useState(false);

  // Dark mode detection hook
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#647373' : '#9A8C8C';

  const mapStyle = useMemo(() => {
    return colorScheme === 'dark' ? DARK_MAP_STYLE : [];
  }, [useColorScheme()]);

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

  // Effect hook to manage location permission and request.
  useEffect(() => {
    if (!hasPermission && !loading) {
      requestLocation();
    }
  }, [hasPermission, loading, requestLocation]);

  // Conditional rendering: shows a loading screen if location data is being fetched or not yet available.
  if (loading || !userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, color: '#666' }}>{t('loadingLocation')}</Text>
      </View>
    );
  }

  // Conditional rendering: shows an error screen if there was a location error and no location is available.
  if (error && !userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: '#EF4444', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <TouchableOpacity
          onPress={requestLocation}
          style={{ backgroundColor: '#0000ff', padding: 10, borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>{t('retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main rendering of the map component when location data is available.
  return (
    <View style={{ flex: 1 }}>
      <View
        className="
          absolute top-10 right-5 z-20 
          bg-white dark:bg-black 
          rounded-full p-2.5 
          shadow-lg elevation-5
        "
      >
  <TouchableOpacity onPress={() => setShowFilter((prev) => !prev)}>
    <Ionicons 
      name="filter" 
      size={24} 
      color={iconColor} 

    />
  </TouchableOpacity>
</View>

      {showFilter && (
        <Filter selectedBrands={selectedBrands} toggleBrand={toggleBrand} allBrands={allBrands} />
      )}

      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}>
        {filteredStations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{ latitude: station.lat, longitude: station.lon }}
            title={`${station.brand_name} - ${station.name}`}
            description={`${station.address}, ${station.city}`}
            pinColor={BRAND_COLORS[station.brand_name] || 'gray'}
          />
        ))}
      </MapView>
    </View>
  );
});

export default Map;
