"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
  "/images/her01.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
  "/images/hero5.jpg",
  "/images/hero6.jpg"
];

export function MinimalistHero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[90vh] lg:h-auto lg:min-h-[60vh] flex flex-col lg:flex-row items-center overflow-hidden lg:bg-gradient-to-br lg:from-[#FFF8F7] lg:to-[#F4EEE9] lg:px-8">
      
      {/* Background/Right Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="absolute inset-0 lg:relative lg:w-[55%] flex justify-center lg:justify-end items-stretch z-0 lg:z-10 lg:order-2"
      >
        <div className="relative w-full h-full lg:max-w-xl lg:h-auto lg:min-h-[550px] overflow-hidden lg:shadow-2xl bg-[#111]">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImage}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image 
                src={heroImages[currentImage]} 
                alt={`Premium Women's T-Shirt Model ${currentImage + 1}`} 
                fill
                className="object-cover object-top opacity-80 lg:opacity-100"
                priority
              />
            </motion.div>
          </AnimatePresence>
          {/* Mobile Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:hidden z-10" />
        </div>
        {/* Decorative Background Blob (Desktop only) */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C9A26B]/5 rounded-full blur-[100px] -z-10"></div>
      </motion.div>

      {/* Foreground/Left Content */}
      <div className="container mx-auto max-w-screen-2xl h-full flex flex-col justify-end lg:justify-center relative z-20 px-4 lg:px-0 pb-12 lg:pb-0 pointer-events-none lg:w-[45%] lg:order-1">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left pointer-events-auto lg:pl-12"
        >
          <span className="text-white/80 lg:text-[#C9A26B] text-[10px] lg:text-xs font-semibold uppercase tracking-[0.2em] mb-3 2xl:mb-4 drop-shadow-md lg:drop-shadow-none">
            New Collection 2026
          </span>
          
          <h1 className="text-[2.5rem] sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-[5rem] font-serif text-white lg:text-[#1F1F1F] leading-[1.1] tracking-tight mb-3 2xl:mb-4 drop-shadow-lg lg:drop-shadow-none">
            Wear Confidence.<br />
            <span className="italic">Every Day.</span>
          </h1>
          
          <p className="text-white/90 lg:text-[#6B7280] text-xs md:text-sm 2xl:text-base max-w-md leading-relaxed mb-2 font-sans drop-shadow-md lg:drop-shadow-none">
            Discover premium women's T-shirts crafted with soft fabrics, timeless designs, and effortless style.
          </p>
          <p className="text-white/90 lg:text-[#6B7280] text-xs md:text-sm 2xl:text-base max-w-md leading-relaxed mb-6 2xl:mb-8 font-sans drop-shadow-md lg:drop-shadow-none">
            Minimal, premium women's T-shirts designed for comfort and confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-6 2xl:mb-12 w-full sm:w-auto justify-center">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto text-center bg-white text-black lg:bg-[#111111] lg:text-white px-6 py-3 rounded-none text-xs font-medium hover:bg-gray-100 lg:hover:bg-black transition-transform hover:-translate-y-1 shadow-xl lg:shadow-lg"
            >
              Shop Now
            </Link>
            <Link 
              href="/about" 
              className="w-full sm:w-auto text-center bg-transparent border border-white text-white lg:border-[#111111] lg:text-[#111111] px-6 py-3 rounded-none text-xs font-medium hover:bg-white/10 lg:hover:bg-white transition-transform hover:-translate-y-1 shadow-md lg:shadow-sm backdrop-blur-sm lg:backdrop-blur-none"
            >
              Our Story
            </Link>
          </div>

          {/* Statistics Section */}
          <div className="flex items-center justify-center lg:justify-start gap-6 md:gap-10 pt-4 2xl:pt-6 border-t border-white/20 lg:border-[#111111]/10 w-full max-w-sm lg:max-w-none">
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl 2xl:text-2xl font-serif text-white lg:text-[#1F1F1F] font-semibold drop-shadow-md lg:drop-shadow-none">10K+</span>
              <span className="text-[9px] 2xl:text-[10px] text-white/70 lg:text-[#6B7280] uppercase tracking-wider">Happy Customers</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl 2xl:text-2xl font-serif text-white lg:text-[#1F1F1F] font-semibold drop-shadow-md lg:drop-shadow-none">50+</span>
              <span className="text-[9px] 2xl:text-[10px] text-white/70 lg:text-[#6B7280] uppercase tracking-wider">Premium Designs</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl 2xl:text-2xl font-serif text-white lg:text-[#1F1F1F] font-semibold drop-shadow-md lg:drop-shadow-none">4.9★</span>
              <span className="text-[9px] 2xl:text-[10px] text-white/70 lg:text-[#6B7280] uppercase tracking-wider">Customer Rating</span>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
