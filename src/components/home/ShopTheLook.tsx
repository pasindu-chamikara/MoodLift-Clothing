"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { settingsService, productService } from "@/services/db";
import { Product } from "@/types";

export function ShopTheLook() {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const settings = await settingsService.getSettings();
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
    <section className="bg-transparent py-12 md:py-32">
      <div className="container mx-auto max-w-screen-xl">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-24">
          
          <div className="w-4/5 sm:w-2/3 md:w-4/12 mx-auto md:mx-0 relative aspect-square md:aspect-[4/5] bg-[#f5f5f5] overflow-hidden">
            <Image
              src="/images/crafted.jpg"
              alt="Crafted for Everyday Confidence"
              fill
              className="object-cover"
            />
            {/* Minimalist hotspot indicator */}
            {featuredProduct && (
              <Link href={`/product/${featuredProduct.id}`}>
                <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-white rounded-full shadow-lg cursor-pointer hover:scale-125 transition-transform" title={featuredProduct.title} />
              </Link>
            )}
          </div>

          <div className="w-full md:w-7/12 max-w-lg flex flex-col items-center text-center px-4 md:px-8">
            <h2 className="text-3xl md:text-5xl font-light text-[#222] mb-6 tracking-tight">
              Crafted for Everyday Confidence
            </h2>
            <p className="text-[#555] text-sm md:text-base leading-relaxed mb-10">
              Our premium women's T-shirts are made from soft, breathable cotton with a relaxed fit designed for all-day comfort. Every stitch is thoughtfully crafted to deliver lasting quality, effortless style, and a flattering silhouette that stays beautiful wash after wash.
            </p>
            
            {featuredProduct && (
              <div className="flex flex-col gap-6 mt-10">
                <div className="flex items-center gap-6 border-b border-[#eee] pb-6">
                  <div className="relative w-20 h-24 bg-[#f5f5f5]">
                    <Image 
                      src={featuredProduct.imageUrl || "/images/placeholder.jpg"}
                      alt={featuredProduct.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-[#222]">{featuredProduct.title}</h3>
                    <p className="text-sm text-[#777] mt-1">${featuredProduct.price.toFixed(2)}</p>
                  </div>
                  <Link href={`/product/${featuredProduct.id}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#222] border-b border-[#222] pb-1 hover:text-[#777] hover:border-[#777] transition-colors">
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
