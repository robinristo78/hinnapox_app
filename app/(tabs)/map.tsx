import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import stations from '../data/tanklad.json';
import Filter from '../../components/Filter';

type UserLocation = { latitude: number; longitude: number } | null;

const BRAND_COLORS: Record<string, string> = {
  Alexela: 'blue',
  'Circle K': 'red',
  Olerex: 'yellow',
  NESTE: 'green',
  Premium7: 'black',
  'Метанстанция': 'white',
  Jetoil: 'pink',
  Terminal: 'darkgreen',
  Viada: 'orange',
  Astarte: 'purple',
};

const Map = () => {
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(Object.keys(BRAND_COLORS));
  const [showFilter, setShowFilter] = useState(false);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const allBrands = Array.from(new Set(stations.map((s) => s.brand_name)));

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  if (!userLocation) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const filteredStations = stations.filter((station) => selectedBrands.includes(station.brand_name));

  return (
    <View style={{ flex: 1 }}>
      {/* Filter toggle button */}
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
        }}
      >
        <TouchableOpacity onPress={() => setShowFilter((prev) => !prev)}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Filter panel */}
      {showFilter && <Filter selectedBrands={selectedBrands} toggleBrand={toggleBrand} allBrands={allBrands} />}

      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
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
};

export default Map;
