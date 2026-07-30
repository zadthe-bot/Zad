import React, { useState } from 'react';
import { X, MapPin, Navigation, Loader2, Globe, Check, Compass, Map as MapIcon } from 'lucide-react';
import { getCurrentGpsLocation } from '../lib/locationService';
import { MapLocationPicker } from './MapLocationPicker';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (addr: string, lat?: number, lng?: number) => void;
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
  const [activeTab, setActiveTab] = useState<'map' | 'presets'>('map');
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
        onSelectAddress(gps.addressName, gps.lat, gps.lng);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message || 'GPS location detection failed.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="white-card p-5 sm:p-6 max-w-lg w-full shadow-2xl relative text-slate-800 border border-emerald-100 bg-white rounded-3xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Delivery Location</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Pin your exact delivery location on the map or choose a city
        </p>

        {/* Tab Selection */}
        <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 border border-slate-200">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>OpenFreeMap Pin</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Quick Cities &amp; GPS</span>
          </button>
        </div>

        {activeTab === 'map' ? (
          <div>
            <MapLocationPicker
              onConfirmLocation={(address, lat, lng) => {
                onSelectAddress(address, lat, lng);
                onClose();
              }}
            />
          </div>
        ) : (
          <div>
            {/* GPS Location Auto-Detector Button */}
            <div className="mb-5">
              <button
                onClick={handleGpsClick}
                disabled={isDetectingGps}
                className="w-full flex items-center justify-between p-4 rounded-2xl green-button font-black text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
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
                    <span className="block font-black text-sm text-white">Use My Current GPS Location</span>
                    <span className="text-[10px] text-emerald-100 font-medium">
                      Detect nearby food spots around your device
                    </span>
                  </div>
                </div>
              </button>
              {errorMsg && (
                <p className="mt-2 text-[11px] text-red-500 font-medium bg-red-50 p-2 rounded-xl border border-red-200">
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Location Presets */}
            <div className="space-y-2.5 mb-5">
              <p className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">
                Quick Cities &amp; Regions
              </p>
              {REGIONAL_PRESETS.map((preset) => {
                const Icon = preset.icon;
                const isSelected =
                  currentAddress.toLowerCase().includes(preset.id) || currentAddress === preset.address;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectAddress(preset.address);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'green-pill border-emerald-300 text-slate-900 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{preset.label}</span>
                          {preset.badge && (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase">
                              {preset.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{preset.address}</span>
                      </div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Address Input */}
            <form onSubmit={handleCustomSubmit} className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Or type any city or street address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Iringa, Tanzania or Mkwawa Road"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 green-button text-xs font-bold rounded-xl cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};


