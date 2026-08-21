import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2F2F2]">
        <Link href={`/product/${id}`} className="block h-full w-full">
          <Image 
            src={imageUrl || "/images/placeholder.jpg"} 
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
        </Link>
        
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-black text-white text-[9px] font-medium uppercase tracking-[0.2em] px-3 py-1.5 z-10">
            Sale
          </div>
        )}

        {/* Quick View Overlay Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
          <Link href={`/product/${id}`} className="w-full">
            <Button variant="secondary" className="w-full bg-white/90 backdrop-blur hover:bg-white text-black rounded-none h-12 text-[10px] font-medium uppercase tracking-widest gap-2">
              <Eye className="w-3 h-3" /> Quick View
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-col items-start text-left">
        <Link href={`/product/${id}`}>
          <h3 className="text-sm font-medium tracking-wide text-[#1A1A1A] transition-colors hover:text-[#A67C52] line-clamp-1">
            {title}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-3 text-[13px]">
          <span className="font-medium text-[#1A1A1A]">Rs. {Math.round(finalPrice).toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-[#999999] line-through">Rs. {Math.round(basePrice).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
