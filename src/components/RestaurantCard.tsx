import React from 'react';
import { Star, Clock, DollarSign, Bike, Heart } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-orange-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Banner Image & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(restaurant.id, e)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-slate-700 hover:text-red-500 transition-colors shadow-xs z-10 cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        )}

        {/* Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {restaurant.isFeatured && (
            <span className="px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold shadow-xs">
              Top Pick
            </span>
          )}
          {restaurant.isFreeDelivery && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-xs">
              Free Delivery
            </span>
          )}
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-4 left-4 border-2 border-white rounded-2xl overflow-hidden w-12 h-12 shadow-md bg-white">
          <img
            src={restaurant.logoImage}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 pt-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating}</span>
              <span className="text-slate-400 font-normal">({restaurant.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {restaurant.tagline}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{restaurant.deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {restaurant.deliveryFee === 0 ? (
                <span className="text-emerald-600 font-bold">FREE</span>
              ) : (
                `$${restaurant.deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="text-slate-500 font-semibold">
            {restaurant.priceRange}
          </div>
        </div>

      </div>
    </div>
  );
};
