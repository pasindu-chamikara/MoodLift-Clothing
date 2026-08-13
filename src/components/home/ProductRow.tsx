"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, StoreSettings } from "@/types";
import { productService, orderService, settingsService } from "@/services/db";

interface ProductRowProps {
  title: string;
  products?: Product[];
}


export function ProductRow({ title, products: initialProducts }: ProductRowProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch(console.error);
    
    if (!initialProducts || initialProducts.length === 0) {
      productService.getProducts().then(async (data) => {
        let displayData = [...data];
        
        if (title === "Best Sellers") {
          try {
            const orders = await orderService.getOrders();
            const salesCount: Record<string, number> = {};
            
            orders.forEach(order => {
              if (order.status !== 'cancelled') {
                order.items.forEach(item => {
                  salesCount[item.productId] = (salesCount[item.productId] || 0) + item.quantity;
                });
              }
            });
            
            displayData = displayData.sort((a, b) => {
              const salesA = salesCount[a.id!] || 0;
              const salesB = salesCount[b.id!] || 0;
              return salesB - salesA; // Descending
            });
          } catch (e) {
            console.error("Failed to fetch orders for Best Sellers", e);
          }
        } else if (title === "New Arrivals") {
          displayData = displayData.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
        }
        
        // Filter out products with duplicate titles to ensure variety
        const uniqueTitles = new Set();
        const uniqueProducts = [];
        for (const p of displayData) {
          if (!uniqueTitles.has(p.title)) {
            uniqueTitles.add(p.title);
            uniqueProducts.push(p);
          }
        }
        
        setProducts(uniqueProducts.slice(0, 5));
      }).catch(console.error);
    }
  }, [initialProducts, title]);

  if (products.length === 0) return null;

  const saleProductIds = settings?.promoDiscountProductIds || [];
  const discountPercentage = settings?.promoDiscountPercentage || 0;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="flex flex-col items-center justify-center mb-10 border-b border-[#eee] pb-4 gap-2 text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-[#222]">{title}</h2>
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-widest text-[#777] hover:text-[#222] transition-colors">
            View All
          </Link>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 lg:grid lg:grid-cols-5 lg:gap-x-12 lg:gap-y-12 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.map((product) => {
            const isOnSale = saleProductIds.includes(product.id!);
            const basePrice = product.price;
            const finalPrice = isOnSale && discountPercentage > 0 
              ? basePrice * (1 - discountPercentage / 100) 
              : basePrice;
            
            return (
              <Link key={product.id} href={`/product/${product.id}`} className="group block min-w-[50vw] sm:min-w-[40vw] lg:min-w-0 snap-center lg:snap-align-none">
                <div className="relative aspect-square overflow-hidden bg-[#f5f5f5] mb-4">
                  <Image
                    src={product.imageUrl || "/images/placeholder.jpg"}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 20vw"
                    className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  {isOnSale && discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-[#C9A26B] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 z-10">
                      Sale -{discountPercentage}%
                    </div>
                  )}

                  {/* Size indicators */}
                  <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100 hidden lg:flex">
                    {product.sizes?.map((size) => (
                      <span key={size} className="bg-white/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-2 py-1 text-center shadow-sm text-[#222]">
                        {size}
                      </span>
                    ))}
                  </div>

                  {/* Quick Shop Button */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 hidden lg:block">
                    <button 
                      className="w-full bg-white/90 backdrop-blur-md text-[#222] py-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm hover:bg-[#222] hover:text-white transition-colors duration-300"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigating to product page
                        // handle quick add logic
                      }}
                    >
                      Quick Shop
                    </button>
                  </div>
                </div>

                <div className="flex flex-col text-center lg:text-left">
                  <h3 className="text-sm font-medium text-[#222] group-hover:text-[#777] transition-colors line-clamp-1">{product.title}</h3>
                  <div className="flex items-center gap-2 justify-center lg:justify-start mt-1">
                    <p className="text-sm text-[#777]">Rs. {Math.round(finalPrice).toLocaleString()}</p>
                    {isOnSale && discountPercentage > 0 && (
                      <p className="text-xs text-[#a0a0a0] line-through">Rs. {Math.round(basePrice).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
