import React from 'react';
import { Tag, Sparkles, ArrowRight, Zap } from 'lucide-react';

interface PromoBannersProps {
  onApplyPromoClick?: (code: string) => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ onApplyPromoClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      
      {/* Banner 1: 20% Off First Order */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-6 shadow-md shadow-orange-500/10 flex items-center justify-between group">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <div className="relative z-10 max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>Welcome Offer</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-tight mb-1">
            20% OFF First Order
          </h3>
          <p className="text-xs text-orange-100 font-medium mb-4">
            Use promo code <span className="font-bold underline decoration-amber-300">SAVE20</span> at checkout.
          </p>
          <button
            onClick={() => onApplyPromoClick && onApplyPromoClick('SAVE20')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-orange-600 text-xs font-bold hover:bg-orange-50 transition-colors cursor-pointer shadow-xs"
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 text-white p-6 shadow-md flex items-center justify-between group">
        <div className="absolute -left-8 -top-8 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        <div className="relative z-10 max-w-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold tracking-wide uppercase mb-3">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Express Delivery</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight leading-tight mb-1">
            $0 Delivery Fee
          </h3>
          <p className="text-xs text-slate-300 font-medium mb-4">
            On all featured local spots with orders over $15.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold">
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
