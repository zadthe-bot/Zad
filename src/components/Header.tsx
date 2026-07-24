import React from 'react';
import { MapPin, Search, ShoppingBag, Code, ChevronDown, Clock, Heart } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  currentAddress: string;
  onOpenAddressModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenYamlModal: () => void;
  activeOrderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentAddress,
  onOpenAddressModal,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  activeTab,
  onTabChange,
  onOpenYamlModal,
  activeOrderCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onTabChange('explore')}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl font-black tracking-tight">Q</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                  Quick<span className="text-orange-600">Bite</span>
                </span>
                <span className="text-[10px] font-medium text-slate-600 uppercase tracking-wider block">
                  Food Express
                </span>
              </div>
            </button>

            {/* Address Switcher */}
            <button
              onClick={onOpenAddressModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer text-xs sm:text-sm text-slate-700 font-medium max-w-[200px] sm:max-w-[260px] truncate"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">{currentAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes, sushi, pizza, or restaurants..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 border border-transparent focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Spec / YAML Export Button */}
            <button
              onClick={onOpenYamlModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
              title="View & Edit App Architecture Specs (YAML)"
            >
              <Code className="w-3.5 h-3.5 text-orange-600" />
              <span>YAML Spec</span>
            </button>

            {/* Active Orders Tracker Toggle */}
            <button
              onClick={() => onTabChange('orders')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
              {activeOrderCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white">
                  {activeOrderCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-sm shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 bg-white text-orange-600 rounded-full text-xs font-bold shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Search Input - Mobile */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes or restaurants..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 text-sm text-slate-800 placeholder-slate-400 border border-transparent focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
