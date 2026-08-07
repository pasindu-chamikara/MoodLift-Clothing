"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { settingsService } from "@/services/db";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    settingsService.getSettings().then(settings => {
      if (settings && settings.flatShippingRate) {
        setShippingFee(settings.flatShippingRate);
      }
    }).catch(console.error);
  }, []);
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? shippingFee : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl text-[#1F1F1F] mb-8">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#111111]/10 rounded-none">
            <p className="text-[#6B7280] mb-6">Your cart is currently empty.</p>
            <Link href="/shop">
              <Button className="bg-[#111111] text-white hover:bg-black rounded-none px-8 py-6 uppercase tracking-widest text-xs">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 bg-white border border-[#111111]/10 rounded-none">
                  <div className="relative w-24 h-32 bg-[#F2F2F2] flex-shrink-0">
                    <Image 
                      src={item.imageUrl || "/images/placeholder.jpg"} 
                      alt={item.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-grow py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm text-[#1F1F1F]">{item.title}</h3>
                        <p className="text-xs text-[#6B7280] mt-1">Size: {item.size}</p>
                      </div>
                      <span className="font-semibold text-sm text-[#1F1F1F]">
                        ${(item.price).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center border border-[#111111]/10">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-[#F2F2F2] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-[#F2F2F2] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[#6B7280] hover:text-[#EF4444] transition-colors flex items-center gap-1 text-xs uppercase tracking-wider"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#111111]/10 p-6 rounded-none sticky top-24">
                <h3 className="font-serif text-xl text-[#1F1F1F] mb-6 border-b border-[#111111]/10 pb-4">Order Summary</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                
                <div className="border-t border-[#111111]/10 pt-4 mb-8 flex justify-between items-end">
                  <span className="text-sm font-semibold uppercase tracking-widest text-[#1F1F1F]">Total</span>
                  <span className="text-xl font-bold text-[#1F1F1F]">${total.toFixed(2)}</span>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full bg-[#111111] text-white hover:bg-black rounded-none py-6 uppercase tracking-widest text-xs">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <p className="text-center text-[10px] text-[#6B7280] mt-4 uppercase tracking-widest">
                  Secure Checkout
                </p>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
