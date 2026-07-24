import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Dish, SelectedOption } from '../types';

interface DishModalProps {
  dish: Dish;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    quantity: number,
    selectedOptions: SelectedOption[],
    specialInstructions: string
  ) => void;
}

export const DishModal: React.FC<DishModalProps> = ({ dish, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(() => {
    // Default required options to the first choice
    const defaults: SelectedOption[] = [];
    if (dish.optionGroups) {
      dish.optionGroups.forEach((group) => {
        if (group.required && group.options.length > 0) {
          const first = group.options[0];
          defaults.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: first.id,
            optionName: first.name,
            price: first.price,
          });
        }
      });
    }
    return defaults;
  });
  const [instructions, setInstructions] = useState<string>('');

  const handleToggleOption = (
    groupId: string,
    groupTitle: string,
    optionId: string,
    optionName: string,
    price: number,
    isRequired: boolean
  ) => {
    if (isRequired) {
      // Replace choice for required group
      setSelectedOptions((prev) => [
        ...prev.filter((opt) => opt.groupId !== groupId),
        { groupId, groupTitle, optionId, optionName, price },
      ]);
    } else {
      // Toggle choice for optional group
      const exists = selectedOptions.some((opt) => opt.optionId === optionId);
      if (exists) {
        setSelectedOptions((prev) => prev.filter((opt) => opt.optionId !== optionId));
      } else {
        setSelectedOptions((prev) => [
          ...prev,
          { groupId, groupTitle, optionId, optionName, price },
        ]);
      }
    }
  };

  const optionsExtraPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const unitPrice = dish.price + optionsExtraPrice;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg clay-card overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className="relative h-52 sm:h-60 w-full bg-slate-200 shrink-0">
          <img
            src={dish.image}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full clay-pill text-slate-900 transition-transform active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-black text-slate-950">{dish.name}</h2>
              <span className="text-xl font-black text-orange-600">${dish.price.toFixed(2)}</span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1">{dish.description}</p>
          </div>

          {/* Option Groups */}
          {dish.optionGroups &&
            dish.optionGroups.map((group) => (
              <div key={group.id} className="pt-4 border-t border-slate-300/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-950">{group.title}</h3>
                  <span className="text-[11px] font-bold text-slate-500">
                    {group.required ? 'Required' : 'Optional'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {group.options.map((opt) => {
                    const isSelected = selectedOptions.some((s) => s.optionId === opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() =>
                          handleToggleOption(
                            group.id,
                            group.title,
                            opt.id,
                            opt.name,
                            opt.price,
                            group.required
                          )
                        }
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'clay-pill-active'
                            : 'clay-pill text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        {opt.price > 0 && (
                          <span className={isSelected ? 'text-orange-400 font-extrabold' : 'text-slate-600 font-extrabold'}>
                            +${opt.price.toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special Instructions */}
          <div className="pt-4 border-t border-slate-300/60">
            <label className="block text-xs font-extrabold text-slate-950 mb-2">
              Special Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Extra dressing on the side, no onions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3.5 rounded-2xl clay-input text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#f0f3f8] border-t border-slate-300/60 flex items-center justify-between gap-4 shrink-0">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 clay-pill px-4 py-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 text-slate-700 hover:text-black cursor-pointer disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-slate-950 min-w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 text-slate-700 hover:text-black cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={() => {
              onAddToCart(dish, quantity, selectedOptions, instructions);
              onClose();
            }}
            className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-2xl clay-button-orange font-black text-sm cursor-pointer active:scale-98"
          >
            <span>Add to Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>

        </div>

      </div>
    </div>
  );
};

