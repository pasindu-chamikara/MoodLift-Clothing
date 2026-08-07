"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useCart } from "@/store/useCart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { settingsService, orderService } from "@/services/db";

export default function CheckoutPage() {
  const { isLoggedIn, login, user, logout, addresses } = useAuth();
  const { items, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);

  const defaultAddress = addresses?.find(a => a.isDefault) || addresses?.[0];

  useEffect(() => {
    setIsMounted(true);
    settingsService.getSettings().then(settings => {
      if (settings && settings.flatShippingRate) {
        setShippingFee(settings.flatShippingRate);
      }
    }).catch(console.error);
  }, []);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && password) {
      setIsLoggingIn(true);
      try {
        await login(name, email);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + shippingFee;

    const orderData = {
      userId: user?.email || "guest@example.com",
      items: items.map(item => ({
        productId: item.productId,
        title: item.title,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      totalAmount: total,
      status: "pending" as const,
      shippingAddress: {
        name: formData.get("fullName") as string,
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: "N/A",
        zipCode: formData.get("postalCode") as string,
        country: "N/A",
      },
    };

    try {
      await orderService.addOrder(orderData);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!isMounted) return null;

  if (isSuccess) {
    return (
      <div className="bg-transparent min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#111111]/10 p-10 text-center">
          <h2 className="font-serif text-3xl text-[#1F1F1F] mb-4">Thank You</h2>
          <p className="text-[#6B7280] mb-8">Your order has been placed successfully.</p>
          <Link href="/shop">
            <Button className="w-full bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-6">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="font-serif text-4xl text-[#1F1F1F] mb-10 text-center">Checkout</h1>

        {!isLoggedIn ? (
          <div className="bg-white border border-[#111111]/10 p-8 md:p-12">
            <h2 className="text-xl font-serif text-[#1F1F1F] mb-2 text-center">Account Required</h2>
            <p className="text-sm text-[#6B7280] mb-8 text-center">
              Please sign in or create an account to proceed with your checkout.
            </p>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Full Name</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] transition-colors bg-transparent"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Email Address</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] transition-colors bg-transparent"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Password</label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] transition-colors bg-transparent"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" disabled={isLoggingIn} className="w-full bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-6 mt-4">
                {isLoggingIn ? "Signing In..." : "Continue to Checkout"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-[#111111]/10 p-8 md:p-12">
            <div className="flex justify-between items-center mb-8 border-b border-[#111111]/10 pb-4">
              <div>
                <p className="text-sm text-[#6B7280]">Logged in as</p>
                <p className="font-medium text-[#1F1F1F]">{user?.email}</p>
              </div>
              <button 
                onClick={logout}
                className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] hover:text-[#111111] transition-colors"
              >
                Sign out
              </button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-8">
              <div>
                <h3 className="font-serif text-xl text-[#1F1F1F] mb-6">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Full Name</label>
                    <input type="text" name="fullName" defaultValue={defaultAddress?.name || user?.name || ""} required className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Telephone Number</label>
                    <input type="tel" name="phone" defaultValue={defaultAddress?.phone || ""} required className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Street Address</label>
                    <input type="text" name="street" defaultValue={defaultAddress?.street || ""} required className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">City</label>
                    <input type="text" name="city" defaultValue={defaultAddress?.city || ""} required className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Postal Code</label>
                    <input type="text" name="postalCode" defaultValue={defaultAddress?.postalCode || ""} required className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#1F1F1F] mb-6">Payment</h3>
                <div className="bg-[#F9F9F9] border border-[#111111]/10 p-6 text-center">
                  <p className="text-sm text-[#1F1F1F] font-semibold uppercase tracking-widest mb-2">Cash on Delivery (COD)</p>
                  <p className="text-xs text-[#6B7280]">You will pay for your order when it is delivered to your address.</p>
                </div>
              </div>

              <div className="border-t border-[#111111]/10 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-[#6B7280]">
                  <span>Subtotal</span>
                  <span>${items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B7280]">
                  <span>Delivery Fee</span>
                  <span>{shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#1F1F1F] pt-2 border-t border-[#111111]/10">
                  <span>Total</span>
                  <span>${(items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + shippingFee).toFixed(2)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={items.length === 0}
                className="w-full bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-6"
              >
                {items.length === 0 ? "Cart is empty" : `Place Order • ${(items.reduce((acc, item) => acc + (item.price * item.quantity), 0) + shippingFee).toFixed(2)}`}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
