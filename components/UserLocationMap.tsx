import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, NavigationIcon, MapPin, Layers } from './icons';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
}

export interface UserLocationMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  showMarker?: boolean;
  destination?: string;
  onLocationUpdate?: (coords: LocationCoordinates) => void;
  className?: string;
}

// Default fallback location (Scenic bike path near Golden Gate / Presidio, SF)
const DEFAULT_COORDS: LocationCoordinates = {
  lat: 37.8024,
  lng: -122.4665,
  accuracy: 12,
  heading: 45,
  speed: 18.5,
};

export const UserLocationMap: React.FC<UserLocationMapProps> = ({
  initialCenter = [DEFAULT_COORDS.lat, DEFAULT_COORDS.lng],
  initialZoom = 15,
  showMarker = true,
  destination,
  onLocationUpdate,
  className = 'w-full h-full min-h-[350px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [currentCoords, setCurrentCoords] = useState<LocationCoordinates>(DEFAULT_COORDS);
  const [gpsStatus, setGpsStatus] = useState<'acquiring' | 'live' | 'simulated' | 'denied'>('acquiring');
  const [isFollowing, setIsFollowing] = useState(true);
  const [mapTileLayer, setMapTileLayer] = useState<'dark' | 'streets' | 'satellite'>('dark');

  // Custom Futuristic Glowing User Location Marker
  const createUserIcon = useCallback((heading?: number | null) => {
    const rotation = typeof heading === 'number' && !isNaN(heading) ? heading : 0;
    return L.divIcon({
      className: 'user-location-marker-container',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <!-- Radar pulse rings -->
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(56, 189, 248, 0.2); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: rgba(99, 102, 241, 0.35); border: 2px solid rgba(56, 189, 248, 0.8);"></div>
          
          <!-- Inner Core Beacon with directional chevron -->
          <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 0 12px #38bdf8; display: flex; align-items: center; justify-content: center; transform: rotate(${rotation}deg); transition: transform 0.3s ease;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
              <polygon points="12,2 22,22 12,17 2,22"></polygon>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }, []);

  // Destination Marker Icon
  const createDestinationIcon = useCallback(() => {
    return L.divIcon({
      className: 'destination-marker-container',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(234, 179, 8, 0.25); animation: pulse 1.8s infinite;"></div>
          <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background: #eab308; border: 2px solid #ffffff; box-shadow: 0 0 10px #eab308; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 32],
    });
  }, []);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Tile URLs
    const tileUrls = {
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    };

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
    });

    const activeTileLayer = L.tileLayer(tileUrls[mapTileLayer], {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Attach user marker if enabled
    if (showMarker) {
      const userMarker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: createUserIcon(currentCoords.heading),
        zIndexOffset: 1000,
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="color: #1e293b; font-family: sans-serif; font-size: 12px; font-weight: 600; padding: 2px;">
          <div style="font-size: 13px; color: #0284c7; margin-bottom: 2px;">⚡ E-Bike Position</div>
          <div>Lat: ${currentCoords.lat.toFixed(5)}</div>
          <div>Lng: ${currentCoords.lng.toFixed(5)}</div>
          <div>Accuracy: ±${Math.round(currentCoords.accuracy || 10)}m</div>
        </div>
      `);

      userMarkerRef.current = userMarker;

      const accuracyCircle = L.circle([currentCoords.lat, currentCoords.lng], {
        radius: currentCoords.accuracy || 20,
        color: '#38bdf8',
        weight: 1,
        fillColor: '#38bdf8',
        fillOpacity: 0.12,
      }).addTo(map);

      accuracyCircleRef.current = accuracyCircle;
    }

    // Dragging disables auto-follow
    map.on('dragstart', () => {
      setIsFollowing(false);
    });

    // Resize map when container size changes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      activeTileLayer.remove();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Change Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const tileUrls = {
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    };

    // Remove existing tile layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        layer.remove();
      }
    });

    L.tileLayer(tileUrls[mapTileLayer], {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);
  }, [mapTileLayer]);

  // 3. Geolocation Tracking
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsStatus('simulated');
      return;
    }

    // Try live location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LocationCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed ? pos.coords.speed * 3.6 : null, // convert m/s to km/h
        };
        setCurrentCoords(coords);
        setGpsStatus('live');
        if (onLocationUpdate) onLocationUpdate(coords);

        // Update map position
        if (mapInstanceRef.current && isFollowing) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], initialZoom);
        }
      },
      () => {
        // Fallback to simulated bike location
        setGpsStatus('simulated');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    // Watch position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: LocationCoordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed ? pos.coords.speed * 3.6 : null,
        };
        setCurrentCoords(coords);
        setGpsStatus('live');
        if (onLocationUpdate) onLocationUpdate(coords);
      },
      () => {
        // Error or denied
      },
      { enableHighAccuracy: true, maximumAge: 3000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [onLocationUpdate, initialZoom]);

  // 4. Update Marker and Circle when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);
      userMarkerRef.current.setIcon(createUserIcon(currentCoords.heading));
    }

    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng([currentCoords.lat, currentCoords.lng]);
      accuracyCircleRef.current.setRadius(currentCoords.accuracy || 20);
    }

    if (isFollowing) {
      mapInstanceRef.current.panTo([currentCoords.lat, currentCoords.lng], {
        animate: true,
        duration: 0.5,
      });
    }
  }, [currentCoords, createUserIcon, isFollowing]);

  // 5. Destination Marker & Simulated Route Polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (destination) {
      // Create destination point offset slightly northeast of current location
      const destLat = currentCoords.lat + 0.009;
      const destLng = currentCoords.lng + 0.012;

      if (!destinationMarkerRef.current) {
        const destMarker = L.marker([destLat, destLng], {
          icon: createDestinationIcon(),
        }).addTo(mapInstanceRef.current);
        destMarker.bindPopup(`<b>Destination:</b><br/>${destination}`);
        destinationMarkerRef.current = destMarker;
      } else {
        destinationMarkerRef.current.setLatLng([destLat, destLng]);
      }

      // Draw route line
      if (!routePolylineRef.current) {
        const polyline = L.polyline(
          [
            [currentCoords.lat, currentCoords.lng],
            [currentCoords.lat + 0.003, currentCoords.lng + 0.001],
            [currentCoords.lat + 0.005, currentCoords.lng + 0.007],
            [destLat, destLng],
          ],
          {
            color: '#6366f1',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8',
          }
        ).addTo(mapInstanceRef.current);
        routePolylineRef.current = polyline;
      }
    } else {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
    }
  }, [destination, currentCoords, createDestinationIcon]);

  // Center Map on User Functionality
  const handleCenterOnUser = useCallback(() => {
    if (!mapInstanceRef.current) return;
    setIsFollowing(true);
    mapInstanceRef.current.flyTo([currentCoords.lat, currentCoords.lng], 16, {
      animate: true,
      duration: 0.8,
    });
  }, [currentCoords]);

  // Zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  // Toggle map style
  const cycleTileLayer = () => {
    const layers: Array<'dark' | 'streets' | 'satellite'> = ['dark', 'streets', 'satellite'];
    const nextIdx = (layers.indexOf(mapTileLayer) + 1) % layers.length;
    setMapTileLayer(layers[nextIdx]);
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 sm:border-4 border-indigo-600/60 shadow-2xl bg-gray-950 ${className}`}>
      {/* Real Interactive Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Telemetry Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-700/80 shadow-lg flex items-center space-x-2 text-xs text-gray-300 font-mono pointer-events-auto">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              gpsStatus === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
            }`}
          />
          <span className="font-semibold text-white">
            {gpsStatus === 'live' ? 'GPS LOCK' : 'SIMULATED GPS'}
          </span>
          <span className="text-gray-400 border-l border-gray-700 pl-2">
            {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
          </span>
        </div>

        {/* Tile Layer Switcher */}
        <button
          onClick={cycleTileLayer}
          className="bg-gray-900/90 hover:bg-gray-800 text-gray-200 p-2 rounded-xl border border-gray-700/80 shadow-lg pointer-events-auto transition active:scale-95 flex items-center space-x-1.5 text-xs font-semibold"
          title="Switch Map Theme"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="capitalize hidden sm:inline">{mapTileLayer}</span>
        </button>
      </div>

      {/* Floating Action Controls */}
      <div className="absolute bottom-4 right-3 flex flex-col space-y-2 z-10">
        {/* Recenter on User Button */}
        <button
          onClick={handleCenterOnUser}
          aria-label="Center map on my location"
          className={`p-3 sm:p-3.5 rounded-2xl shadow-2xl transition-all duration-200 flex items-center justify-center border ${
            isFollowing
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] ring-2 ring-indigo-400/40'
              : 'bg-gray-900/90 hover:bg-gray-800 text-indigo-400 hover:text-white border-gray-700 active:scale-90'
          }`}
          title="Center on My Location"
        >
          <Crosshair className={`w-5 h-5 sm:w-6 sm:h-6 ${isFollowing ? 'animate-pulse' : ''}`} />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="p-3 bg-gray-900/90 hover:bg-gray-800 text-white rounded-xl border border-gray-700 shadow-xl transition active:scale-90 font-mono font-bold text-lg leading-none"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="p-3 bg-gray-900/90 hover:bg-gray-800 text-white rounded-xl border border-gray-700 shadow-xl transition active:scale-90 font-mono font-bold text-lg leading-none"
        >
          −
        </button>
      </div>

      {/* Bottom Center Following Banner */}
      {!isFollowing && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto">
          <button
            onClick={handleCenterOnUser}
            className="bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-2xl border border-indigo-400/60 backdrop-blur-md flex items-center space-x-2 transition active:scale-95 animate-bounce"
          >
            <NavigationIcon className="w-3.5 h-3.5" />
            <span>Re-center on E-Bike</span>
          </button>
        </div>
      )}
    </div>
  );
};
