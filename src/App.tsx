import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { PromoBanners } from './components/PromoBanners';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetail } from './components/RestaurantDetail';
import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { YamlSpecModal } from './components/YamlSpecModal';
import { AddressModal } from './components/AddressModal';
import { MobileExportModal } from './components/MobileExportModal';
import { FirebaseModal } from './components/FirebaseModal';
import { InteractiveMap } from './components/InteractiveMap';
import {
  saveOrderToFirebase,
  fetchOrdersFromFirebase,
  syncFavoritesWithFirebase,
  fetchFavoritesFromFirebase,
  seedAndFetchRestaurants,
  saveRestaurantsToFirebase,
  fetchRestaurantsFromFirebase,
  isFirebaseConfigured,
} from './lib/firebase';

import {
  getCurrentGpsLocation,
  geocodeCity,
  fetchNearbyRealRestaurants,
} from './lib/locationService';

import {
  CUISINE_CATEGORIES,
  MOCK_RESTAURANTS,
  MOCK_DISHES,
  MOCK_DRIVER,
} from './data/mockData';

import {
  Restaurant,
  Dish,
  CartItem,
  Order,
  SelectedOption,
  ActiveTab,
} from './types';

import { ArrowUpDown, Utensils, MapPin, Navigation, Loader2, CheckCircle2, Flame, Map as MapIcon, Grid } from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [feedViewMode, setFeedViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Address & GPS Location state
  const [currentAddress, setCurrentAddress] = useState<string>('Iringa, Tanzania');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({
    lat: -7.7731,
    lng: 35.6994,
  });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [isLoadingNearby, setIsLoadingNearby] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // Dynamic Restaurant & Dish Collections
  const [restaurants, setRestaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [dishesMap, setDishesMap] = useState<Record<string, Dish[]>>(MOCK_DISHES);

  // Category & Search Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'fastest' | 'free_delivery'>('popular');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartRestaurant, setCartRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Modals
  const [isYamlModalOpen, setIsYamlModalOpen] = useState<boolean>(false);
  const [isMobileExportModalOpen, setIsMobileExportModalOpen] = useState<boolean>(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);

  // Fetch real restaurants for location
  const loadRealRestaurantsForLocation = async (addressQuery: string, useGps: boolean = false) => {
    setIsLoadingNearby(true);
    if (useGps) setIsDetectingGps(true);

    try {
      let coords;
      if (useGps) {
        coords = await getCurrentGpsLocation();
      } else {
        coords = await geocodeCity(addressQuery);
      }

      const { restaurants: realRest, dishes: realDishes } = await fetchNearbyRealRestaurants(
        coords.lat,
        coords.lng,
        coords.addressName
      );

      if (realRest && realRest.length > 0) {
        setRestaurants(realRest);
        setDishesMap((prev) => ({ ...prev, ...realDishes }));
        setCurrentAddress(coords.addressName);
        setUserCoords({ lat: coords.lat, lng: coords.lng });
        
        // Save fetched real restaurants to Firebase Firestore
        await saveRestaurantsToFirebase(realRest);

        setLocationNotice(
          `📍 Connected to Firebase: Loaded ${realRest.length} real food spots in ${coords.addressName} and saved to database!`
        );
      }
    } catch (err: any) {
      console.warn('Location load error:', err);
      setLocationNotice(`Using fallback dataset for ${addressQuery}`);
    } finally {
      setIsLoadingNearby(false);
      setIsDetectingGps(false);
    }
  };

  // Sync with Firebase & Initial Location on load
  useEffect(() => {
    // 1. Initial real restaurant fetch for Iringa, Tanzania
    loadRealRestaurantsForLocation('Iringa, Tanzania');

    // 2. Hydrate Firebase orders & favorites if present
    if (isFirebaseConfigured) {
      fetchOrdersFromFirebase().then((dbOrders) => {
        if (dbOrders && dbOrders.length > 0) {
          const hydrated = dbOrders.map((o: any) => ({
            ...o,
            restaurant: restaurants.find((r) => r.id === o.restaurantId) || MOCK_RESTAURANTS[0],
            createdAt: new Date(o.createdAt),
            driver: MOCK_DRIVER,
          }));
          setOrders(hydrated);
          setActiveOrder(hydrated[0]);
        }
      });

      fetchFavoritesFromFirebase().then((dbFavs) => {
        if (dbFavs && dbFavs.length > 0) {
          setFavorites(dbFavs);
        }
      });
    }
  }, []);

  // Handle Address change selection from Modal
  const handleSelectAddress = (newAddr: string) => {
    loadRealRestaurantsForLocation(newAddr, false);
  };

  // Handle GPS location click
  const handleDetectGps = () => {
    loadRealRestaurantsForLocation('', true);
  };

  // Favorite toggle
  const handleToggleFavorite = (restaurantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId];
      
      if (isFirebaseConfigured) {
        syncFavoritesWithFirebase(next);
      }
      return next;
    });
  };

  // Add Dish to Cart
  const handleAddToCart = (
    dish: Dish,
    quantity: number,
    selectedOptions: SelectedOption[],
    specialInstructions: string
  ) => {
    if (cartRestaurant && cartRestaurant.id !== dish.restaurantId) {
      if (!confirm('Start a new cart? Adding items from another restaurant will clear your current cart.')) {
        return;
      }
      setCartItems([]);
    }

    const currentRest = restaurants.find((r) => r.id === dish.restaurantId) || null;
    setCartRestaurant(currentRest);

    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const unitPrice = dish.price + optionsPrice;
    const totalPrice = unitPrice * quantity;

    const cartItemId = `${dish.id}-${Date.now()}`;

    const newItem: CartItem = {
      cartItemId,
      dish,
      quantity,
      selectedOptions,
      specialInstructions,
      unitPrice,
      totalPrice,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Quick Add
  const handleQuickAddDish = (dish: Dish) => {
    handleAddToCart(dish, 1, [], '');
  };

  // Cart updates
  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.cartItemId !== cartItemId);
      if (updated.length === 0) setCartRestaurant(null);
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
  };

  const handleApplyPromo = (code: string): boolean => {
    if (code.toUpperCase() === 'SAVE20') {
      setAppliedPromoCode('SAVE20');
      return true;
    }
    return false;
  };

  // Place Order Action
  const handleCheckout = (
    subtotal: number,
    deliveryFee: number,
    tax: number,
    tip: number,
    discount: number,
    total: number
  ) => {
    if (!cartRestaurant) return;

    const newOrder: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      restaurant: cartRestaurant,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      tax,
      tip,
      discount,
      total,
      deliveryAddress: currentAddress,
      userLat: userCoords.lat,
      userLng: userCoords.lng,
      createdAt: new Date(),
      status: 'confirmed',
      estimatedDeliveryMinutes: 25,
      driver: MOCK_DRIVER,
    };

    if (isFirebaseConfigured) {
      saveOrderToFirebase({
        ...newOrder,
        restaurantId: cartRestaurant.id,
        restaurantName: cartRestaurant.name,
        estimatedDeliveryTime: '25 mins',
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setCartRestaurant(null);
    setSelectedRestaurant(null);
    setActiveTab('orders');
  };

  // Filter restaurants logic
  const filteredRestaurants = restaurants.filter((rest) => {
    // Cuisine category filter
    const matchesCategory =
      selectedCategory === 'all' ||
      rest.cuisines.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()));

    // Search query
    const matchesSearch =
      searchQuery === '' ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tab favorites
    if (activeTab === 'favorites' && !favorites.includes(rest.id)) {
      return false;
    }

    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'fastest') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    if (sortBy === 'free_delivery') return (a.deliveryFee === 0 ? -1 : 1);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* Top Header */}
      <Header
        currentAddress={currentAddress}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'explore') setSelectedRestaurant(null);
        }}
        onOpenYamlModal={() => setIsYamlModalOpen(true)}
        onOpenMobileExportModal={() => setIsMobileExportModalOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        activeOrderCount={orders.length}
      />

      {/* Main Views Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        
        {/* VIEW 1: Active Order Tracker View */}
        {activeTab === 'orders' && activeOrder ? (
          <OrderTracker
            order={activeOrder}
            onBackToExplore={() => {
              setActiveTab('explore');
              setSelectedRestaurant(null);
            }}
          />
        ) : selectedRestaurant ? (
          /* VIEW 2: Restaurant Detail Menu View */
          <RestaurantDetail
            restaurant={selectedRestaurant}
            dishes={dishesMap[selectedRestaurant.id] || []}
            onBack={() => setSelectedRestaurant(null)}
            onSelectDish={(dish) => setSelectedDish(dish)}
            onQuickAddDish={handleQuickAddDish}
          />
        ) : (
          /* VIEW 3: Main Restaurant Browsing Feed */
          <div>
            
            {/* GPS & Location Banner Bar */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-emerald-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                      Real Nearby Places
                    </span>
                    <span className="px-2 py-0.5 rounded-full green-pill text-[10px] font-black flex items-center gap-1">
                      <Flame className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                      Firebase Synced
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <span>Restaurants in {currentAddress}</span>
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDetectGps}
                  disabled={isDetectingGps || isLoadingNearby}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl green-button text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                  title="Detect GPS location"
                >
                  {isDetectingGps || isLoadingNearby ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>{isDetectingGps ? 'Locating...' : 'Use My GPS'}</span>
                </button>

                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer hover:bg-slate-200"
                >
                  Change City
                </button>
              </div>
            </div>

            {/* Notification badge if location synced */}
            {locationNotice && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{locationNotice}</span>
                </div>
                <button
                  onClick={() => setLocationNotice(null)}
                  className="text-emerald-700 hover:text-slate-900 text-xs cursor-pointer ml-2"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Promo Banner Carousel */}
            <PromoBanners
              onApplyPromoClick={(code) => {
                setAppliedPromoCode(code);
                setIsCartOpen(true);
              }}
            />

            {/* Cuisines Filter Row */}
            <div className="my-8">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 pl-1">
                Explore Cuisines
              </h2>
              <CategoryFilter
                categories={CUISINE_CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Sorting & View Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'favorites' ? 'Favorite Spots' : 'Featured Restaurants'}
                </h2>
                <span className="px-3 py-1 rounded-2xl green-pill text-emerald-800 text-xs font-black">
                  {filteredRestaurants.length}
                </span>

                {/* View Switcher Toggle */}
                <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-2xl ml-2">
                  <button
                    onClick={() => setFeedViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      feedViewMode === 'grid'
                        ? 'green-button font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setFeedViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      feedViewMode === 'map'
                        ? 'green-button font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Map View</span>
                  </button>
                </div>
              </div>

              {/* Sort Switcher Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1 pr-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sort:</span>
                </span>
                {[
                  { id: 'popular', label: 'Popular' },
                  { id: 'rating', label: 'Top Rated ★' },
                  { id: 'fastest', label: 'Fastest ⚡' },
                  { id: 'free_delivery', label: 'Free Delivery' },
                ].map((sort) => (
                  <button
                    key={sort.id}
                    onClick={() => setSortBy(sort.id as any)}
                    className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      sortBy === sort.id
                        ? 'green-button shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Restaurants Content Display */}
            {isLoadingNearby ? (
              <div className="white-card p-12 text-center max-w-md mx-auto my-12 border border-emerald-100 bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-900 mb-1">Locating Real Restaurants...</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Querying OpenStreetMap food places in {currentAddress} and syncing to Firebase Firestore...
                </p>
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="white-card p-12 text-center max-w-md mx-auto my-12 border border-emerald-100 bg-white">
                <div className="w-16 h-16 rounded-2xl green-button flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">No restaurants found</h3>
                <p className="text-xs text-slate-500 font-medium mb-6">
                  Try clearing your search filters or change delivery location to find restaurants.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 rounded-2xl green-button text-xs font-black cursor-pointer shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : feedViewMode === 'map' ? (
              <div className="space-y-6">
                <InteractiveMap
                  userLat={userCoords.lat}
                  userLng={userCoords.lng}
                  userAddress={currentAddress}
                  restaurants={filteredRestaurants}
                  selectedRestaurant={selectedRestaurant}
                  onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      isFavorite={favorites.includes(restaurant.id)}
                      onToggleFavorite={(e) => handleToggleFavorite(restaurant.id, e)}
                      onClick={() => setSelectedRestaurant(restaurant)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isFavorite={favorites.includes(restaurant.id)}
                    onToggleFavorite={(e) => handleToggleFavorite(restaurant.id, e)}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Dish Customize & Options Modal */}
      <DishModal
        dish={selectedDish}
        isOpen={Boolean(selectedDish)}
        onClose={() => setSelectedDish(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Side Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        restaurant={cartRestaurant}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onApplyPromo={handleApplyPromo}
        appliedPromoCode={appliedPromoCode}
        onCheckout={handleCheckout}
      />

      {/* YAML Architecture Modal */}
      <YamlSpecModal
        isOpen={isYamlModalOpen}
        onClose={() => setIsYamlModalOpen(false)}
      />

      {/* Mobile App conversion Modal */}
      <MobileExportModal
        isOpen={isMobileExportModalOpen}
        onClose={() => setIsMobileExportModalOpen(false)}
      />

      {/* Delivery Address & GPS Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={handleSelectAddress}
        onDetectGpsLocation={handleDetectGps}
        isDetectingGps={isDetectingGps}
      />

      {/* Firebase Database Status Modal */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

    </div>
  );
}
