"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { useAuth } from "@/store/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.jpg" alt="Moodlift Logo" width={32} height={32} className="rounded-sm" />
              <span className="text-xl font-bold tracking-tighter sm:text-2xl">
                MOODLIFT
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest">
            <Link href="/" className="transition-colors hover:text-brand-luxury">Home</Link>
            <Link href="/shop" className="transition-colors hover:text-brand-luxury">Shop</Link>
            <Link href="/size-guide" className="transition-colors hover:text-brand-luxury">Size Guide</Link>
            <Link href="/about" className="transition-colors hover:text-brand-luxury">About</Link>
            <Link href="/faq" className="transition-colors hover:text-brand-luxury">FAQ</Link>
            <Link href="/order" className="transition-colors hover:text-brand-luxury">Order</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-semibold uppercase tracking-widest">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="hidden lg:inline-flex items-center" />}>
                <span>Account</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-none border-[#111111]/10 bg-white">
                {isLoggedIn ? (
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal text-xs text-[#6B7280]">
                      {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#111111]/10" />
                    <DropdownMenuItem render={<Link href="/account" className="cursor-pointer text-xs uppercase tracking-widest text-[#1F1F1F] hover:bg-[#F2F2F2]" />}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/order" className="cursor-pointer text-xs uppercase tracking-widest text-[#1F1F1F] hover:bg-[#F2F2F2]" />}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#111111]/10" />
                    <DropdownMenuItem className="cursor-pointer text-xs uppercase tracking-widest text-[#EF4444] hover:bg-[#F2F2F2]" onClick={logout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                ) : (
                  <DropdownMenuGroup>
                    <DropdownMenuItem render={<Link href="/account" className="cursor-pointer text-xs uppercase tracking-widest text-[#1F1F1F] hover:bg-[#F2F2F2]" />}>
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link href="/account" className="cursor-pointer text-xs uppercase tracking-widest text-[#1F1F1F] hover:bg-[#F2F2F2]" />}>
                      Create Account
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/cart">
              <Button variant="ghost" className="flex items-center">
                <span>Cart ({totalItems})</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white p-6 shadow-xl transition-transform overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center mb-10 relative mt-4">
              <Button variant="ghost" size="icon" className="absolute -top-4 -right-4" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
              <Link href="/" className="flex flex-col items-center space-y-3" onClick={() => setIsMobileMenuOpen(false)}>
                <Image src="/images/logo.jpg" alt="Moodlift Logo" width={48} height={48} className="rounded-sm" />
                <span className="text-xl font-bold tracking-tighter">MOODLIFT</span>
              </Link>
            </div>
            
            <nav className="flex flex-col gap-6 text-sm font-semibold uppercase tracking-widest text-center">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#f0f0f0]">Home</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#f0f0f0]">Shop</Link>
              <Link href="/size-guide" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#f0f0f0]">Size Guide</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#f0f0f0]">About</Link>
              <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#f0f0f0]">FAQ</Link>
              <Link href="/order" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#f0f0f0]">Order</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-[#f0f0f0]">Account</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
