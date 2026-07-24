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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Top Banner Hero */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Floating Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md shadow-lg transition-transform hover:scale-105 cursor-pointer z-10"
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
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white shadow-xl object-cover shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-xs font-bold">
                  {restaurant.cuisines.join(' • ')}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {restaurant.priceRange}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                {restaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1 max-w-xl font-medium">
                {restaurant.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 divide-x divide-slate-100">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <div>
                <span className="text-base font-bold text-slate-900">{restaurant.rating}</span>
                <span className="text-xs text-slate-600 block">({restaurant.reviewCount} ratings)</span>
              </div>
            </div>

            <div className="pl-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <span className="text-base font-bold text-slate-900">{restaurant.deliveryTime}</span>
                <span className="text-xs text-slate-600 block">Est. Delivery</span>
              </div>
            </div>

            <div className="pl-6 flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-500" />
              <div>
                <span className="text-base font-bold text-slate-900">
                  {restaurant.deliveryFee === 0 ? 'FREE' : `$${restaurant.deliveryFee.toFixed(2)}`}
                </span>
                <span className="text-xs text-slate-600 block">Delivery Fee</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{restaurant.address}</span>
          </div>
        </div>
      </div>

      {/* Menu & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Category Pill Navigation & Dish Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white text-xs sm:text-sm border border-slate-200 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80">
            <p className="text-slate-500 font-medium text-sm">
              No menu items match your search. Try adjusting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="group bg-white rounded-3xl p-4 border border-slate-200/80 hover:border-orange-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex justify-between gap-4"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      {dish.isPopular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Popular</span>
                        </span>
                      )}
                      {dish.isSpicy && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold">
                          <Flame className="w-3 h-3" />
                          <span>Spicy</span>
                        </span>
                      )}
                      {dish.isVegetarian && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          <Leaf className="w-3 h-3" />
                          <span>Veg</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {dish.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-black text-slate-900">
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
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{dish.optionGroups ? 'Customize' : 'Add'}</span>
                    </button>
                  </div>
                </div>

                {/* Dish Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
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
