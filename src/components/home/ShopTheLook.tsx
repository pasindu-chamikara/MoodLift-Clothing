"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { settingsService, productService } from "@/services/db";
import { Product } from "@/types";

export function ShopTheLook() {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const settings = await settingsService.getSettings();
        setSettings(settings);
        if (settings?.featuredProductId) {
          const product = await productService.getProduct(settings.featuredProductId);
          setFeaturedProduct(product);
        }
      } catch (err) {
        console.error("Failed to load featured product:", err);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="bg-transparent py-12 md:py-16">
      <div className="container mx-auto max-w-screen-xl">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-24">
          
          <div className="w-4/5 sm:w-2/3 md:w-4/12 mx-auto md:mx-0 relative aspect-square md:aspect-[4/5] bg-[#f5f5f5] overflow-hidden">
            <Image
              src={settings?.shopTheLookImage || "/images/crafted.jpg"}
              alt="Crafted for Everyday Confidence"
              fill
              sizes="(max-width: 768px) 80vw, 33vw"
              className="object-cover"
            />
          </div>

          <div className="w-full md:w-7/12 flex flex-col items-center md:items-start text-center md:text-left px-4 md:px-8 md:pl-12 lg:pl-24 mt-10 md:mt-0">
            <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-6 tracking-tight whitespace-pre-wrap">
              {settings?.shopTheLookTitle || "Crafted for Everyday Confidence"}
            </h2>
            <p className="text-[#444] font-light text-base md:text-lg leading-relaxed mb-10 whitespace-pre-wrap">
              {settings?.shopTheLookDescription || "Our premium women's T-shirts are made from soft, breathable cotton with a relaxed fit designed for all-day comfort. Every stitch is thoughtfully crafted to deliver lasting quality, effortless style, and a flattering silhouette that stays beautiful wash after wash."}
            </p>
            
            {featuredProduct && (
              <div className="flex flex-col mt-6 w-full">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#777] mb-4">Featured Item</span>
                <div className="flex items-center gap-6 border border-[#eee] p-4 bg-white/50 hover:bg-white hover:shadow-sm transition-all group w-full text-left">
                  <div className="relative w-20 h-24 bg-[#f5f5f5] shrink-0 overflow-hidden">
                    <Image 
                      src={featuredProduct.imageUrl || "/images/placeholder.jpg"}
                      alt={featuredProduct.title}
                      fill
                      sizes="80px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-[#222]">{featuredProduct.title}</h3>
                    <p className="text-sm text-[#777] mt-1">Rs. {Math.round(featuredProduct.price).toLocaleString()}</p>
                  </div>
                  <Link href={`/product/${featuredProduct.id}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#222] border-b border-[#222] pb-1 hover:text-[#777] hover:border-[#777] transition-colors shrink-0">
                    View
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
