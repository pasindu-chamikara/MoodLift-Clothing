"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export interface FilterState {
  inStock: boolean;
  outOfStock: boolean;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
}

export const defaultFilters: FilterState = {
  inStock: false,
  outOfStock: false,
  minPrice: 0,
  maxPrice: 99999,
  sizes: [],
  colors: []
};

interface FilterDrawerProps {
  onApply?: (filters: FilterState) => void;
}

export function FilterDrawer({ onApply }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const handleSizeToggle = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleApply = () => {
    if (onApply) {
      onApply(filters);
    }
    setOpen(false);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    if (onApply) {
      onApply(defaultFilters);
    }
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-black transition-colors hover:text-brand-luxury">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filters
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader className="mb-6 flex flex-row items-center justify-between border-b pb-4">
          <SheetTitle className="text-xl font-serif text-brand-primary">Filters</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-8 pb-12">
          
          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-primary">Availability</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                  id="in-stock" 
                  className="rounded-none border-gray-300"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, inStock: !!checked }))}
                />
                <span className="text-sm text-gray-600 group-hover:text-black">In stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                  id="out-of-stock" 
                  className="rounded-none border-gray-300"
                  checked={filters.outOfStock}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, outOfStock: !!checked }))}
                />
                <span className="text-sm text-gray-600 group-hover:text-black">Out of stock</span>
              </label>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-primary">Price</h3>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1 w-full">
                <span className="text-xs text-gray-500">From</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₨</span>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="pl-8 rounded-none border-gray-300"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-end pb-2">
                <span className="text-gray-400">-</span>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <span className="text-xs text-gray-500">To</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₨</span>
                  <Input 
                    type="number" 
                    placeholder="99999" 
                    className="pl-8 rounded-none border-gray-300" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Size */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-primary">Size</h3>
            <div className="flex flex-col gap-3">
              {[
                { id: "S", label: "Small (S)" },
                { id: "M", label: "Medium (M)" },
                { id: "L", label: "Large (L)" },
                { id: "XL", label: "Extra large (XL)" },
                { id: "2XL", label: "2XL" },
                { id: "3XL", label: "3XL" },
                { id: "4XL", label: "4XL" },
                { id: "5XL", label: "5XL" },
                { id: "6XL", label: "6XL" }
              ].map((size) => (
                <label key={size.id} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox 
                    id={`size-${size.id}`} 
                    className="rounded-none border-gray-300"
                    checked={filters.sizes.includes(size.id)}
                    onCheckedChange={() => handleSizeToggle(size.id)}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-black">{size.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-brand-primary">Color</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Black", hex: "#000000" },
                { name: "White", hex: "#ffffff" },
                { name: "Gray", hex: "#6b7280" },
                { name: "Navy", hex: "#1e3a8a" },
                { name: "Blue", hex: "#3b82f6" },
                { name: "Red", hex: "#ef4444" },
                { name: "Green", hex: "#22c55e" },
                { name: "Yellow", hex: "#eab308" },
                { name: "Orange", hex: "#f97316" },
                { name: "Pink", hex: "#ec4899" },
                { name: "Purple", hex: "#a855f7" },
                { name: "Beige", hex: "#f5f5dc" }
              ].map((color) => (
                <button
                  key={color.name}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-full border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${filters.colors.includes(color.name) ? 'ring-2 ring-black ring-offset-1 border-transparent' : 'border-gray-200'}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  onClick={() => handleColorToggle(color.name)}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
        
        {/* Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 border-t bg-white p-4 flex gap-3 mt-auto">
          <button 
            className="flex-1 rounded-md border border-gray-300 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
            onClick={handleClear}
          >
            Clear All
          </button>
          <button 
            className="flex-1 rounded-md bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
