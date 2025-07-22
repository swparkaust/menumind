export interface LocationCoords {
  lat: number;
  lng: number;
}

export class LocationService {
  static async getCurrentLocation(maximumAge: number = 300000): Promise<LocationCoords | null> {
    if (!navigator.geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge,
        }
      );
    });
  }

  static async requestLocationPermission(): Promise<boolean> {
    if (!navigator.permissions) {
      return this.getCurrentLocation() !== null;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state === 'granted';
    } catch (error) {
      return false;
    }
  }
}