import React from 'react';
import { MapPin, Search, ShoppingBag, Code, ChevronDown, Clock, Smartphone, Flame } from 'lucide-react';
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
  onOpenMobileExportModal: () => void;
  onOpenFirebaseModal: () => void;
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
  onOpenMobileExportModal,
  onOpenFirebaseModal,
  activeOrderCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => onTabChange('explore')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-[0_4px_16px_rgba(249,115,22,0.4)] border border-orange-400/30 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-black tracking-tighter">Q</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black tracking-tight text-white block leading-none">
                  Quick<span className="text-orange-500">Bite</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                  Dark Luxury Express
                </span>
              </div>
            </button>

            {/* Address Switcher - Minimal Grey Input */}
            <button
              onClick={onOpenAddressModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl minimal-grey-input hover:border-orange-500/50 transition-colors cursor-pointer text-xs sm:text-sm text-slate-200 font-bold max-w-[180px] sm:max-w-[240px] truncate"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">{currentAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Search Bar - Minimal Grey Input */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search pizza, sushi, burgers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl minimal-grey-input text-sm font-medium focus:outline-none focus:border-orange-500/80 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Firebase Active Button */}
            <button
              onClick={onOpenFirebaseModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30 text-xs font-bold hover:bg-orange-500/25 transition-all cursor-pointer shadow-[0_0_12px_rgba(249,115,22,0.15)]"
              title="Firebase Database Connected"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="hidden md:inline">Firebase DB</span>
            </button>

            {/* Mobile App conversion button */}
            <button
              onClick={onOpenMobileExportModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl minimal-grey-pill text-slate-200 text-xs font-extrabold hover:text-orange-400 transition-colors cursor-pointer"
              title="Learn how to turn this TSX code into an iOS / Android App"
            >
              <Smartphone className="w-4 h-4 text-orange-400" />
              <span className="hidden lg:inline">Mobile App</span>
            </button>

            {/* YAML Spec Button */}
            <button
              onClick={onOpenYamlModal}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl minimal-grey-pill text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              title="View & Edit App Architecture Specs (YAML)"
            >
              <Code className="w-3.5 h-3.5 text-orange-400" />
              <span>YAML Spec</span>
            </button>

            {/* Active Orders Tracker Toggle */}
            <button
              onClick={() => onTabChange('orders')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'orders' 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                  : 'minimal-grey-pill text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Orders</span>
              {activeOrderCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white shadow-xs">
                  {activeOrderCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl orange-button text-sm font-bold cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-2 py-0.5 bg-black/40 text-white rounded-full text-xs font-black">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl minimal-grey-input text-sm text-slate-200 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};


