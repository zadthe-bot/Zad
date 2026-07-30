import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Check, Loader2 } from 'lucide-react';
import { reverseGeocode } from '../lib/locationService';

interface MapLocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onConfirmLocation: (address: string, lat: number, lng: number) => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  initialLat = -7.7700,
  initialLng = 35.6900,
  onConfirmLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [selectedLat, setSelectedLat] = useState<number>(initialLat);
  const [selectedLng, setSelectedLng] = useState<number>(initialLng);
  const [addressName, setAddressName] = useState<string>('Loading address...');
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Custom DivIcon for delivery pin
  const createDeliveryPin = () => {
    const html = `
      <div class="relative flex items-center justify-center">
        <div class="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-xl text-lg animate-bounce">
          📍
        </div>
      </div>
    `;
    return L.divIcon({
      html,
      className: 'custom-leaflet-delivery-pin',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  const updateLocationAndAddress = async (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setIsResolving(true);
    try {
      const addr = await reverseGeocode(lat, lng);
      setAddressName(addr);
    } catch {
      setAddressName(`${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);
    } finally {
      setIsResolving(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> (OpenFreeMap)',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Create initial marker
      const marker = L.marker([initialLat, initialLng], {
        icon: createDeliveryPin(),
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Handle marker drag
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        updateLocationAndAddress(position.lat, position.lng);
      });

      // Handle map click
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updateLocationAndAddress(lat, lng);
      });

      mapInstanceRef.current = map;
      updateLocationAndAddress(initialLat, initialLng);
    }
  }, []);

  const handleConfirm = () => {
    onConfirmLocation(addressName, selectedLat, selectedLng);
  };

  return (
    <div className="space-y-3">
      <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-emerald-200 shadow-sm bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
        <div className="absolute top-2 left-2 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-100 text-[10px] font-bold text-slate-700 flex items-center gap-1.5 shadow-xs">
          <Navigation className="w-3 h-3 text-emerald-600" />
          <span>Click anywhere on OpenFreeMap to move pin</span>
        </div>
      </div>

      {/* Selected Address Display Card */}
      <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 block">
              Selected Delivery Spot
            </span>
            <p className="text-xs font-bold text-slate-900 truncate">
              {isResolving ? 'Resolving address name...' : addressName}
            </p>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isResolving}
          className="px-4 py-2 green-button text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
        >
          {isResolving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          )}
          <span>Deliver Here</span>
        </button>
      </div>
    </div>
  );
};
