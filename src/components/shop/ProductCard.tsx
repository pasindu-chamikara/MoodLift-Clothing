import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Product } from "@/types";

export function ProductCard({ id, title, price, imageUrl, sizePrices }: Product) {
  let displayPrice = `LKR ${price.toLocaleString()}`;
  if (sizePrices && Object.keys(sizePrices).length > 0) {
    const prices = Object.values(sizePrices);
    const minPrice = Math.min(...prices, price);
    const maxPrice = Math.max(...prices, price);
    if (minPrice !== maxPrice) {
      displayPrice = `From LKR ${minPrice.toLocaleString()}`;
    } else {
      displayPrice = `LKR ${minPrice.toLocaleString()}`;
    }
  }
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
      </div>

      {/* Product Info */}
      <div className="mt-5 flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Moodlift Collection</p>
        </div>
        <Link href={`/product/${id}`}>
          <h3 className="mt-2 font-serif text-lg leading-tight text-brand-primary transition-colors hover:text-brand-luxury">
            {title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="font-medium text-brand-primary">{displayPrice}</span>
        </div>
      </div>
    </div>
  );
}
