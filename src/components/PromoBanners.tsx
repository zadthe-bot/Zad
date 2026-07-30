import React from 'react';
import { Tag, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface PromoBannersProps {
  onApplyPromoClick?: (code: string) => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ onApplyPromoClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      
      {/* Banner 1: 20% Off First Order */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-600 text-white p-6 shadow-md flex items-center justify-between group">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <div className="relative z-10 max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold tracking-wide uppercase mb-3 text-white">
            <Sparkles className="w-3 h-3 text-emerald-100" />
            <span>Welcome Offer</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-tight mb-1 text-white">
            20% OFF First Order
          </h3>
          <p className="text-xs text-emerald-100 font-medium mb-4">
            Use promo code <span className="font-bold underline decoration-white">SAVE20</span> at checkout.
          </p>
          <button
            onClick={() => onApplyPromoClick && onApplyPromoClick('SAVE20')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-700 text-xs font-bold hover:bg-emerald-50 transition-colors cursor-pointer shadow-sm"
          >
            <span>Apply Coupon</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="relative z-10 hidden sm:block shrink-0">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80"
            alt="Pizza promo"
            referrerPolicy="no-referrer"
            className="w-28 h-28 object-cover rounded-2xl shadow-lg rotate-3 group-hover:rotate-6 transition-transform"
          />
        </div>
      </div>

      {/* Banner 2: Free Delivery */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-900 text-white p-6 shadow-md flex items-center justify-between group border border-emerald-800">
        <div className="absolute -left-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <div className="relative z-10 max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold tracking-wide uppercase mb-3">
            <Zap className="w-3 h-3 text-emerald-300" />
            <span>Express Delivery</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-tight mb-1 text-white">
            $0 Delivery Fee
          </h3>
          <p className="text-xs text-emerald-100 font-medium mb-4">
            On all featured local spots with orders over $15.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>Auto-applied on qualifying orders</span>
          </div>
        </div>
        <div className="relative z-10 hidden sm:block shrink-0">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
            alt="Burger promo"
            referrerPolicy="no-referrer"
            className="w-28 h-28 object-cover rounded-2xl shadow-lg -rotate-3 group-hover:-rotate-6 transition-transform"
          />
        </div>
      </div>

    </div>
  );
};

