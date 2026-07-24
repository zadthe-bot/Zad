import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Bike, MapPin, Search, Plus, Sparkles, Flame, Leaf } from 'lucide-react';
import { Restaurant, Dish } from '../types';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  dishes: Dish[];
  onBack: () => void;
  onSelectDish: (dish: Dish) => void;
  onQuickAddDish: (dish: Dish) => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  dishes,
  onBack,
  onSelectDish,
  onQuickAddDish,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dishSearch, setDishSearch] = useState<string>('');

  // Extract unique categories from dishes
  const categories = ['All', ...Array.from(new Set(dishes.map((d) => d.category)))];

  const filteredDishes = dishes.filter((dish) => {
    const matchesCat = selectedCategory === 'All' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      dish.description.toLowerCase().includes(dishSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f0f3f8] pb-24">
      
      {/* Top Banner Hero */}
      <div className="relative h-72 sm:h-88 w-full bg-slate-950">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-3 rounded-2xl clay-pill text-slate-900 transition-transform hover:scale-105 active:scale-95 cursor-pointer z-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-end gap-4">
            <img
              src={restaurant.logoImage}
              alt={restaurant.name}
              referrerPolicy="no-referrer"
              className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl border-2 border-white shadow-2xl object-cover shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-2xl clay-button-orange text-xs font-black">
                  {restaurant.cuisines.join(' • ')}
                </span>
                <span className="text-xs text-slate-300 font-bold bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  {restaurant.priceRange}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1 max-w-xl font-medium">
                {restaurant.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Clay Card Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="clay-card p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 divide-x divide-slate-300/60">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              <div>
                <span className="text-base font-black text-slate-950">{restaurant.rating}</span>
                <span className="text-xs text-slate-500 font-bold block">({restaurant.reviewCount} ratings)</span>
              </div>
            </div>

            <div className="pl-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <span className="text-base font-black text-slate-950">{restaurant.deliveryTime}</span>
                <span className="text-xs text-slate-500 font-bold block">Est. Delivery</span>
              </div>
            </div>

            <div className="pl-6 flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-base font-black text-slate-950">
                  {restaurant.deliveryFee === 0 ? 'FREE' : `$${restaurant.deliveryFee.toFixed(2)}`}
                </span>
                <span className="text-xs text-slate-500 font-bold block">Delivery Fee</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 clay-input px-3.5 py-2 rounded-2xl">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{restaurant.address}</span>
          </div>
        </div>
      </div>

      {/* Menu & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Category Pill Navigation & Dish Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'clay-button-black'
                    : 'clay-pill text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl clay-input text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 clay-card">
            <p className="text-slate-600 font-bold text-sm">
              No menu items match your search. Try adjusting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="group clay-card p-5 hover:scale-[1.02] transition-all cursor-pointer flex justify-between gap-4"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {dish.isPopular && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-black">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Popular</span>
                        </span>
                      )}
                      {dish.isSpicy && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-red-100 text-red-900 text-[10px] font-black">
                          <Flame className="w-3 h-3 text-red-600" />
                          <span>Spicy</span>
                        </span>
                      )}
                      {dish.isVegetarian && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-black">
                          <Leaf className="w-3 h-3 text-emerald-600" />
                          <span>Veg</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-950 group-hover:text-orange-600 transition-colors leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium">
                      {dish.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-950">
                      ${dish.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (dish.optionGroups && dish.optionGroups.length > 0) {
                          onSelectDish(dish);
                        } else {
                          onQuickAddDish(dish);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-2xl clay-button-orange text-xs font-black cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{dish.optionGroups ? 'Customize' : 'Add'}</span>
                    </button>
                  </div>
                </div>

                {/* Dish Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-200 shrink-0 shadow-md border border-white">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

