"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { settingsService } from "@/services/db";
import { StoreSettings } from "@/types";

const heroImages = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
  "/images/hero5.jpg",
  "/images/hero6.jpg"
];

export function MinimalistHero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await settingsService.getSettings();
      setSettings(data);
    }
    loadSettings();

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full lg:h-[calc(100vh-80px)] min-h-screen lg:min-h-[70vh] flex items-center bg-[#F9F6F0]">
      <div className="w-full h-full flex flex-col lg:flex-row">
        
        {/* Right Image Area (Top on Mobile) */}
        <div className="relative w-full h-[50vh] lg:h-auto lg:w-[55%] flex justify-center lg:justify-end items-stretch z-0 lg:z-10 order-1 lg:order-2">
          <div className="relative w-full h-full lg:max-w-xl lg:min-h-[550px] overflow-hidden lg:shadow-2xl bg-[#111]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image 
                  src={settings?.heroImage || heroImages[currentImage]} 
                  alt="Premium Fashion" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover object-top opacity-100"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {/* Minimal gradient just at the bottom to transition smoothly on mobile if needed, though clean cut is also good */}
          </div>
          
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C9A26B]/5 rounded-full blur-[100px] -z-10"></div>
        </div>

        {/* Left Content Area (Bottom on Mobile) */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:pl-24 lg:pr-16 py-10 lg:py-0 relative z-10 order-2 lg:order-1 bg-[#F9F6F0]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h3 className="text-[#A67C52] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              {settings?.heroSubtitle || "New Collection 2026"}
            </h3>
            
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-serif text-[#1A1A1A] leading-[1.1] tracking-tight mb-4">
              {settings?.heroTitle || (
                <>
                  Wear Confidence.<br/>
                  Every Day.
                </>
              )}
            </h1>
            
            <p className="text-[#444] text-base lg:text-lg max-w-md leading-relaxed mb-8">
              {settings?.heroDescription || "Discover premium women's T-shirts crafted with soft fabrics for effortless style and comfort."}
            </p>
            
            <div className="flex flex-row gap-4 w-full sm:w-auto mb-10">
              <Link 
                href="/shop" 
                className="bg-[#1A1A1A] text-white px-8 py-3 text-sm font-medium hover:bg-black transition-colors"
              >
                Shop Now
              </Link>
              
              <Link 
                href="/about" 
                className="bg-transparent border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 text-sm font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                Our Story
              </Link>
            </div>
            
            {/* Stats section */}
            <div className="border-t border-[#ddd] pt-8 flex flex-row gap-10 md:gap-16">
              <div>
                <h4 className="text-2xl font-serif text-[#1A1A1A] font-bold mb-1">10K+</h4>
                <p className="text-[10px] text-[#777] uppercase tracking-wider font-semibold">Happy Customers</p>
              </div>
              <div>
                <h4 className="text-2xl font-serif text-[#1A1A1A] font-bold mb-1">50+</h4>
                <p className="text-[10px] text-[#777] uppercase tracking-wider font-semibold">Premium Designs</p>
              </div>
              <div>
                <h4 className="text-2xl font-serif text-[#1A1A1A] font-bold mb-1">4.9★</h4>
                <p className="text-[10px] text-[#777] uppercase tracking-wider font-semibold">Customer Rating</p>
              </div>
            </div>

          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
