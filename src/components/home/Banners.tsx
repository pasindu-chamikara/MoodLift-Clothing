"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { settingsService } from "@/services/db";
import { StoreSettings } from "@/types";

export function NewArrivalsBanner() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await settingsService.getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  return (
    <section className="relative min-h-[15vh] w-full overflow-hidden group flex flex-col justify-center py-8">
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] ease-out group-hover:scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-black/40 transition-colors duration-[1s] group-hover:bg-black/50" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/80 text-xs tracking-[0.2em] uppercase mb-4 font-medium">
          {settings?.newArrivalsSubtitle || "JUST DROPPED"}
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 tracking-wide">
          {settings?.newArrivalsTitle ? (
            settings.newArrivalsTitle
          ) : (
            <>Fresh Styles <span className="italic">for Every Mood</span></>
          )}
        </h2>
        <Link href="/new">
          <Button variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black rounded-none px-10 py-6 uppercase tracking-[0.2em] text-[10px] transition-colors duration-500 bg-black/20 backdrop-blur-sm">
            Shop New Arrivals
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function SplitSaleBanner() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await settingsService.getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  return (
    <section className="flex flex-col md:flex-row w-full min-h-[15vh]">
      <div className="relative w-full md:w-1/2 min-h-[20vh] md:min-h-full overflow-hidden group flex flex-row">
        <div
          className="flex-1 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105 min-h-[20vh] md:min-h-full"
          style={{ backgroundImage: `url('${settings?.promoBannerImage || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1500&auto=format&fit=crop"}')` }}
        />
        {settings?.promoBannerImage2 && (
          <div
            className="flex-1 bg-cover bg-center transition-transform duration-[2s] ease-out group-hover:scale-105 min-h-[20vh] md:min-h-full"
            style={{ backgroundImage: `url('${settings?.promoBannerImage2}')` }}
          />
        )}
      </div>
      <div className="w-full md:w-1/2 bg-[#1A1A1A] flex flex-col items-center justify-center p-12 md:p-16 lg:p-24 text-center text-white">
        <p className="text-[#A67C52] uppercase tracking-[0.2em] text-[10px] font-medium mb-6">
          {settings?.promoBannerSubtitle || "LIMITED TIME OFFER"}
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 leading-tight">
          {settings?.promoBannerTitle ? (
            settings.promoBannerTitle
          ) : (
            <>Elevate Your <br/><span className="italic">Everyday Style</span></>
          )}
        </h2>
        <p className="text-white/60 mb-10 text-sm leading-relaxed max-w-sm font-light">
          {settings?.promoBannerDescription || (
            <>
              Elevate your wardrobe with our premium printed tees. Enjoy up to 30% off selected styles. Use code <span className="text-white font-medium">MOODLIFT30</span> at checkout.
            </>
          )}
        </p>
        <Link href="/sale">
          <Button className="bg-[#A67C52] hover:bg-[#8B6540] text-white rounded-none px-10 py-6 uppercase tracking-[0.2em] text-[10px] transition-colors duration-500 border-none">
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
        link="/oversized"
      />
      <CategoryBanner
        title="Graphic"
        image="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1920&auto=format&fit=crop"
        link="/graphic"
      />
      <CategoryBanner
        title="Plain Basics"
        image="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1920&auto=format&fit=crop"
        link="/basics"
      />
      <CategoryBanner
        title="Cropped"
        image="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1920&auto=format&fit=crop"
        link="/cropped"
      />
    </section>
  );
}

function CategoryBanner({ title, image, link }: { title: string, image: string, link: string }) {
  return (
    <Link href={link} className="relative h-[40vh] overflow-hidden group block">
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
