import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '../types';
import { MapPin, Navigation, Star, Clock, Utensils, Layers } from 'lucide-react';

interface InteractiveMapProps {
  userLat: number;
  userLng: number;
  userAddress: string;
  restaurants?: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  // Tracking props
  isTrackingOrder?: boolean;
  driverLat?: number;
  driverLng?: number;
  restaurantLat?: number;
  restaurantLng?: number;
  restaurantName?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  userLat,
  userLng,
  userAddress,
  restaurants = [],
  selectedRestaurant,
  onSelectRestaurant,
  isTrackingOrder = false,
  driverLat,
  driverLng,
  restaurantLat,
  restaurantLng,
  restaurantName,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  const [mapTileStyle, setMapTileStyle] = useState<'carto' | 'osm'>('carto');

  // Custom DivIcon creator for Leaflet with White & Cool Green visual identity
  const createCustomIcon = (
    type: 'user' | 'restaurant' | 'driver' | 'selected',
    label?: string
  ) => {
    let bgClass = 'bg-emerald-600 border-white text-white shadow-md';
    let iconSvg = '📍';

    if (type === 'user') {
      bgClass = 'bg-slate-900 border-2 border-emerald-500 shadow-xl text-white animate-pulse';
      iconSvg = '🏠';
    } else if (type === 'restaurant') {
      bgClass = 'bg-emerald-600 border-2 border-white shadow-md text-white';
      iconSvg = '🍴';
    } else if (type === 'selected') {
      bgClass = 'bg-emerald-700 border-2 border-emerald-300 shadow-2xl text-white scale-110 ring-4 ring-emerald-200';
      iconSvg = '⭐';
    } else if (type === 'driver') {
      bgClass = 'bg-emerald-500 border-2 border-white shadow-2xl text-white animate-bounce';
      iconSvg = '🛵';
    }

    const html = `
      <div class="relative flex items-center justify-center">
        <div class="w-10 h-10 rounded-2xl ${bgClass} flex items-center justify-center text-lg font-black shadow-lg">
          ${iconSvg}
        </div>
        ${
          label
            ? `<div class="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white text-slate-800 text-[11px] font-black px-2 py-0.5 rounded-md border border-emerald-200 whitespace-nowrap shadow-md">${label}</div>`
            : ''
        }
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-leaflet-pin',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const centerLat = isTrackingOrder && driverLat ? driverLat : userLat;
    const centerLng = isTrackingOrder && driverLng ? driverLng : userLng;

    const cartoUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const activeUrl = mapTileStyle === 'carto' ? cartoUrl : osmUrl;

    // Initialize Map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: isTrackingOrder ? 15 : 14,
        zoomControl: false,
      });

      const tileLayer = L.tileLayer(activeUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors (OpenFreeMap compatible)',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      L.control.zoom({ position: 'topright' }).addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], isTrackingOrder ? 15 : mapInstanceRef.current.getZoom());
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl(activeUrl);
      }
    }

    const map = mapInstanceRef.current;

    // Clear previous markers & polylines
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // 1. Add User Location Marker
    if (userLat && userLng) {
      const userMarker = L.marker([userLat, userLng], {
        icon: createCustomIcon('user', 'You'),
      }).addTo(map);
      userMarker.bindPopup(`
        <div class="text-slate-900 font-sans p-1">
          <p class="font-bold text-xs text-emerald-800">Delivery Address</p>
          <p class="text-[11px] text-slate-600">${userAddress}</p>
        </div>
      `);
      markersRef.current.push(userMarker);
    }

    // 2. Order Tracking Mode
    if (isTrackingOrder && restaurantLat && restaurantLng && driverLat && driverLng) {
      // Restaurant Marker
      const restMarker = L.marker([restaurantLat, restaurantLng], {
        icon: createCustomIcon('restaurant', restaurantName || 'Restaurant'),
      }).addTo(map);
      markersRef.current.push(restMarker);

      // Driver Marker
      const driverMarker = L.marker([driverLat, driverLng], {
        icon: createCustomIcon('driver', 'Driver GPS'),
      }).addTo(map);
      markersRef.current.push(driverMarker);

      // Draw Route Polyline from Restaurant -> Driver -> User
      const routeCoords: [number, number][] = [
        [restaurantLat, restaurantLng],
        [driverLat, driverLng],
        [userLat, userLng],
      ];

      const polyline = L.polyline(routeCoords, {
        color: '#059669', // Cool green polyline
        weight: 5,
        dashArray: '8, 8',
        opacity: 0.9,
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit bounds to show route
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (restaurants && restaurants.length > 0) {
      // 3. Explore View: Add all nearby restaurant markers
      const bounds = L.latLngBounds([[userLat, userLng]]);

      restaurants.forEach((rest) => {
        const rLat = rest.lat || userLat + (Math.random() - 0.5) * 0.02;
        const rLng = rest.lng || userLng + (Math.random() - 0.5) * 0.02;

        bounds.extend([rLat, rLng]);

        const isSelected = selectedRestaurant?.id === rest.id;
        const restMarker = L.marker([rLat, rLng], {
          icon: createCustomIcon(isSelected ? 'selected' : 'restaurant', rest.name),
        }).addTo(map);

        restMarker.on('click', () => {
          if (onSelectRestaurant) onSelectRestaurant(rest);
        });

        // Popup card
        restMarker.bindPopup(`
          <div class="text-slate-900 font-sans max-w-[200px] p-1">
            <h4 class="font-black text-sm text-slate-900">${rest.name}</h4>
            <p class="text-[11px] text-slate-600 line-clamp-1 mb-1">${rest.tagline}</p>
            <div class="flex items-center justify-between text-xs font-bold pt-1 border-t border-slate-200">
              <span class="text-emerald-700">★ ${rest.rating}</span>
              <span class="text-slate-500">${rest.deliveryTime}</span>
            </div>
          </div>
        `);

        markersRef.current.push(restMarker);
      });

      if (restaurants.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  }, [
    userLat,
    userLng,
    userAddress,
    restaurants,
    selectedRestaurant,
    isTrackingOrder,
    driverLat,
    driverLng,
    restaurantLat,
    restaurantLng,
    restaurantName,
    mapTileStyle,
  ]);

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border border-emerald-200 shadow-lg bg-white">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Free Map Badge & Legend Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-emerald-100 text-[11px] font-bold text-slate-800 flex items-center gap-3 shadow-md">
        <div className="flex items-center gap-1.5 text-emerald-700 font-black">
          <Navigation className="w-3.5 h-3.5" />
          <span>OpenFreeMap / OSM (No Google Key)</span>
        </div>
        <div className="h-3 w-px bg-slate-200" />
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-pulse"></span>
            <span>You</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Places</span>
          </span>
          {isTrackingOrder && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Courier</span>
            </span>
          )}
        </div>
      </div>

      {/* Tile Switcher Pill */}
      <div className="absolute bottom-3 right-3 z-20 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-emerald-100 text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-md">
        <button
          onClick={() => setMapTileStyle('carto')}
          className={`px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
            mapTileStyle === 'carto' ? 'bg-emerald-600 text-white font-black' : 'hover:bg-slate-100'
          }`}
        >
          Voyager
        </button>
        <button
          onClick={() => setMapTileStyle('osm')}
          className={`px-2 py-0.5 rounded-lg cursor-pointer transition-all ${
            mapTileStyle === 'osm' ? 'bg-emerald-600 text-white font-black' : 'hover:bg-slate-100'
          }`}
        >
          Standard OSM
        </button>
      </div>
    </div>
  );
};

