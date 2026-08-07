"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    stars: "★★★★★",
    text: `"The oversized tees are exactly what I've been looking for. The quality of the print and the weight of the cotton is unmatched."`,
    author: "- Alex R."
  },
  {
    stars: "★★★★★",
    text: `"Comfort meets style indeed. I practically live in my minimalist collection now. Fast shipping and great packaging."`,
    author: "- Sarah M."
  },
  {
    stars: "★★★★★",
    text: `"The vintage graphics are so unique. Every time I wear one out, I get asked where I got it from. New favorite brand."`,
    author: "- Jason K."
  }
];

export function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 md:py-24 bg-brand-neutral">
      <div className="container mx-auto max-w-screen-2xl px-4 md:px-8 text-center">
        <h2 className="mb-12 text-3xl font-light tracking-tight md:text-5xl">What They <span className="font-serif italic text-brand-luxury">Say</span></h2>
        
        {/* Desktop View: Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8 text-left">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8">
              <div className="flex gap-1 mb-4 text-brand-luxury">
                {review.stars}
              </div>
              <p className="text-sm leading-relaxed mb-6">{review.text}</p>
              <p className="text-xs font-semibold uppercase tracking-widest">{review.author}</p>
            </div>
          ))}
        </div>

        {/* Mobile View: Auto Carousel */}
        <div className="md:hidden relative w-full h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-white p-8 text-left flex flex-col justify-center shadow-sm"
            >
              <div className="flex gap-1 mb-4 text-brand-luxury">
                {reviews[activeIndex].stars}
              </div>
              <p className="text-sm leading-relaxed mb-6">{reviews[activeIndex].text}</p>
              <p className="text-xs font-semibold uppercase tracking-widest">{reviews[activeIndex].author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Mobile Carousel Indicators */}
        <div className="md:hidden flex justify-center gap-2 mt-6">
          {reviews.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-brand-luxury w-4' : 'bg-gray-300'}`} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}
