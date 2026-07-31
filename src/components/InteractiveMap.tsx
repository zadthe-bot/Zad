import React, { useEffect, useRef, useState } from 'react';
import * as maplibreglModule from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Restaurant } from '../types';
import { Maximize2, Minimize2, Navigation, RefreshCw, Star, X, MapPin, Search, ArrowLeft } from 'lucide-react';

// ESM / CJS interop for MapLibre GL
const maplibregl = (maplibreglModule as any).default || maplibreglModule;

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
  // Controls default view mode
  defaultFullScreen?: boolean;
  onCloseFullScreen?: () => void;
  className?: string;
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
  defaultFullScreen = false,
  onCloseFullScreen,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [isFullScreen, setIsFullScreen] = useState<boolean>(defaultFullScreen);
  const [mapTheme, setMapTheme] = useState<'positron' | 'dark'>('positron');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedRestState, setSelectedRestState] = useState<Restaurant | null>(selectedRestaurant || null);

  // Sync internal full screen state with prop if supplied
  useEffect(() => {
    setIsFullScreen(defaultFullScreen);
  }, [defaultFullScreen]);

  // Guaranteed inline tile style specification (Bolt / Uber style: white background, light gray roads, soft blue water)
  // Eliminates blank maps caused by failed external style.json network requests or CORS
  const createBoltMapStyle = (theme: 'positron' | 'dark') => {
    const tileUrl = theme === 'dark'
      ? 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
      : 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png';

    return {
      version: 8,
      sources: {
        'bolt-tiles': {
          type: 'raster',
          tiles: [
            tileUrl,
            tileUrl.replace('https://a.', 'https://b.'),
            tileUrl.replace('https://a.', 'https://c.'),
          ],
          tileSize: 256,
          attribution: '&copy; CARTO &copy; OpenStreetMap',
        },
      },
      layers: [
        {
          id: 'bolt-tiles-layer',
          type: 'raster',
          source: 'bolt-tiles',
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    };
  };

  // Create clean DOM markers for restaurants (dark green badge with star rating)
  const createMarkerElement = (
    type: 'user' | 'restaurant' | 'driver' | 'selected',
    name?: string,
    rating?: number
  ) => {
    const el = document.createElement('div');
    el.className = 'custom-maplibre-pin cursor-pointer transition-transform duration-200 hover:scale-110 group';

    if (type === 'user') {
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-slate-950 text-white border-2 border-emerald-500 flex items-center justify-center text-base shadow-2xl ring-4 ring-slate-900/30">
            🏠
          </div>
          <div class="mt-1 bg-slate-950 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-slate-700 shadow-md whitespace-nowrap">
            Delivery Spot
          </div>
        </div>
      `;
    } else if (type === 'driver') {
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="w-11 h-11 rounded-2xl bg-emerald-950 text-white border-2 border-white flex items-center justify-center text-lg shadow-2xl animate-bounce">
            🛵
          </div>
          <div class="mt-1 bg-emerald-950 text-white text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-900 shadow-md">
            Courier GPS
          </div>
        </div>
      `;
    } else {
      // Restaurant pin - Clean dark green pill with rating stars
      const isSelected = type === 'selected';
      const containerClass = isSelected
        ? 'bg-emerald-950 text-white border-2 border-emerald-400 ring-4 ring-emerald-950/40 scale-110'
        : 'bg-emerald-950 text-white border-2 border-white hover:bg-emerald-900 shadow-lg';

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="px-3 py-1.5 rounded-2xl ${containerClass} flex items-center gap-1.5 shadow-md">
            <span class="text-xs">🍴</span>
            <span class="text-xs font-black tracking-tight max-w-[130px] truncate">${name || 'Spot'}</span>
            ${
              rating
                ? `<span class="px-1.5 py-0.5 bg-white/20 text-white rounded-md text-[10px] font-black flex items-center gap-0.5">
                    ★${rating}
                   </span>`
                : ''
            }
          </div>
          <div class="w-2.5 h-2.5 bg-emerald-950 rotate-45 -mt-1 border-r border-b border-white"></div>
        </div>
      `;
    }

    return el;
  };

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const centerLng = isTrackingOrder && driverLng ? driverLng : userLng || 35.6900;
    const centerLat = isTrackingOrder && driverLat ? driverLat : userLat || -7.7700;

    try {
      if (!mapInstanceRef.current) {
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: createBoltMapStyle(mapTheme) as any,
          center: [centerLng, centerLat],
          zoom: isTrackingOrder ? 14.5 : 13.5,
          pitch: 15,
          bearing: 0,
          attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
        mapInstanceRef.current = map;

        map.on('load', () => {
          map.resize();
        });

        setTimeout(() => map.resize(), 200);
      } else {
        const map = mapInstanceRef.current;
        map.setStyle(createBoltMapStyle(mapTheme) as any);
        map.flyTo({
          center: [centerLng, centerLat],
          zoom: isTrackingOrder ? 14.5 : 13.5,
          speed: 1.2,
        });
        setTimeout(() => map.resize(), 150);
      }
    } catch (err) {
      console.error('Bolt Vector Map error:', err);
    }
  }, [mapTheme]);

  // Handle Container & Fullscreen Resizing
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

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.resize();
      }, 150);
    }
  }, [isFullScreen]);

  // Render Pins & Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const updateMapContent = () => {
      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // 1. User Location Marker
      if (userLat && userLng) {
        const userEl = createMarkerElement('user', 'Delivery Spot');
        const userMarker = new maplibregl.Marker({ element: userEl })
          .setLngLat([userLng, userLat])
          .addTo(map);
        markersRef.current.push(userMarker);
      }

      // 2. Order Tracking Mode
      if (isTrackingOrder && restaurantLat && restaurantLng && driverLat && driverLng) {
        const restEl = createMarkerElement('restaurant', restaurantName || 'Restaurant');
        const restMarker = new maplibregl.Marker({ element: restEl })
          .setLngLat([restaurantLng, restaurantLat])
          .addTo(map);
        markersRef.current.push(restMarker);

        const driverEl = createMarkerElement('driver', 'Courier GPS');
        const driverMarker = new maplibregl.Marker({ element: driverEl })
          .setLngLat([driverLng, driverLat])
          .addTo(map);
        markersRef.current.push(driverMarker);

        // Vector GeoJSON Line route
        const routeGeoJSON: any = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [restaurantLng, restaurantLat],
              [driverLng, driverLat],
              [userLng, userLat],
            ],
          },
        };

        if (map.getSource('route')) {
          (map.getSource('route') as any).setData(routeGeoJSON);
        } else {
          map.addSource('route', {
            type: 'geojson',
            data: routeGeoJSON,
          });

          map.addLayer({
            id: 'route-line-casing',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#022c22',
              'line-width': 8,
              'line-opacity': 0.5,
            },
          });

          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#064e3b',
              'line-width': 4,
              'line-dasharray': [2, 2],
            },
          });
        }

        const bounds = new maplibregl.LngLatBounds()
          .extend([restaurantLng, restaurantLat])
          .extend([driverLng, driverLat])
          .extend([userLng, userLat]);
        map.fitBounds(bounds, { padding: 60, maxZoom: 16 });
      } else if (restaurants && restaurants.length > 0) {
        if (map.getLayer('route-line')) map.removeLayer('route-line');
        if (map.getLayer('route-line-casing')) map.removeLayer('route-line-casing');
        if (map.getSource('route')) map.removeSource('route');

        const bounds = new maplibregl.LngLatBounds();
        if (userLng && userLat) bounds.extend([userLng, userLat]);

        const filteredList = searchFilter.trim()
          ? restaurants.filter(
              (r) =>
                r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                r.cuisine.toLowerCase().includes(searchFilter.toLowerCase())
            )
          : restaurants;

        filteredList.forEach((rest) => {
          const rLat = rest.lat || userLat + (Math.random() - 0.5) * 0.02;
          const rLng = rest.lng || userLng + (Math.random() - 0.5) * 0.02;

          bounds.extend([rLng, rLat]);

          const isSelected = (selectedRestState || selectedRestaurant)?.id === rest.id;
          const restEl = createMarkerElement(
            isSelected ? 'selected' : 'restaurant',
            rest.name,
            rest.rating
          );

          restEl.addEventListener('click', () => {
            setSelectedRestState(rest);
            if (onSelectRestaurant) onSelectRestaurant(rest);
          });

          const restMarker = new maplibregl.Marker({ element: restEl })
            .setLngLat([rLng, rLat])
            .setPopup(
              new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
                <div class="text-slate-900 font-sans p-2.5 max-w-[220px] bg-white rounded-2xl shadow-xl">
                  <h4 class="font-black text-xs text-slate-900 leading-tight">${rest.name}</h4>
                  <p class="text-[10px] text-slate-600 font-medium line-clamp-1 mt-0.5 mb-1.5">${rest.cuisine || rest.tagline}</p>
                  <div class="flex items-center justify-between text-[11px] font-black pt-1.5 border-t border-slate-200">
                    <span class="text-emerald-950 font-black">★ ${rest.rating} (${rest.reviewCount})</span>
                    <span class="text-slate-700 font-bold">${rest.deliveryTime}</span>
                  </div>
                </div>
              `)
            )
            .addTo(map);

          markersRef.current.push(restMarker);
        });

        if (filteredList.length > 0) {
          map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
        }
      }
    };

    if (map.isStyleLoaded()) {
      updateMapContent();
    } else {
      map.once('style.load', updateMapContent);
    }
  }, [
    userLat,
    userLng,
    userAddress,
    restaurants,
    selectedRestaurant,
    selectedRestState,
    searchFilter,
    isTrackingOrder,
    driverLat,
    driverLng,
    restaurantLat,
    restaurantLng,
    restaurantName,
  ]);

  const handleManualResize = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.resize();
    }
  };

  const handleCloseMapModal = () => {
    setIsFullScreen(false);
    if (onCloseFullScreen) onCloseFullScreen();
  };

  // Filtered list for floating drawer
  const drawerRestaurants = searchFilter.trim()
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : restaurants;

  // The actual map element canvas & overlay controls
  const mapCoreElement = (
    <div className="relative w-full h-full bg-slate-100">
      {/* Container div */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Header Card - Uber / Bolt Style */}
      <div className="absolute top-4 left-4 right-14 z-20 max-w-xl">
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-300 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden flex-1">
            <div className="p-2 rounded-xl bg-emerald-950 text-white shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-950 block leading-none">
                Uber / Bolt Vector Navigation Map
              </span>
              <p className="text-xs font-black text-slate-900 truncate mt-0.5">
                {userAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleManualResize}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 cursor-pointer transition-colors"
              title="Resize / Recenter Map"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-950" />
            </button>

            {!isFullScreen && (
              <button
                onClick={() => setIsFullScreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5 text-white" />
                <span>Full Screen</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay Header with Search Input & Close */}
      {isFullScreen && (
        <div className="absolute top-4 left-4 right-4 z-30 max-w-4xl mx-auto flex items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-300 shadow-xl flex-1 max-w-md">
            <button
              onClick={handleCloseMapModal}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer font-black text-xs shrink-0 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-950" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search spots on map..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:border-emerald-950"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md">
              <button
                onClick={() => setMapTheme('positron')}
                className={`px-3 py-1 rounded-xl cursor-pointer transition-all text-xs ${
                  mapTheme === 'positron' ? 'bg-emerald-950 text-white font-black' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Clean Map
              </button>
              <button
                onClick={() => setMapTheme('dark')}
                className={`px-3 py-1 rounded-xl cursor-pointer transition-all text-xs ${
                  mapTheme === 'dark' ? 'bg-emerald-950 text-white font-black' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                Night Map
              </button>
            </div>

            <button
              onClick={handleCloseMapModal}
              className="p-2.5 rounded-2xl bg-white/95 backdrop-blur-md hover:bg-slate-100 text-slate-900 border border-slate-300 shadow-xl cursor-pointer"
              title="Close Full Screen"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Drawer - Uber / Bolt Style Nearby Restaurant Cards */}
      {isFullScreen && drawerRestaurants.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-30 max-w-5xl mx-auto bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-300 shadow-2xl">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-950"></span>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Nearby Marked Restaurants ({drawerRestaurants.length})
              </h4>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-950">
              Tap any spot to select
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {drawerRestaurants.map((rest) => {
              const isSelected = (selectedRestState || selectedRestaurant)?.id === rest.id;
              return (
                <div
                  key={rest.id}
                  onClick={() => {
                    setSelectedRestState(rest);
                    if (onSelectRestaurant) onSelectRestaurant(rest);
                  }}
                  className={`min-w-[220px] max-w-[250px] p-3 rounded-2xl border text-left cursor-pointer transition-all shrink-0 ${
                    isSelected
                      ? 'bg-emerald-950 text-white border-emerald-950 shadow-lg ring-2 ring-emerald-500'
                      : 'bg-white text-slate-900 border-slate-300 hover:border-emerald-950 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="font-black text-xs truncate leading-tight">{rest.name}</h5>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-black shrink-0 flex items-center gap-0.5 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {rest.rating}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] font-medium truncate mb-2.5 ${
                      isSelected ? 'text-slate-200' : 'text-slate-600'
                    }`}
                  >
                    {rest.cuisine || rest.tagline}
                  </p>
                  <div
                    className={`flex items-center justify-between text-[10px] font-black pt-2 border-t ${
                      isSelected ? 'border-emerald-800 text-slate-200' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{rest.deliveryTime}</span>
                    <span className={isSelected ? 'text-white font-black' : 'text-emerald-950 font-black'}>
                      View Menu →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Render directly full screen modal layout if isFullScreen is true
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col animate-in fade-in duration-200">
        <div className="flex-1 w-full h-full relative">{mapCoreElement}</div>
      </div>
    );
  }

  // Embedded card view with a full screen trigger button
  return (
    <div className={`relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-slate-300 shadow-xl ${className}`}>
      {mapCoreElement}
    </div>
  );
};
