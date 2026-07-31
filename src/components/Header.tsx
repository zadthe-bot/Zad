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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => onTabChange('explore')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-950 flex items-center justify-center text-white shadow-md border border-slate-900 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-black tracking-tighter text-white">Q</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">
                  Quick<span className="text-emerald-900">Bite</span>
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-0.5">
                  Fresh Food Express
                </span>
              </div>
            </button>

            {/* Address Switcher */}
            <button
              onClick={onOpenAddressModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-300 hover:border-emerald-900 transition-colors cursor-pointer text-xs sm:text-sm text-slate-900 font-extrabold max-w-[180px] sm:max-w-[240px] truncate shadow-xs"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-emerald-900 shrink-0" />
              <span className="truncate text-slate-900">{currentAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search dishes or restaurants..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-emerald-900 focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Firebase Active Button */}
            <button
              onClick={onOpenFirebaseModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold hover:border-emerald-900 transition-all cursor-pointer shadow-xs"
              title="Firebase Database Connected"
            >
              <Flame className="w-4 h-4 text-emerald-900 fill-emerald-900" />
              <span className="hidden md:inline">Firebase DB</span>
            </button>

            {/* Mobile App conversion button */}
            <button
              onClick={onOpenMobileExportModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 text-slate-800 border border-slate-300 text-xs font-extrabold hover:text-emerald-900 hover:border-emerald-900 transition-colors cursor-pointer shadow-xs"
              title="Learn how to turn this TSX code into an iOS / Android App"
            >
              <Smartphone className="w-4 h-4 text-emerald-900" />
              <span className="hidden lg:inline">Mobile App</span>
            </button>

            {/* YAML Spec Button */}
            <button
              onClick={onOpenYamlModal}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 text-slate-800 border border-slate-300 hover:text-emerald-900 hover:border-emerald-900 text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
              title="View & Edit App Architecture Specs (YAML)"
            >
              <Code className="w-3.5 h-3.5 text-emerald-900" />
              <span>YAML Spec</span>
            </button>

            {/* Active Orders Tracker Toggle */}
            <button
              onClick={() => onTabChange('orders')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === 'orders' 
                  ? 'bg-emerald-950 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-800 border border-slate-300 hover:text-emerald-900 hover:border-emerald-900 shadow-xs'
              }`}
            >
              <Clock className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-emerald-900'}`} />
              <span className="hidden sm:inline">Orders</span>
              {activeOrderCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white shadow-xs">
                  {activeOrderCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl green-button text-sm font-black cursor-pointer shadow-md"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-white">Cart</span>
              {cartCount > 0 && (
                <span className="ml-0.5 px-2 py-0.5 bg-slate-900 text-white rounded-full text-xs font-black">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-900"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
