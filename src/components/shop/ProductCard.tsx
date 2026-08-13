import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Product } from "@/types";

export function ProductCard({ id, title, price, imageUrl, sizePrices, discountPercentage }: Product & { discountPercentage?: number }) {
  let basePrice = price;
  if (sizePrices && Object.keys(sizePrices).length > 0) {
    const prices = Object.values(sizePrices);
    basePrice = Math.min(...prices, price);
  }
  
  const hasDiscount = discountPercentage && discountPercentage > 0;
  const finalPrice = hasDiscount ? basePrice * (1 - discountPercentage / 100) : basePrice;

  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F2F2F2]">
        <Link href={`/product/${id}`} className="block h-full w-full">
          <Image 
            src={imageUrl || "/images/placeholder.jpg"} 
            alt={title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-[#C9A26B] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 z-10">
            Sale -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-5 flex flex-col">

        <Link href={`/product/${id}`}>
          <h3 className="mt-2 font-serif text-lg leading-tight text-brand-primary transition-colors hover:text-brand-luxury line-clamp-1">
            {title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="font-medium text-brand-primary">Rs. {Math.round(finalPrice).toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-[#6B7280] line-through text-xs">Rs. {Math.round(basePrice).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
