"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { subscriberService } from "@/services/db";
import toast from "react-hot-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await subscriberService.addSubscriber(email);
      setIsSuccess(true);
      toast.success("Successfully joined the insider list!");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#F8F4F1] text-[#111] pt-12 pb-8 md:pt-16 md:pb-8 mt-auto border-t border-[#e5e5e5]">
      <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-8 md:mb-12">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:w-1/3 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
            <Link href="/" className="flex items-center space-x-3 w-fit mx-auto md:mx-0">
              <Image src="/images/logo.jpg" alt="Moodlift Logo" width={36} height={36} className="rounded-sm" />
              <h2 className="text-3xl font-light tracking-widest uppercase">Moodlift</h2>
            </Link>
            <p className="text-[#333] text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              Elevate your everyday style with premium fashion designed for your lifestyle. Based in Sri Lanka.
            </p>
            
            <div className="pt-4 w-full">
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-4 text-[#777]">Join The Insider</h3>
              {isSuccess ? (
                <div className="flex items-center gap-2 text-sm text-[#22C55E] w-full md:max-w-sm mx-auto md:mx-0 border-b border-[#22C55E] pb-3">
                  <Check className="w-4 h-4" />
                  <span>Thanks for subscribing!</span>
                </div>
              ) : (
                <form className="flex border-b border-[#ccc] focus-within:border-[#111] transition-colors w-full md:max-w-sm mx-auto md:mx-0" onSubmit={handleSubscribe}>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-transparent w-full py-3 text-sm outline-none text-[#111] placeholder:text-[#666] text-center md:text-left disabled:opacity-50"
                  />
                  <button type="submit" disabled={isSubmitting} className="p-3 text-[#777] hover:text-[#111] transition-colors disabled:opacity-50" aria-label="Subscribe">
                    {isSubmitting ? <span className="animate-pulse">...</span> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:w-3/5 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-8 text-center md:text-left">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-[#777]">Explore</h3>
              <ul className="space-y-4 text-sm text-[#333]">
                <li><Link href="/shop" className="hover:text-[#111] transition-colors">Shop All</Link></li>
                <li><Link href="/size-guide" className="hover:text-[#111] transition-colors">Size Guide</Link></li>
                <li><Link href="/about" className="hover:text-[#111] transition-colors">About Us</Link></li>
                <li><Link href="/order" className="hover:text-[#111] transition-colors">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-[#777]">Support</h3>
              <ul className="space-y-4 text-sm text-[#333]">
                <li><Link href="/contact" className="hover:text-[#111] transition-colors">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-[#111] transition-colors">Shipping Policy</Link></li>
                <li><Link href="/returns" className="hover:text-[#111] transition-colors">Returns & Exchanges</Link></li>
                <li><Link href="/faq" className="hover:text-[#111] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-[#777]">Social</h3>
              <ul className="space-y-4 text-sm text-[#333]">
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
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start pt-8 border-t border-[#e5e5e5] text-xs text-[#444] gap-4 md:gap-0 text-center md:text-left">
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
