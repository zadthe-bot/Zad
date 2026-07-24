import React, { useState } from 'react';
import { X, MapPin, Building, Home, Briefcase, Plus, Check } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onSelectAddress: (addr: string) => void;
}

const PRESET_ADDRESSES = [
  { id: 'addr-1', label: 'Home', address: '742 Evergreen Terrace, San Francisco, CA', icon: Home },
  { id: 'addr-2', label: 'Work', address: '101 Market Street, Floor 14, San Francisco, CA', icon: Briefcase },
  { id: 'addr-3', label: 'Gym', address: '304 Mission Street, Fitness Hub, San Francisco, CA', icon: Building },
];

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}) => {
  const [customInput, setCustomInput] = useState<string>('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onSelectAddress(customInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-slate-900">Delivery Address</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">Select where you want your food delivered</p>

        {/* Address presets */}
        <div className="space-y-3 mb-6">
          {PRESET_ADDRESSES.map((preset) => {
            const Icon = preset.icon;
            const isSelected = currentAddress === preset.address;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  onSelectAddress(preset.address);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 text-slate-900 shadow-2xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-900">{preset.label}</span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{preset.address}</span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-orange-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Custom Address Input */}
        <form onSubmit={handleCustomSubmit} className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Or enter new address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 500 Howard St, San Francisco"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
            >
              Set
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
