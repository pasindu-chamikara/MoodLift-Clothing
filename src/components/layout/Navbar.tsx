"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const items = useCart((state) => state.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 md:px-12">
          
          {/* Mobile Menu & Logo */}
          <div className="flex w-1/4 md:w-1/3 items-center justify-start gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-transparent hover:text-[#A67C52] transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" strokeWidth={1.25} />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/" className="group flex items-center space-x-3">
              <Image src="/images/logo.jpg" alt="Moodlift Logo" width={32} height={32} className="rounded-sm transition-transform duration-500 group-hover:scale-105" />
              <span className="text-xl font-serif font-bold tracking-tight sm:text-2xl transition-colors duration-300 group-hover:text-[#A67C52]">
                MOODLIFT
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:flex-1 items-center justify-center gap-8 lg:gap-12 text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap">
            <Link href="/" className={`relative transition-all duration-300 hover:text-[#A67C52] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#A67C52] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${pathname === "/" ? "text-[#A67C52] after:scale-x-100 after:origin-bottom-left" : ""}`}>Home</Link>
            <Link href="/shop" className={`relative transition-all duration-300 hover:text-[#A67C52] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#A67C52] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${pathname?.startsWith("/shop") ? "text-[#A67C52] after:scale-x-100 after:origin-bottom-left" : ""}`}>Shop</Link>
            <Link href="/size-guide" className={`relative whitespace-nowrap transition-all duration-300 hover:text-[#A67C52] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#A67C52] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${pathname === "/size-guide" ? "text-[#A67C52] after:scale-x-100 after:origin-bottom-left" : ""}`}>Size Guide</Link>
            <Link href="/about" className={`relative transition-all duration-300 hover:text-[#A67C52] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#A67C52] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${pathname === "/about" ? "text-[#A67C52] after:scale-x-100 after:origin-bottom-left" : ""}`}>About</Link>
            <Link href="/faq" className={`relative transition-all duration-300 hover:text-[#A67C52] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#A67C52] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${pathname === "/faq" ? "text-[#A67C52] after:scale-x-100 after:origin-bottom-left" : ""}`}>FAQ</Link>
            <Link href="/order" className={`relative whitespace-nowrap transition-all duration-300 hover:text-[#A67C52] after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#A67C52] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${pathname?.startsWith("/order") ? "text-[#A67C52] after:scale-x-100 after:origin-bottom-left" : ""}`}>Track Order</Link>
          </nav>

          {/* Icons */}
          <div className="flex w-3/4 md:w-1/3 items-center justify-end gap-2 md:gap-4 text-xs font-medium uppercase tracking-[0.2em]">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="hidden lg:inline-flex items-center hover:bg-transparent hover:text-[#A67C52] transition-colors duration-300" />}>
                <User className="h-5 w-5" strokeWidth={1.25} />
                <span className="sr-only">Account</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-none border-[#111111]/10 bg-white shadow-md animate-in fade-in-80 zoom-in-95">
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
              <Button variant="ghost" size="icon" className="relative flex items-center hover:bg-transparent hover:text-[#A67C52] transition-colors duration-300">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.25} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#A67C52] text-[10px] font-bold text-white shadow-sm">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
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
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 border-b border-[#f0f0f0] ${pathname === "/" ? "text-[#A67C52]" : ""}`}>Home</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 border-b border-[#f0f0f0] ${pathname?.startsWith("/shop") ? "text-[#A67C52]" : ""}`}>Shop</Link>
              <Link href="/size-guide" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 border-b border-[#f0f0f0] ${pathname === "/size-guide" ? "text-[#A67C52]" : ""}`}>Size Guide</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 border-b border-[#f0f0f0] ${pathname === "/about" ? "text-[#A67C52]" : ""}`}>About</Link>
              <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 border-b border-[#f0f0f0] ${pathname === "/faq" ? "text-[#A67C52]" : ""}`}>FAQ</Link>
              <Link href="/order" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 border-b border-[#f0f0f0] ${pathname?.startsWith("/order") ? "text-[#A67C52]" : ""}`}>Track Order</Link>
              <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className={`py-2 border-b border-[#f0f0f0] ${pathname?.startsWith("/account") ? "text-[#A67C52]" : ""}`}>Account</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
