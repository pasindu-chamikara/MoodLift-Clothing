"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { FilterDrawer, FilterState, defaultFilters } from "@/components/shop/FilterDrawer";
import { productService, settingsService } from "@/services/db";
import { Product, StoreSettings } from "@/types";

export default function SalePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterState>(defaultFilters);
  
  useEffect(() => {
    Promise.all([
      productService.getProducts(),
      settingsService.getSettings()
    ]).then(([productsData, settingsData]) => {
      setSettings(settingsData);
      
      // Only show products that are part of the sale
      const saleProductIds = settingsData?.promoDiscountProductIds || [];
      const saleProducts = productsData.filter(p => saleProductIds.includes(p.id!));
      
      setAllProducts(saleProducts);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  const products = allProducts.filter(p => {
    // Check stock
    if (activeFilters.inStock && !activeFilters.outOfStock) {
      if (p.stock === 0) return false;
    }
    if (activeFilters.outOfStock && !activeFilters.inStock) {
      if (p.stock > 0) return false;
    }
    
    // Check price
    if (p.price < activeFilters.minPrice || p.price > activeFilters.maxPrice) {
      return false;
    }
    
    // Check size
    if (activeFilters.sizes.length > 0) {
      if (!p.sizes || !p.sizes.some(s => activeFilters.sizes.includes(s))) {
        return false;
      }
    }
    
    // Check colors
    if (activeFilters.colors.length > 0) {
      if (!p.colors || !p.colors.some(c => activeFilters.colors.includes(c))) {
        return false;
      }
    }
    
    return true;
  });

  const title = "Sale";
  const discountPercentage = settings?.promoDiscountPercentage || 0;

  return (
    <div className="bg-transparent min-h-screen">


      <div className="container mx-auto max-w-screen-2xl px-4 py-4 md:px-8">
        {/* Sleek Filter Bar */}
        <div className="sticky top-16 z-40 mb-8 flex items-center justify-between border-b border-[#111111]/10 bg-white/90 py-3 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <FilterDrawer onApply={(filters) => setActiveFilters(filters)} />
            <div className="hidden h-4 w-px bg-[#111111]/10 md:block" />
            <span className="hidden text-xs text-[#6B7280] md:inline-block font-sans">{products.length} Items</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-[#111111] transition-colors hover:text-[#C9A26B]">
              Sort By
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Modern Product Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#6B7280]">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-sm text-[#6B7280]">No products are currently on sale. Check back later!</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-x-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                discountPercentage={discountPercentage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
