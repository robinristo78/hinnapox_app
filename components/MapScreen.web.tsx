import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

// Adjust paths to match your project structure
import stations from 'app/data/tanklad.json'; 
import Filter from './Filter'; 
import { useLocation } from 'contexts/LocationContext';

// --- DYNAMIC IMPORT ---
// This prevents 'window is not defined' error during build/SSR
const WebMap = React.lazy(() => import('./WebMap'));

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

const MapScreen = () => {
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

  // Default to Estonia
  const defaultLocation = { latitude: 58.5953, longitude: 25.0136 }; 
  const displayLocation = userLocation || defaultLocation;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor, position: 'relative' }}>
      
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

      {/* --- Lazy Loaded Map --- */}
      <Suspense fallback={
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      }>
        {/* We only render the map if we are in the browser (implied by Suspense resolving) */}
        <WebMap 
          userLocation={userLocation}
          displayLocation={displayLocation}
          stations={filteredStations}
          brandColors={BRAND_COLORS}
          isDark={isDark}
          t={t}
        />
      </Suspense>
    </View>
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