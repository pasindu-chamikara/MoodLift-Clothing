"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { productService, settingsService } from "@/services/db";
import { Product, StoreSettings } from "@/types";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [data, allProducts, settingsData] = await Promise.all([
          productService.getProduct(id),
          productService.getProducts(),
          settingsService.getSettings()
        ]);
        setProduct(data);
        setRelatedProducts(allProducts.filter(p => p.id !== id).slice(0, 5));
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  const basePrice = selectedSize && product.sizePrices?.[selectedSize] 
    ? product.sizePrices[selectedSize] 
    : product.price;

  const saleProductIds = settings?.promoDiscountProductIds || [];
  const discountPercentage = settings?.promoDiscountPercentage || 0;
  const isOnSale = saleProductIds.includes(product.id!);
  
  const currentPrice = isOnSale && discountPercentage > 0 
    ? basePrice * (1 - discountPercentage / 100) 
    : basePrice;

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    addItem({
      productId: product.id!,
      title: product.title,
      price: currentPrice,
      size: selectedSize,
      imageUrl: product.imageUrl || "/images/placeholder.jpg",
      quantity: quantity
    });
    
    toast.success(`${quantity} ${product.title} added to cart!`);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto max-w-screen-xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product Images */}
          <div className="flex flex-col gap-4 items-center md:items-end">
            <div className="relative aspect-square w-full max-w-md overflow-hidden bg-[#F2F2F2]">
              <Image 
                src={product.imageUrl || "/images/placeholder.jpg"} 
                alt={product.title}
                fill
                className="object-cover"
              />
              {isOnSale && discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-[#C9A26B] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 z-10">
                  Sale -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-4 md:pt-0 max-w-md">
            <h1 className="font-serif text-3xl md:text-5xl text-[#1F1F1F] mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <p className="text-xl font-medium text-[#111111]">
                Rs. {Math.round(currentPrice).toLocaleString()}
              </p>
              {isOnSale && discountPercentage > 0 && (
                <p className="text-lg font-medium text-[#6B7280] line-through">
                  Rs. {Math.round(basePrice).toLocaleString()}
                </p>
              )}
            </div>
            
            <p className="text-[#1E1E1E] text-sm md:text-base leading-relaxed mb-8 font-medium">
              {product.description}
            </p>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold uppercase tracking-widest text-[#111111]">Size</span>
                <button className="text-xs text-[#6B7280] underline underline-offset-4 hover:text-[#111111]">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-12 w-12 items-center justify-center border text-sm transition-colors hover:border-[#111111] ${
                      selectedSize === size 
                        ? "bg-[#111111] text-white border-[#111111]" 
                        : "border-[#111111]/20 focus:bg-[#111111]/5 focus:border-[#111111]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold uppercase tracking-widest text-[#111111]">Quantity</span>
                <div className="flex items-center border border-[#111111]/20 h-10 w-32">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex-1 h-full flex items-center justify-center hover:bg-[#111111]/5 transition-colors font-medium text-lg"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="flex-1 h-full flex items-center justify-center hover:bg-[#111111]/5 transition-colors font-medium text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full h-14 bg-[#111111] text-white rounded-none uppercase tracking-widest text-xs font-semibold hover:bg-[#333333] disabled:bg-[#cccccc] disabled:text-[#666666] mt-4"
              >
                {selectedSize ? "Add to Cart" : "Select a Size"}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      <div className="container mx-auto max-w-screen-xl px-4 py-8 md:py-12 border-t border-[#111111]/10 mt-8">
        <h2 className="font-serif text-2xl text-[#1F1F1F] mb-6 text-center md:text-left">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-4 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-8">
          {relatedProducts.map((p) => {
            const isRelatedOnSale = saleProductIds.includes(p.id!);
            return (
              <ProductCard 
                key={p.id} 
                {...p} 
                discountPercentage={isRelatedOnSale ? discountPercentage : undefined}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
