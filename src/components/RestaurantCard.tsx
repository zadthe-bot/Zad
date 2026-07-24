import React from 'react';
import { Star, Clock, Bike, Heart } from 'lucide-react';
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
      className="group clay-card overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Banner Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-900/20" />

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(restaurant.id, e)}
            className="absolute top-3.5 right-3.5 p-2.5 rounded-full clay-pill text-slate-700 hover:text-red-500 transition-all z-10 cursor-pointer active:scale-90"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        )}

        {/* Tag Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          {restaurant.isFeatured && (
            <span className="px-3 py-1 rounded-2xl clay-button-orange text-[11px] font-black">
              ★ Top Pick
            </span>
          )}
          {restaurant.isFreeDelivery && (
            <span className="px-3 py-1 rounded-2xl bg-emerald-600 text-white text-[11px] font-black shadow-md border border-white/30">
              Free Delivery
            </span>
          )}
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-4 left-4 rounded-2xl overflow-hidden w-13 h-13 shadow-[4px_4px_10px_rgba(0,0,0,0.3)] border-2 border-white bg-white">
          <img
            src={restaurant.logoImage}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 pt-7 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-lg font-black text-slate-950 group-hover:text-orange-600 transition-colors leading-snug">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl clay-pill text-xs font-black shrink-0 text-slate-900">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{restaurant.rating}</span>
              <span className="text-slate-500 font-bold">({restaurant.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-600 line-clamp-2 mb-4">
            {restaurant.tagline}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-extrabold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>{restaurant.deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {restaurant.deliveryFee === 0 ? (
                <span className="text-emerald-600 font-black">FREE</span>
              ) : (
                `$${restaurant.deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded-lg bg-slate-200/60 text-slate-900 text-[11px] font-black">
            {restaurant.priceRange}
          </div>
        </div>

      </div>
    </div>
  );
};

