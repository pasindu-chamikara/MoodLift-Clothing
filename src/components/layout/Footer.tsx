"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#F8F4F1] text-[#111] pt-12 pb-8 md:pt-20 md:pb-10 mt-auto border-t border-[#e5e5e5]">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-12 md:mb-20">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <Link href="/" className="flex items-center space-x-3 w-fit mx-auto md:mx-0">
              <Image src="/images/logo.jpg" alt="Moodlift Logo" width={36} height={36} className="rounded-sm" />
              <h2 className="text-3xl font-light tracking-widest uppercase">Moodlift</h2>
            </Link>
            <p className="text-[#555] text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              Elevate your everyday style with premium fashion designed for your lifestyle. Based in Sri Lanka.
            </p>
            
            <div className="pt-4 w-full">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-4 text-[#777]">Join The Insider</h3>
              <form className="flex border-b border-[#ccc] focus-within:border-[#111] transition-colors w-full md:max-w-sm mx-auto md:mx-0" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-transparent w-full py-3 text-sm outline-none text-[#111] placeholder:text-[#999] text-center md:text-left"
                />
                <button type="submit" className="p-3 text-[#777] hover:text-[#111] transition-colors" aria-label="Subscribe">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-[#777]">Explore</h3>
              <ul className="space-y-4 text-sm text-[#555]">
                <li><Link href="/shop" className="hover:text-[#111] transition-colors">Shop All</Link></li>
                <li><Link href="/size-guide" className="hover:text-[#111] transition-colors">Size Guide</Link></li>
                <li><Link href="/about" className="hover:text-[#111] transition-colors">About Us</Link></li>
                <li><Link href="/order" className="hover:text-[#111] transition-colors">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-[#777]">Support</h3>
              <ul className="space-y-4 text-sm text-[#555]">
                <li><Link href="/contact" className="hover:text-[#111] transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-[#111] transition-colors">Shipping Policy</Link></li>
                <li><Link href="/returns" className="hover:text-[#111] transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/faq" className="hover:text-[#111] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-[#777]">Social</h3>
              <ul className="space-y-4 text-sm text-[#555]">
                <li>
                  <Link href="https://www.instagram.com/moodlift_clothing?igsh=NDk5YWdvNjdqODhx" target="_blank" rel="noopener noreferrer" className="hover:text-[#111] transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="https://www.facebook.com/share/1DWNyAYqNy/" target="_blank" rel="noopener noreferrer" className="hover:text-[#111] transition-colors">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="https://www.tiktok.com/@moodlift.clothing?_r=1&_t=ZS-98ftEuYaKaC" target="_blank" rel="noopener noreferrer" className="hover:text-[#111] transition-colors">
                    TikTok
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start pt-8 border-t border-[#e5e5e5] text-xs text-[#777] gap-4 md:gap-0 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Moodlift Clothing. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-[#111] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#111] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
