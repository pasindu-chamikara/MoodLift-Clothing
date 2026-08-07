"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NewArrivalsBanner() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden group">
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] ease-out group-hover:scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-black/40 transition-colors duration-[1s] group-hover:bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/90 text-sm tracking-[0.2em] uppercase mb-4 font-semibold">The Summer Collection</p>
        <h2 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tighter">
          New <span className="font-serif italic text-brand-luxury">Drops</span>
        </h2>
        <Link href="/new">
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-none px-10 py-6 uppercase tracking-widest text-xs transition-colors duration-500">
            Shop New Arrivals
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function SplitSaleBanner() {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-[70vh]">
      <div className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-full overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1500&auto=format&fit=crop')" }}
        />
      </div>
      <div className="w-full md:w-1/2 bg-brand-primary flex flex-col items-center justify-center p-12 md:p-24 text-center text-white">
        <p className="text-brand-luxury uppercase tracking-[0.2em] text-xs font-semibold mb-6">Limited Time Only</p>
        <h2 className="text-4xl md:text-6xl font-serif italic mb-8">Mid-Season Sale</h2>
        <p className="text-white/70 mb-12 text-sm md:text-base leading-relaxed max-w-md">
          Elevate your wardrobe with our premium printed tees. Enjoy up to 30% off selected styles. Use code <span className="text-white font-bold">MOODLIFT30</span> at checkout.
        </p>
        <Link href="/collections">
          <Button className="bg-white text-black hover:bg-brand-luxury hover:text-white rounded-none px-12 py-7 uppercase tracking-widest text-xs transition-colors duration-500">
            Shop The Sale
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function CategoryGridBanners() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 w-full h-auto">
      <CategoryBanner 
        title="Oversized" 
        image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
        link="/collections/oversized" 
      />
      <CategoryBanner 
        title="Graphic" 
        image="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1920&auto=format&fit=crop" 
        link="/collections/graphic" 
      />
      <CategoryBanner 
        title="Plain Basics" 
        image="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1920&auto=format&fit=crop" 
        link="/collections/basics" 
      />
      <CategoryBanner 
        title="Cropped" 
        image="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1920&auto=format&fit=crop" 
        link="/collections/cropped" 
      />
    </section>
  );
}

function CategoryBanner({ title, image, link }: { title: string, image: string, link: string }) {
  return (
    <Link href={link} className="relative h-[60vh] overflow-hidden group block">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="absolute inset-0 bg-black/20 transition-colors duration-[1s] group-hover:bg-black/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-white text-4xl font-serif italic tracking-wider mb-6 transition-transform duration-700 ease-out group-hover:-translate-y-3">{title}</h3>
        <span className="text-brand-luxury text-xs font-semibold uppercase tracking-[0.2em] opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:-translate-y-3">
          Explore
        </span>
      </div>
    </Link>
  );
}
