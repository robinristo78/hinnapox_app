import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

// Data & Contexts
import stations from 'app/data/tanklad.json'; 
import { useLocation } from 'contexts/LocationContext';

// Components
import Filter from './Filter'; 
import CitySearch from 'components/CitySearch'; // Make sure this component is web-compatible (uses View/Text/TextInput)

// --- DYNAMIC IMPORT ---
const WebMap = React.lazy(() => import('components/WebMap'));

// --- CONSTANTS ---
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

// Pre-calculate city locations (Parity with Native)
const cityLocations: Record<string, { latitude: number; longitude: number }> = {};
stations.forEach((s) => {
  if (!cityLocations[s.city]) {
    cityLocations[s.city] = { latitude: s.lat, longitude: s.lon };
  }
});

const MapScreen = () => {
  const { t } = useTranslation();
  const { location: userLocation, loading, error, requestLocation, hasPermission } = useLocation();
  
  // State
  const [selectedBrands, setSelectedBrands] = useState<string[]>(Object.keys(BRAND_COLORS));
  const [showFilter, setShowFilter] = useState(false);
  
  // New State for Map Movement
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Dark mode detection
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#9ca3af' : '#4b5563';
  const bgColor = isDark ? '#1f2937' : '#f3f4f6';

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
    if (coords) {
      // Pass these coordinates to WebMap to trigger animation
      setMapCenter({ lat: coords.latitude, lng: coords.longitude });
    }
  };

  useEffect(() => {
    if (!hasPermission && !loading) {
       requestLocation(); 
    }
  }, []); 

  // Default to Estonia
  const defaultLocation = { latitude: 58.5953, longitude: 25.0136 }; 
  const displayLocation = userLocation || defaultLocation;

  return (
    <>
      <CitySearch
          cityList={allCities}
          onSelectCity={handleSelectCity}
          placeholder={t('SearchCity')}
      />
    <View style={{ flex: 1, backgroundColor: bgColor, position: 'relative' }}>
      
      

      {/* Filter Button */}
      <TouchableOpacity onPress={() => setShowFilter((prev) => !prev)} style={{
          position: 'absolute',
          top: showFilter ? 50 : 10, // Moved down slightly to make room for CitySearch
          right: 20,
          zIndex: 1300,
          backgroundColor: isDark ? '#000' : '#fff',
          borderRadius: 50,
          padding: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          cursor: 'pointer'
      }}>
        <Ionicons name="filter" size={24} color={iconColor} />
      </TouchableOpacity>

      {/* Filter Menu */}
      {showFilter && (
        <View style={{ position: 'absolute', top: 0, right: 0, width: '100%', zIndex: 1100, pointerEvents: 'box-none' }}>
            <Filter selectedBrands={selectedBrands} toggleBrand={toggleBrand} allBrands={allBrands} />
        </View>
      )}

      {loading && !userLocation && (
         <View style={{ 
            position: 'absolute', 
            top: 130, 
            alignSelf: 'center', 
            zIndex: 900, 
            backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
         }}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={{ marginLeft: 8, color: isDark ? '#fff' : '#000', fontSize: 12, fontWeight: '600' }}>
               {t('loadingLocation', 'Locating...')}
            </Text>
         </View>
      )}

      {/* --- Lazy Loaded Map --- */}
      <Suspense fallback={
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      }>
        <WebMap 
          userLocation={userLocation}
          displayLocation={displayLocation}
          stations={filteredStations}
          brandColors={BRAND_COLORS}
          isDark={isDark}
          t={t}
          // New prop to handle programmatic navigation
          flyToCoords={mapCenter} 
        />
      </Suspense>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;