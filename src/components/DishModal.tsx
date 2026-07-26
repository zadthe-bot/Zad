import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Dish, SelectedOption } from '../types';

interface DishModalProps {
  dish: Dish | null;
  isOpen?: boolean;
  onClose: () => void;
  onAddToCart: (
    dish: Dish,
    quantity: number,
    selectedOptions: SelectedOption[],
    specialInstructions: string
  ) => void;
}

export const DishModal: React.FC<DishModalProps> = ({ dish, isOpen = true, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(() => {
    const defaults: SelectedOption[] = [];
    if (dish && dish.optionGroups) {
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

  useEffect(() => {
    if (dish) {
      setQuantity(1);
      setInstructions('');
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
      setSelectedOptions(defaults);
    }
  }, [dish]);

  if (!isOpen || !dish) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg dark-card overflow-hidden flex flex-col max-h-[90vh] border border-slate-800 text-slate-100">
        
        {/* Header Banner */}
        <div className="relative h-52 sm:h-60 w-full bg-slate-900 shrink-0">
          <img
            src={dish.image}
            alt={dish.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-transform active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-black text-white">{dish.name}</h2>
              <span className="text-xl font-black text-orange-400">${dish.price.toFixed(2)}</span>
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1">{dish.description}</p>
          </div>

          {/* Option Groups */}
          {dish.optionGroups &&
            dish.optionGroups.map((group) => (
              <div key={group.id} className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-white">{group.title}</h3>
                  <span className="text-[11px] font-bold text-slate-400">
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
                            ? 'bg-orange-500/15 border border-orange-500/50 text-white'
                            : 'minimal-grey-pill text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-orange-500 border-orange-500 text-white'
                                : 'border-slate-500'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        {opt.price > 0 && (
                          <span className={isSelected ? 'text-orange-400 font-extrabold' : 'text-slate-400 font-extrabold'}>
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
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-extrabold text-slate-200 mb-2">
              Special Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Extra dressing on the side, no onions..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3.5 rounded-2xl minimal-grey-input text-xs font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#0e1420] border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 minimal-grey-pill px-4 py-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 text-slate-400 hover:text-white cursor-pointer disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black text-white min-w-4 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
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
            className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-2xl orange-button font-black text-sm cursor-pointer active:scale-98"
          >
            <span>Add to Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>

        </div>

      </div>
    </div>
  );
};


