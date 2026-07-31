import React, { useEffect, useRef, useState } from 'react';
import * as maplibreglModule from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Check, Loader2, Navigation } from 'lucide-react';
import { reverseGeocode } from '../lib/locationService';

// Handle ESM / CJS module interop cleanly for Vite
const maplibregl = (maplibreglModule as any).default || maplibreglModule;

interface MapLocationPickerProps {
  initialLat: number;
  initialLng: number;
  initialAddress: string;
  onConfirmLocation: (lat: number, lng: number, address: string) => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  initialLat,
  initialLng,
  initialAddress,
  onConfirmLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [selectedLat, setSelectedLat] = useState<number>(initialLat);
  const [selectedLng, setSelectedLng] = useState<number>(initialLng);
  const [addressName, setAddressName] = useState<string>(initialAddress);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Uber/Bolt clean vector navigation style inline definition
  const pickerStyleSpec = {
    version: 8,
    sources: {
      'carto-tiles': {
        type: 'raster',
        tiles: [
          'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        ],
        tileSize: 256,
        attribution: '&copy; CARTO &copy; OpenStreetMap',
      },
    },
    layers: [
      {
        id: 'carto-tiles-layer',
        type: 'raster',
        source: 'carto-tiles',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  };

  const updateLocationAndAddress = async (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setIsResolving(true);
    try {
      const resolved = await reverseGeocode(lat, lng);
      setAddressName(resolved);
    } catch {
      setAddressName(`${lat.toFixed(3)}°, ${lng.toFixed(3)}°`);
    } finally {
      setIsResolving(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: pickerStyleSpec as any,
          center: [initialLng, initialLat],
          zoom: 14.5,
          pitch: 15,
          bearing: 0,
          attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

        // Create custom DOM Marker
        const pinEl = document.createElement('div');
        pinEl.className = 'custom-picker-pin cursor-grab active:cursor-grabbing';
        pinEl.innerHTML = `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-2xl bg-emerald-950 border-2 border-white text-white flex items-center justify-center shadow-2xl text-lg animate-bounce ring-4 ring-slate-900/20">
              📍
            </div>
          </div>
        `;

        const marker = new maplibregl.Marker({
          element: pinEl,
          draggable: true,
        })
          .setLngLat([initialLng, initialLat])
          .addTo(map);

        markerRef.current = marker;

        // Drag event
        marker.on('dragend', () => {
          const lngLat = marker.getLngLat();
          updateLocationAndAddress(lngLat.lat, lngLat.lng);
        });

        // Map click event
        map.on('click', (e: any) => {
          const { lat, lng } = e.lngLat;
          marker.setLngLat([lng, lat]);
          updateLocationAndAddress(lat, lng);
        });

        mapInstanceRef.current = map;

        map.on('load', () => map.resize());
        setTimeout(() => map.resize(), 200);
      }
    } catch (err) {
      console.error('Picker MapLibre init error:', err);
    }
  }, []);

  // Handle ResizeObserver
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-full z-10" />
        <div className="absolute top-2 left-2 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-300 text-[10px] font-extrabold text-slate-800 flex items-center gap-1.5 shadow-xs">
          <Navigation className="w-3.5 h-3.5 text-emerald-950" />
          <span>Vector Navigation • Drag pin or click to move</span>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="p-2 rounded-xl bg-emerald-950 text-white shrink-0 shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-950 block">
              Selected Delivery Spot
            </span>
            <p className="text-xs font-extrabold text-slate-900 truncate">
              {isResolving ? 'Resolving location...' : addressName}
            </p>
          </div>
        </div>

        <button
          onClick={() => onConfirmLocation(selectedLat, selectedLng, addressName)}
          disabled={isResolving}
          className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
        >
          {isResolving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Confirm Location</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
