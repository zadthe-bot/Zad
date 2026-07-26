import React from 'react';
import { Star, Clock, Bike, Heart } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect?: (restaurant: Restaurant) => void;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  onClick,
  isFavorite,
  onToggleFavorite,
}) => {
  const handleClick = () => {
    if (onSelect) onSelect(restaurant);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="group dark-card dark-card-hover overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full border border-slate-800/80"
    >
      {/* Banner Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121824] via-transparent to-black/40" />

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(restaurant.id, e)}
            className="absolute top-3.5 right-3.5 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-red-500 transition-all z-10 cursor-pointer active:scale-90 border border-slate-700/60"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        )}

        {/* Tag Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          {restaurant.isFeatured && (
            <span className="px-3 py-1 rounded-2xl orange-button text-[11px] font-black">
              ★ Top Pick
            </span>
          )}
          {restaurant.isFreeDelivery && (
            <span className="px-3 py-1 rounded-2xl bg-emerald-500/90 text-white text-[11px] font-black shadow-md border border-emerald-400/30">
              Free Delivery
            </span>
          )}
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-4 left-4 rounded-2xl overflow-hidden w-13 h-13 shadow-xl border-2 border-orange-500/80 bg-slate-900">
          <img
            src={restaurant.logoImage}
            alt={restaurant.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 pt-7 flex-1 flex flex-col justify-between text-slate-100">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors leading-snug">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-xs font-black shrink-0 text-orange-400">
              <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{restaurant.rating}</span>
              <span className="text-slate-400 font-bold">({restaurant.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs font-medium text-slate-400 line-clamp-2 mb-4">
            {restaurant.tagline}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>{restaurant.deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {restaurant.deliveryFee === 0 ? (
                <span className="text-emerald-400 font-black">FREE</span>
              ) : (
                `$${restaurant.deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="px-2 py-0.5 rounded-lg minimal-grey-pill text-slate-300 text-[11px] font-bold">
            {restaurant.priceRange}
          </div>
        </div>

      </div>
    </div>
  );
};


