import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { CartItem, Restaurant } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurant: Restaurant | null;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onCheckout: (subtotal: number, deliveryFee: number, tax: number, tip: number, discount: number, total: number) => void;
  appliedPromoCode: string;
  onApplyPromo: (code: string) => boolean;
  currentAddress: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  restaurant,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  appliedPromoCode,
  onApplyPromo,
  currentAddress,
}) => {
  const [promoInput, setPromoInput] = useState<string>(appliedPromoCode);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>(appliedPromoCode ? '20% OFF Applied' : '');
  const [tipAmount, setTipAmount] = useState<number>(3.0);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = restaurant ? restaurant.deliveryFee : 0;
  const tax = subtotal * 0.0825; // 8.25% sales tax
  const discount = appliedPromoCode === 'SAVE20' ? subtotal * 0.2 : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax + tipAmount - discount);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoSuccess('20% discount code applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try "SAVE20"');
      setPromoSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0f17] border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#121824]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold text-white">Your Cart</h2>
              {items.length > 0 && (
                <span className="px-2.5 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full">
                  {items.length} items
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-orange-500/15 flex items-center justify-center text-orange-500 mb-4 border border-orange-500/30">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Browse our featured restaurants and add delicious dishes to start your order.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full orange-button font-bold text-xs cursor-pointer"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Restaurant Header */}
              {restaurant && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121824] border border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={restaurant.logoImage}
                      alt={restaurant.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-2xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{restaurant.name}</h4>
                      <p className="text-[11px] text-slate-400">Delivering to {currentAddress}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClearCart}
                    className="text-[11px] font-bold text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 pb-4 border-b border-slate-800/80 last:border-0"
                  >
                    <img
                      src={item.dish.image}
                      alt={item.dish.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-800"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h5 className="text-sm font-bold text-white leading-snug">
                            {item.dish.name}
                          </h5>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-slate-500 hover:text-red-400 cursor-pointer p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected options tags */}
                        {item.selectedOptions.length > 0 && (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {item.selectedOptions.map((o) => o.optionName).join(', ')}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[10px] italic text-orange-400 mt-0.5">
                            "{item.specialInstructions}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-black text-white">
                          ${item.totalPrice.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2 border border-slate-800 rounded-full px-2.5 py-0.5 bg-[#121824]">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                            className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white min-w-3 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                            className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Courier Tip Selection */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">Courier Tip</span>
                  <span className="text-xs text-orange-400 font-bold">${tipAmount.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[2.0, 3.0, 5.0, 7.0].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        tipAmount === amount
                          ? 'orange-button shadow-xs'
                          : 'minimal-grey-pill text-slate-300 hover:text-white'
                      }`}
                    >
                      ${amount.toFixed(0)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="pt-2 border-t border-slate-800">
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo Code (SAVE20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl minimal-grey-input uppercase font-semibold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 orange-button text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </form>
                {promoError && (
                  <p className="text-[11px] font-semibold text-red-400 mt-1">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{promoSuccess}</span>
                  </p>
                )}
              </div>

              {/* Price Summary Breakdown */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-white">
                    {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-white">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount (SAVE20)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-orange-400">${total.toFixed(2)}</span>
                </div>
              </div>

            </div>
          )}

          {/* Checkout Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#121824] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Firestore Sync 1-Click Order</span>
                </span>
                <span className="font-semibold text-slate-300">~20-30 min delivery</span>
              </div>

              <button
                onClick={() => {
                  onCheckout(subtotal, deliveryFee, tax, tipAmount, discount, total);
                  onClose();
                }}
                className="w-full py-3.5 px-6 rounded-2xl orange-button font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center justify-between transition-all cursor-pointer active:scale-98"
              >
                <span>Place Order • ${total.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

