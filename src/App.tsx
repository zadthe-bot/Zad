import React, { useState } from 'react';
import {
  Header
} from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { PromoBanners } from './components/PromoBanners';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetail } from './components/RestaurantDetail';
import { DishModal } from './components/DishModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { YamlSpecModal } from './components/YamlSpecModal';
import { AddressModal } from './components/AddressModal';

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

import { ArrowUpDown, Heart, Sparkles, Utensils, Bike } from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Address
  const [currentAddress, setCurrentAddress] = useState<string>('742 Evergreen Terrace, San Francisco, CA');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  // Category & Search Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'fastest' | 'free_delivery'>('popular');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(['rest-1', 'rest-4']);

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

  // Favorite toggle
  const handleToggleFavorite = (restaurantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  // Add Dish to Cart
  const handleAddToCart = (
    dish: Dish,
    quantity: number,
    selectedOptions: SelectedOption[],
    specialInstructions: string
  ) => {
    // If cart belongs to another restaurant, prompt or reset
    if (cartRestaurant && cartRestaurant.id !== dish.restaurantId) {
      if (!confirm('Start a new cart? Adding items from another restaurant will clear your current cart.')) {
        return;
      }
      setCartItems([]);
    }

    const currentRest = MOCK_RESTAURANTS.find((r) => r.id === dish.restaurantId) || null;
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

  // Quick Add (no options)
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
      createdAt: new Date(),
      status: 'confirmed',
      estimatedDeliveryMinutes: 25,
      driver: MOCK_DRIVER,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setCartRestaurant(null);
    setSelectedRestaurant(null);
    setActiveTab('orders');
  };

  // Filter restaurants logic
  const filteredRestaurants = MOCK_RESTAURANTS.filter((rest) => {
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
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
      
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
            dishes={MOCK_DISHES[selectedRestaurant.id] || []}
            onBack={() => setSelectedRestaurant(null)}
            onSelectDish={(dish) => setSelectedDish(dish)}
            onQuickAddDish={handleQuickAddDish}
          />
        ) : (
          /* VIEW 3: Main Restaurant Browsing Feed */
          <div>
            
            {/* Promo Banner Carousel */}
            <PromoBanners
              onApplyPromoClick={(code) => {
                setAppliedPromoCode(code);
                setIsCartOpen(true);
              }}
            />

            {/* Cuisines Filter Row */}
            <div className="my-6">
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                Browse Cuisines
              </h2>
              <CategoryFilter
                categories={CUISINE_CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Sorting & Restaurant Count Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pt-4 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'favorites' ? 'Favorite Spots' : 'Featured Restaurants'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                  {filteredRestaurants.length}
                </span>
              </div>

              {/* Sort Switcher Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs text-slate-600 font-semibold flex items-center gap-1 pr-1">
                  <ArrowUpDown className="w-3 h-3" />
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      sortBy === sort.id
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Restaurants Grid */}
            {filteredRestaurants.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-12">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No restaurants found</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Try clearing your search filters or browse other categories.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((rest) => (
                  <RestaurantCard
                    key={rest.id}
                    restaurant={rest}
                    onSelect={(r) => setSelectedRestaurant(r)}
                    isFavorite={favorites.includes(rest.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Dish Customization Modal */}
      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Sliding Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        restaurant={cartRestaurant}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
        appliedPromoCode={appliedPromoCode}
        onApplyPromo={handleApplyPromo}
        currentAddress={currentAddress}
      />

      {/* YAML Architecture Specification Modal */}
      <YamlSpecModal
        isOpen={isYamlModalOpen}
        onClose={() => setIsYamlModalOpen(false)}
      />

      {/* Address Switcher Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={setCurrentAddress}
      />

    </div>
  );
}
