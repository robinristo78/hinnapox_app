import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Load stations from JSON file
import stations from '../data/tanklad.json';

const Map = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: stations[0].lat,
          longitude: stations[0].lon,
          latitudeDelta: 1.2, // zoom level
          longitudeDelta: 1.2,
        }}
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.lat,
              longitude: station.lon,
            }}
            title={`${station.brand_name} - ${station.name}`}
            description={`${station.address}, ${station.city}`}
          />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
