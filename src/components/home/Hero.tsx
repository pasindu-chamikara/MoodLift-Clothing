"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-brand-primary">
      {/* Premium Background Image (Printed T-Shirt) */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </motion.div>

      <div className="container relative z-10 mx-auto flex h-full max-w-screen-2xl flex-col justify-end pb-24 md:pb-32 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl text-white"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-luxury md:text-sm">
            Comfort Meets Style
          </p>
          <h1 className="mb-8 font-sans text-[2.75rem] leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter">
            Wear Your <br className="hidden md:block" /> 
            <span className="font-serif italic text-brand-luxury">Mood</span>
          </h1>
          <p className="mb-8 max-w-lg text-sm text-white/80 md:text-base leading-relaxed tracking-wide">
            Elevate your everyday look with our premium collection of t-shirts. Bold graphics, luxurious comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <Link 
              href="/collections" 
              className="w-full sm:w-auto text-center group relative inline-flex h-12 items-center justify-center overflow-hidden bg-white px-10 text-xs font-semibold uppercase tracking-widest text-black transition-all hover:bg-brand-luxury hover:text-white"
            >
              <span className="relative z-10">Shop Now</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
