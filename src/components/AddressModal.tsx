import React, { useState } from 'react';
import { X, MapPin, Navigation, Loader2, Globe, Check, Compass } from 'lucide-react';
import { getCurrentGpsLocation } from '../lib/locationService';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (addr: string) => void;
  onDetectGpsLocation?: () => void;
  isDetectingGps?: boolean;
}

const REGIONAL_PRESETS = [
  { id: 'iringa', label: 'Iringa Centre, Tanzania', address: 'Iringa, Tanzania', icon: MapPin, badge: 'Popular' },
  { id: 'dar', label: 'Dar es Salaam, Tanzania', address: 'Dar es Salaam, Tanzania', icon: Globe },
  { id: 'nairobi', label: 'Nairobi, Kenya', address: 'Nairobi, Kenya', icon: Globe },
  { id: 'sf', label: 'San Francisco, CA', address: 'San Francisco, CA', icon: Globe },
];

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
  onDetectGpsLocation,
  isDetectingGps = false,
}) => {
  const [customInput, setCustomInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onSelectAddress(customInput.trim());
    onClose();
  };

  const handleGpsClick = async () => {
    setErrorMsg(null);
    if (onDetectGpsLocation) {
      onDetectGpsLocation();
      onClose();
    } else {
      try {
        const gps = await getCurrentGpsLocation();
        onSelectAddress(gps.addressName);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message || 'GPS location detection failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="dark-card p-6 max-w-md w-full shadow-2xl relative text-slate-100 border border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-bold text-white">Delivery Location &amp; GPS</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Detect your GPS location or select a city to find real nearby restaurants
        </p>

        {/* GPS Location Auto-Detector Button */}
        <div className="mb-5">
          <button
            onClick={handleGpsClick}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-xs shadow-lg shadow-orange-500/25 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                {isDetectingGps ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Navigation className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="text-left">
                <span className="block font-black text-sm">Use My Current GPS Location</span>
                <span className="text-[10px] text-orange-100 font-medium">
                  Find real restaurants near your exact position
                </span>
              </div>
            </div>
          </button>
          {errorMsg && (
            <p className="mt-2 text-[11px] text-red-400 font-medium bg-red-500/10 p-2 rounded-xl border border-red-500/20">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Location Presets */}
        <div className="space-y-2.5 mb-5">
          <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
            Quick Cities &amp; Regions
          </p>
          {REGIONAL_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = currentAddress.toLowerCase().includes(preset.id) || currentAddress === preset.address;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectAddress(preset.address);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500/50 text-white shadow-2xs'
                    : 'bg-[#121824] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{preset.label}</span>
                      {preset.badge && (
                        <span className="px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase">
                          {preset.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{preset.address}</span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-orange-400 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Custom Address Input */}
        <form onSubmit={handleCustomSubmit} className="pt-4 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            Or type any city or street address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Iringa, Tanzania or Mkwawa Road"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl minimal-grey-input focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 orange-button text-xs font-bold rounded-xl cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
