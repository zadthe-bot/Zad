import React from 'react';
import { CuisineCategory } from '../types';

interface CategoryFilterProps {
  categories: CuisineCategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto py-2.5 px-1 scrollbar-none flex items-center gap-3">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? 'green-button scale-102 shadow-md'
                : 'bg-white text-slate-800 border border-slate-300 hover:border-emerald-900 hover:text-emerald-950 shadow-xs'
            }`}
          >
            <span className="text-base leading-none">{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
