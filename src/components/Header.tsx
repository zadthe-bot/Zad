import React from 'react';
import { MapPin, Search, ShoppingBag, Code, ChevronDown, Clock, Smartphone, Database } from 'lucide-react';
import { ActiveTab } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

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
  onOpenSupabaseModal: () => void;
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
  onOpenSupabaseModal,
  activeOrderCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f0f3f8]/90 backdrop-blur-md border-b border-white/60 shadow-[0_4px_16px_rgba(208,215,226,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => onTabChange('explore')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-[4px_4px_10px_rgba(240,78,14,0.35),-2px_-2px_6px_rgba(255,255,255,0.8)] border border-white/30 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-black tracking-tighter">Q</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black tracking-tight text-slate-950 block leading-none">
                  Quick<span className="text-orange-600">Bite</span>
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mt-0.5">
                  Clay Express
                </span>
              </div>
            </button>

            {/* Address Switcher - Inset Clay Well */}
            <button
              onClick={onOpenAddressModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl clay-input hover:border-orange-300 transition-colors cursor-pointer text-xs sm:text-sm text-slate-800 font-bold max-w-[180px] sm:max-w-[240px] truncate"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="truncate">{currentAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            </button>
          </div>

          {/* Search Bar - Inset Clay Input */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search pizza, sushi, burgers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl clay-input text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Supabase Button */}
            <button
              onClick={onOpenSupabaseModal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isSupabaseConfigured
                  ? 'bg-emerald-600 text-white shadow-[3px_3px_8px_rgba(16,185,129,0.35)]'
                  : 'clay-pill text-slate-800 hover:text-emerald-700'
              }`}
              title="Supabase Database Settings"
            >
              <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-white' : 'text-emerald-600'}`} />
              <span className="hidden md:inline">
                {isSupabaseConfigured ? 'Supabase' : 'Supabase (Demo)'}
              </span>
            </button>

            {/* Mobile App conversion button */}
            <button
              onClick={onOpenMobileExportModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl clay-button-black text-xs font-extrabold cursor-pointer"
              title="Learn how to turn this TSX code into an iOS / Android App"
            >
              <Smartphone className="w-4 h-4 text-orange-400" />
              <span className="hidden lg:inline">Mobile App</span>
            </button>

            {/* YAML Spec Button */}
            <button
              onClick={onOpenYamlModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl clay-pill text-slate-800 hover:text-orange-600 text-xs font-bold transition-colors cursor-pointer"
              title="View & Edit App Architecture Specs (YAML)"
            >
              <Code className="w-3.5 h-3.5 text-orange-600" />
              <span>YAML Spec</span>
            </button>

            {/* Active Orders Tracker Toggle */}
            <button
              onClick={() => onTabChange('orders')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'orders' ? 'clay-pill-active' : 'clay-pill text-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 text-orange-500" />
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
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl clay-button-orange text-sm font-bold cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-2 py-0.5 bg-black text-white rounded-full text-xs font-black shadow-xs">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl clay-input text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

      </div>
    </header>
  );
};

