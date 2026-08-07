"use client";

import { useEffect, useState, use } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { FilterDrawer, FilterState, defaultFilters } from "@/components/shop/FilterDrawer";
import { productService } from "@/services/db";
import { Product } from "@/types";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<FilterState>(defaultFilters);
  
  useEffect(() => {
    productService.getProducts().then((data) => {
      if (category && category.toLowerCase() !== "all" && category.toLowerCase() !== "shop") {
        setAllProducts(data.filter(p => p.category?.toLowerCase() === category.toLowerCase()));
      } else {
        setAllProducts(data);
      }
      setIsLoading(false);
    }).catch(console.error);
  }, [category]);

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

  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="bg-transparent min-h-screen">
      {/* Editorial Header */}
      <div className="relative flex w-full flex-col items-center justify-center bg-gradient-to-br from-[#FFF8F7] to-[#F4EEE9] py-6 md:py-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C9A26B]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="z-10 flex flex-col items-center text-center px-4">
          <span className="mb-3 text-[10px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A26B]">Moodlift Collection</span>
          <h1 className="font-serif text-5xl italic tracking-tight text-[#1F1F1F] md:text-7xl">{title}</h1>
          <p className="mt-4 text-[#6B7280] text-xs md:text-sm max-w-md font-sans">
            Explore our curated selection of premium {title.toLowerCase()} designed for everyday comfort and effortless style.
          </p>
        </div>
      </div>

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
          <div className="py-20 text-center text-sm text-[#6B7280]">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-16 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
