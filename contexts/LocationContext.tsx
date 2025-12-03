import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserLocation = { latitude: number; longitude: number } | null;

interface LocationContextType {
  location: UserLocation;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  hasPermission: boolean;
}

const LOCATION_STORAGE_KEY = 'CACHED_USER_LOCATION';
const LOCATION_PERMISSION_KEY = 'LOCATION_PERMISSION_GRANTED';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const getCachedLocation = async () => {
    try {
      const cached = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (cached) {
        const parsedLocation = JSON.parse(cached);
        setLocation(parsedLocation);
        return parsedLocation;
      }
    } catch (err) {
      console.warn('Failed to retrieve cached location:', err);
    }
    return null;
  };

  const saveLocationToCache = async (loc: UserLocation) => {
    try {
      if (loc) {
        await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(loc));
      }
    } catch (err) {
      console.warn('Failed to cache location:', err);
    }
  };

  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we already have permission
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      let status = existingStatus;

      // Request permission if not already granted
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        status = newStatus;
      }

      if (status !== 'granted') {
        setError('Location permission denied');
        setHasPermission(false);
        setLoading(false);
        return;
      }

      setHasPermission(true);
      await AsyncStorage.setItem(LOCATION_PERMISSION_KEY, 'true');

      // Get current position with high accuracy
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userLocation: UserLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(userLocation);
      await saveLocationToCache(userLocation);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      console.error('Location error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initialize location on app load
  useEffect(() => {
    const initializeLocation = async () => {
      setLoading(true);

      // Try to get cached location first
      const cachedLoc = await getCachedLocation();
      if (cachedLoc) {
        setLocation(cachedLoc);
        setLoading(false);
      }

      // Check if user previously granted permission
      const permissionGranted = await AsyncStorage.getItem(LOCATION_PERMISSION_KEY);

      if (permissionGranted === 'true') {
        try {
          // Try to get fresh location in background
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const userLocation: UserLocation = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };

          setLocation(userLocation);
          await saveLocationToCache(userLocation);
          setHasPermission(true);
        } catch (err) {
          // If getting location fails but we have cached data, use cached data
          if (!cachedLoc) {
            console.warn('Failed to get fresh location:', err);
            setError('Failed to get location');
          }
        } finally {
          setLoading(false);
        }
      } else {
        // No permission granted yet, wait for user interaction
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        error,
        requestLocation,
        hasPermission,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
};
