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
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      
      {/* Top Banner Hero */}
      <div className="relative h-72 sm:h-88 w-full bg-slate-900">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/30" />

        {/* Floating Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-3 rounded-2xl bg-white/90 hover:bg-white text-slate-900 transition-transform hover:scale-105 active:scale-95 cursor-pointer z-10 border border-slate-200 shadow-md"
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
              className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl border-2 border-emerald-500 shadow-2xl object-cover shrink-0 bg-white"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-2xl green-button text-xs font-black">
                  {restaurant.cuisines.join(' • ')}
                </span>
                <span className="text-xs text-slate-200 font-bold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700">
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

      {/* Info Card Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="white-card p-5 flex flex-wrap items-center justify-between gap-4 border border-emerald-100 shadow-md">
          <div className="flex items-center gap-6 divide-x divide-slate-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              <div>
                <span className="text-base font-black text-slate-900">{restaurant.rating}</span>
                <span className="text-xs text-slate-500 font-bold block">({restaurant.reviewCount} ratings)</span>
              </div>
            </div>

            <div className="pl-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-base font-black text-slate-900">{restaurant.deliveryTime}</span>
                <span className="text-xs text-slate-500 font-bold block">Est. Delivery</span>
              </div>
            </div>

            <div className="pl-6 flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-base font-black text-slate-900">
                  {restaurant.deliveryFee === 0 ? 'FREE' : `$${restaurant.deliveryFee.toFixed(2)}`}
                </span>
                <span className="text-xs text-slate-500 font-bold block">Delivery Fee</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-2xl">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
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
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'green-button shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
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
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 white-card border border-emerald-100">
            <p className="text-slate-500 font-bold text-sm">
              No menu items match your search. Try adjusting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => onSelectDish(dish)}
                className="group white-card white-card-hover p-5 border border-emerald-100 cursor-pointer flex justify-between gap-4 bg-white"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {dish.isPopular && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg green-pill text-[10px] font-black">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Popular</span>
                        </span>
                      )}
                      {dish.isSpicy && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-[10px] font-black">
                          <Flame className="w-3 h-3 text-red-500" />
                          <span>Spicy</span>
                        </span>
                      )}
                      {dish.isVegetarian && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                          <Leaf className="w-3 h-3 text-emerald-600" />
                          <span>Veg</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium">
                      {dish.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
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
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-2xl green-button text-xs font-black cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{dish.optionGroups ? 'Customize' : 'Add'}</span>
                    </button>
                  </div>
                </div>

                {/* Dish Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-200">
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



