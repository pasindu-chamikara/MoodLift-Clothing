"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Check, 
  MapPin, 
  Mail, 
  Phone
} from "lucide-react";
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
    <footer className="relative bg-black text-white/80 pt-24 pb-8 mt-auto overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#A67C52]/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-[#A67C52]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-6 md:px-12 max-w-screen-2xl relative z-10">
        
        {/* Zone A: Newsletter Section */}
        <div className="flex flex-col items-center justify-center mb-24 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 tracking-wide">The Inner Circle</h2>
          <p className="text-[#A0A0A0] text-sm md:text-base mb-10 font-light leading-relaxed">
            Curated style inspiration, early access to new collections, and exclusive privileges reserved for our community.
          </p>
          
          {isSuccess ? (
            <div className="flex items-center justify-center gap-3 text-sm text-[#A67C52] border border-[#A67C52]/30 bg-[#A67C52]/10 py-4 px-8 rounded-full backdrop-blur-md">
              <Check className="w-5 h-5" />
              <span className="font-medium tracking-[0.2em] uppercase text-xs">Welcome to the club</span>
            </div>
          ) : (
            <form className="flex w-full max-w-md mx-auto group relative" onSubmit={handleSubscribe}>
              <div className="relative w-full rounded-full overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 focus-within:border-[#A67C52]/60 focus-within:bg-white/10 transition-all duration-500 backdrop-blur-md">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-transparent py-4 pl-6 pr-14 text-sm outline-none text-white placeholder:text-white/40 transition-colors disabled:opacity-50 font-light"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#A67C52] text-white rounded-full hover:bg-[#C9A26B] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100" 
                  aria-label="Subscribe"
                >
                  {isSubmitting ? <span className="animate-pulse px-1">...</span> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Zone B: Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-20 text-center md:text-left">
          
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col space-y-8 items-center md:items-start">
            <Link href="/" className="flex items-center space-x-4 w-fit group">
              <div className="relative overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-[#A67C52]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <Image src="/images/logo.jpg" alt="Moodlift Logo" width={40} height={40} className="brightness-90 contrast-125 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h2 className="text-2xl font-light tracking-[0.25em] uppercase text-white">Moodlift</h2>
            </Link>
            <p className="text-[#888] text-sm leading-loose max-w-xs font-light">
              Elevate your everyday style with premium fashion designed for your lifestyle. Crafted with exceptional attention to detail in Sri Lanka.
            </p>
            <div className="space-y-5 pt-2 flex flex-col items-center md:items-start">
              <div className="flex items-start md:items-center justify-center md:justify-start gap-4 text-sm text-[#999] group text-center md:text-left">
                <MapPin className="w-5 h-5 text-[#555] group-hover:text-[#A67C52] transition-colors shrink-0 mt-1 md:mt-0" />
                <span className="group-hover:text-white transition-colors font-light leading-relaxed">123 Fashion Ave, <br className="hidden md:block"/>Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-[#999] group cursor-pointer">
                <Phone className="w-5 h-5 text-[#555] group-hover:text-[#A67C52] transition-colors shrink-0" />
                <span className="group-hover:text-white transition-colors font-light">+94 11 234 5678</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-[#999] group cursor-pointer">
                <Mail className="w-5 h-5 text-[#555] group-hover:text-[#A67C52] transition-colors shrink-0" />
                <span className="group-hover:text-white transition-colors font-light">hello@moodlift.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:pl-8">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-8 text-white/90">Curated For You</h3>
            <ul className="space-y-5 text-sm text-[#888] font-light">
              <li><Link href="/shop" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1">Shop All<span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A67C52] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
              <li><Link href="/sale" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1 text-[#A67C52] group-hover:text-[#C9A26B]">Exclusive Sale<span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A67C52] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
              <li><Link href="/about" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1">Our Heritage<span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#A67C52] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-8 text-white/90">Client Services</h3>
            <ul className="space-y-5 text-sm text-[#888] font-light">
              <li><Link href="/contact" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1">Contact Us<span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
              <li><Link href="/shipping" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1">Shipping & Delivery<span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
              <li><Link href="/returns" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1">Returns & Exchanges<span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
              <li><Link href="/size-guide" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1">Size Guide<span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
              <li><Link href="/faq" className="group inline-flex items-center hover:text-white transition-colors duration-300"><span className="relative overflow-hidden pb-1">FAQ<span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/50 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span></span></Link></li>
            </ul>
          </div>

          {/* Column 4: Socials & Vibe */}
          <div className="flex flex-col space-y-8">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-6 text-white/90">Social</h3>
              <div className="flex justify-center md:justify-start gap-4">
                <Link href="https://www.instagram.com/moodlift_clothing?igsh=NDk5YWdvNjdqODhx" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#A67C52] hover:bg-[#A67C52]/10 text-[#888] hover:text-[#A67C52] transition-all duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="https://www.facebook.com/share/1DWNyAYqNy/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#A67C52] hover:bg-[#A67C52]/10 text-[#888] hover:text-[#A67C52] transition-all duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="https://www.tiktok.com/@moodlift.clothing?_r=1&_t=ZS-98ftEuYaKaC" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#A67C52] hover:bg-[#A67C52]/10 text-[#888] hover:text-[#A67C52] transition-all duration-300">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  <span className="sr-only">TikTok</span>
                </Link>
              </div>
            </div>
            
            {/* Minimalist aesthetic image placeholder */}
            <Link href="/shop" className="relative block w-full h-32 overflow-hidden rounded-lg group cursor-pointer">
              <Image 
                src="/images/logo.jpg" 
                alt="Brand Aesthetic" 
                fill 
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover opacity-30 group-hover:opacity-50 transition-all duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span className="text-white font-serif tracking-widest text-xs uppercase">Discover</span>
                <ArrowRight className="w-4 h-4 text-[#A67C52]" />
              </div>
            </Link>
          </div>
        </div>
        
        {/* Zone C: Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-xs text-[#666] gap-4 md:gap-0 font-light text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Moodlift Clothing. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
