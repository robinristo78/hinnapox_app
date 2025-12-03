import React, { useEffect, useState, memo, useMemo } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import stations from '../data/tanklad.json';
import Filter from '../../components/Filter';
import { useLocation } from '../../contexts/LocationContext';

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

const Map = memo(() => {
  const { t } = useTranslation();
  const { location: userLocation, loading, error, requestLocation, hasPermission } = useLocation();
  const [selectedBrands, setSelectedBrands] = useState<string[]>(Object.keys(BRAND_COLORS));
  const [showFilter, setShowFilter] = useState(false);

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
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: 'absolute',
          top: 40,
          right: 20,
          zIndex: 20,
          backgroundColor: 'white',
          borderRadius: 25,
          padding: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <TouchableOpacity onPress={() => setShowFilter((prev) => !prev)}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {showFilter && (
        <Filter selectedBrands={selectedBrands} toggleBrand={toggleBrand} allBrands={allBrands} />
      )}

      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
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
