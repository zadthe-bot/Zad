import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Layers, Database, Shield, Server } from 'lucide-react';

interface YamlSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_YAML_SPEC = `app:
  name: "QuickBite Food Delivery"
  version: "1.0.0"
  description: "On-demand food delivery app prototype with menu browsing, dish customization, cart checkout & live GPS tracking."
  theme:
    primaryColor: "#f97316" # Orange-500
    secondaryColor: "#0f172a" # Slate-900
    fontFamily: "Plus Jakarta Sans"

models:
  Restaurant:
    id: string
    name: string
    cuisines: list[string]
    rating: float
    deliveryTime: string
    deliveryFee: float
    bannerImage: url
    logoImage: url
    address: string

  Dish:
    id: string
    restaurantId: reference(Restaurant)
    name: string
    description: string
    price: float
    category: string
    isPopular: boolean
    optionGroups: list[OptionGroup]

  CartItem:
    cartItemId: string
    dishId: string
    quantity: int
    selectedOptions: list[Option]
    specialInstructions: string

  Order:
    id: string
    userId: string
    restaurantId: string
    items: list[CartItem]
    subtotal: float
    deliveryFee: float
    tax: float
    tip: float
    total: float
    status: enum["confirmed", "preparing", "picked_up", "on_the_way", "delivered"]
    driverInfo: Driver

features:
  - name: "Restaurant Discovery"
    enabled: true
    filters: ["cuisine", "rating", "deliveryFee", "search"]

  - name: "Dish Customization"
    enabled: true
    allowsToppings: true
    allowsSpecialNotes: true

  - name: "Live Order Tracking"
    enabled: true
    realtimeGps: true
    driverContact: ["call", "in_app_chat"]

  - name: "Payments & Checkout"
    enabled: true
    providers: ["stripe", "apple_pay", "cash_on_delivery"]
    tippingOptions: [2.0, 3.0, 5.0, 7.0]

services:
  database: "Firestore / PostgreSQL"
  auth: "Firebase Authentication"
  maps: "Google Maps Platform (Routes & Places API)"
  notifications: "Push Notifications (FCM)"
`;

export const YamlSpecModal: React.FC<YamlSpecModalProps> = ({ isOpen, onClose }) => {
  const [yamlContent, setYamlContent] = useState<string>(DEFAULT_YAML_SPEC);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quickbite-food-delivery-spec.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-950 text-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-800">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">App Architecture Specification (YAML)</h3>
              <p className="text-xs text-slate-400">View, edit, or copy the application definition format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy YAML'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-semibold text-white transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .yml</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950">
          <textarea
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
            className="w-full h-96 p-4 rounded-xl bg-slate-900 text-amber-200/90 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none focus:border-orange-500 resize-none selection:bg-orange-500/30"
            spellCheck={false}
          />
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>Ready for full-stack build deployment</span>
          </span>
          <span>QuickBite Specification v1.0</span>
        </div>

      </div>
    </div>
  );
};
