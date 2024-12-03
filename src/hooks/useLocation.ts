import { useState, useEffect } from 'react';

const DEFAULT_LOCATIONS = [
  'Macau', 'Monaco', 'Vegas', 'Singapore', 'Monte Carlo', 'Manila',
  'Melbourne', 'Paradise', 'Marina Bay', 'Cotai', 'Atlantic City'
];

const STORAGE_KEY = 'user_location';
const LAST_UPDATE_KEY = 'location_last_update';
const UPDATE_INTERVAL = 1000 * 60 * 60; // 1 hour

interface LocationState {
  location: string;
  error: string | null;
  isLoading: boolean;
  isDefault: boolean;
}

async function fetchLocationDetails(position: GeolocationPosition): Promise<string> {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
  );
  const data = await response.json();
  return data.city || data.locality || DEFAULT_LOCATIONS[0];
}

export function useLocation() {
  const [state, setState] = useState<LocationState>(() => {
    const savedLocation = localStorage.getItem(STORAGE_KEY);
    if (savedLocation) {
      return {
        location: savedLocation,
        error: null,
        isLoading: false,
        isDefault: false
      };
    }
    return {
      location: DEFAULT_LOCATIONS[Math.floor(Math.random() * DEFAULT_LOCATIONS.length)],
      error: null,
      isLoading: true,
      isDefault: true
    };
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported',
        isLoading: false,
        isDefault: true
      }));
      return;
    }

    // Check if we should update the location
    const lastUpdate = Number(localStorage.getItem(LAST_UPDATE_KEY)) || 0;
    const shouldUpdate = Date.now() - lastUpdate > UPDATE_INTERVAL;

    if (!shouldUpdate && localStorage.getItem(STORAGE_KEY)) {
      return;
    }

    const successHandler = async (position: GeolocationPosition) => {
      try {
        const location = await fetchLocationDetails(position);
        
        // Save to localStorage with timestamp
        localStorage.setItem(STORAGE_KEY, location);
        localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
        
        setState(prev => ({
          ...prev,
          location,
          error: null,
          isLoading: false,
          isDefault: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to get location details',
          isLoading: false,
          isDefault: true
        }));
      }
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
        isDefault: true
      }));
    };

    // Watch for location changes
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: UPDATE_INTERVAL
      }
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}