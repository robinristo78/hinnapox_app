import React, { useEffect, useState, memo, useMemo, useRef } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

// Data & Contexts
import stations from 'app/data/tanklad.json';
import { useLocation } from 'contexts/LocationContext';

// Components
import Filter from 'components/Filter';
import CitySearch from 'components/CitySearch'; // Ensure this path is correct based on your folder structure

// --- CONSTANTS & HELPERS ---

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
];

// Pre-calculate city locations to avoid doing it on every render
const cityLocations: Record<string, { latitude: number; longitude: number }> = {};
stations.forEach((s) => {
  if (!cityLocations[s.city]) {
    cityLocations[s.city] = { latitude: s.lat, longitude: s.lon };
  }
});

// --- COMPONENT ---

const MapScreen = memo(() => {
  const { t } = useTranslation();
  const { location: userLocation, loading, error, requestLocation, hasPermission } = useLocation();
  
  // State
  const [selectedBrands, setSelectedBrands] = useState<string[]>(Object.keys(BRAND_COLORS));
  const [showFilter, setShowFilter] = useState(false);

  // Refs
  const mapRef = useRef<MapView>(null);

  // Dark mode detection
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#647373' : '#9A8C8C';
  
  const mapStyle = useMemo(() => {
    return colorScheme === 'dark' ? DARK_MAP_STYLE : [];
  }, [colorScheme]);

  // Derived Data
  const allBrands = Array.from(new Set(stations.map((s) => s.brand_name)));
  const allCities = Object.keys(cityLocations);

  const filteredStations = useMemo(
    () => stations.filter((station) => selectedBrands.includes(station.brand_name)),
    [selectedBrands]
  );

  // Handlers
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSelectCity = (city: string) => {
    const coords = cityLocations[city];
    if (!coords || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      },
      800
    );
  };

  // Effects
  useEffect(() => {
    if (!hasPermission && !loading) {
      requestLocation();
    }
  }, [hasPermission, loading, requestLocation]);

  // --- RENDERS ---

  if (loading || !userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10, color: '#666' }}>{t('loadingLocation')}</Text>
      </View>
    );
  }

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

  return (
    <>
      <CitySearch
        cityList={allCities}
        onSelectCity={handleSelectCity}
        placeholder={t('SearchCity')}
      />
      <View style={{ flex: 1 }}>
        
        

        {/* Filter Button */}
        <View
          className="
            absolute left-5 z-20 
            bg-white dark:bg-black 
            rounded-full p-2.5 
            shadow-lg elevation-5
          "
          style={{ top: showFilter ? 50 : 10 }}
        >
          <TouchableOpacity onPress={() => setShowFilter((prev) => !prev)}>
            <Ionicons 
              name="filter" 
              size={24} 
              color={iconColor} 
            />
          </TouchableOpacity>
        </View>

        {/* Filter Modal/List */}
        {showFilter && (
          <Filter selectedBrands={selectedBrands} toggleBrand={toggleBrand} allBrands={allBrands} />
        )}

        {/* Map */}
        <MapView
          ref={mapRef}
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
              tracksViewChanges={false}
            />
          ))}
        </MapView>
      </View>
    </>
  );
});

export default MapScreen;