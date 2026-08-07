"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SplitSaleBanner } from "@/components/home/Banners";
import { motion } from "framer-motion";

export default function AboutContent() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-[#1F1F1F]">
      
      {/* Editorial Header */}
      <section className="w-full pt-8 pb-4 md:pt-12 md:pb-8 px-4 overflow-hidden">
        <motion.div 
          className="container mx-auto max-w-5xl text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className="text-sm md:text-base font-semibold uppercase tracking-[0.3em] text-[#C9A26B] mb-8">
            The Moodlift Story
          </motion.h1>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-8xl font-serif italic tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Clothing that speaks your mood.
          </motion.h2>
        </motion.div>
      </section>

      {/* Chapter 1: The Process (Sewing) */}
      <section className="w-full py-4 md:py-8 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <motion.div 
              className="w-full lg:w-1/2 order-2 lg:order-1 space-y-4 lg:pl-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp} className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Chapter 01 &mdash; Craftsmanship</motion.span>
              <motion.h3 variants={fadeInUp} className="text-3xl md:text-4xl font-serif">Every stitch matters.</motion.h3>
              <motion.p variants={fadeInUp} className="text-[#6B7280] leading-relaxed font-sans text-sm md:text-base max-w-md">
                We believe what you wear is a reflection of how you feel. That's why every Moodlift garment begins with a relentless dedication to quality. From the initial pattern to the final seam, our skilled artisans ensure that comfort is woven into the very fabric of our collections.
              </motion.p>
            </motion.div>
            <motion.div 
              className="w-4/5 sm:w-2/3 lg:w-1/3 max-w-sm order-1 lg:order-2 mx-auto lg:mx-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative w-full aspect-[4/5] bg-[#F2F2F2] overflow-hidden">
                <img 
                  src="/images/sewing.jpg" 
                  alt="Sewing Process" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-[2s] ease-out"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chapter 2: The Details (T-Shirts) */}
      <section className="w-full py-4 md:py-8 bg-transparent overflow-hidden">
        <div className="container mx-auto max-w-2xl px-4">
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
             <motion.span variants={fadeInUp} className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Chapter 02 &mdash; The Details</motion.span>
             <motion.h3 variants={fadeInUp} className="text-3xl md:text-4xl font-serif mt-4">Premium blanks.</motion.h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="relative aspect-[3/4] bg-[#F2F2F2] overflow-hidden group w-4/5 sm:w-2/3 md:w-full mx-auto md:mx-0"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <img 
                src="/images/t.jpg" 
                alt="T-Shirt Detail 1" 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute bottom-6 left-6 text-white bg-black/30 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-widest font-semibold">
                Texture
              </div>
            </motion.div>
            <motion.div 
              className="relative aspect-[3/4] bg-[#F2F2F2] overflow-hidden group md:translate-y-16 w-4/5 sm:w-2/3 md:w-full mx-auto md:mx-0"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 64 }} /* 64px is translate-y-16 equivalent to keep layout */
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <img 
                src="/images/t1.jpg" 
                alt="T-Shirt Detail 2" 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[2s] ease-out"
              />
              <div className="absolute bottom-6 left-6 text-white bg-black/30 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-widest font-semibold">
                Form
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chapter 3: The Print (Printing Machine) */}
      <section className="w-full py-6 md:py-10 overflow-hidden">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            <motion.div 
              className="w-4/5 sm:w-2/3 lg:w-1/3 max-w-sm mx-auto lg:mx-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative w-full aspect-[4/5] bg-[#F2F2F2] overflow-hidden">
                <img 
                  src="/images/printmachine.jpg" 
                  alt="Printing Machine" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-[2s] ease-out"
                />
              </div>
            </motion.div>
            <motion.div 
              className="w-full lg:w-1/2 space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeInUp} className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Chapter 03 &mdash; Expression</motion.span>
              <motion.h3 variants={fadeInUp} className="text-3xl md:text-4xl font-serif">Art on canvas.</motion.h3>
              <motion.p variants={fadeInUp} className="text-[#6B7280] leading-relaxed font-sans text-sm md:text-base max-w-md">
                Our graphics aren't just printed; they are embedded into the fabric using state-of-the-art machinery. We ensure that every piece of art retains its vibrancy and texture wash after wash, allowing you to express your true self without fading.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reusable Banners Component */}
      <SplitSaleBanner />

      {/* Simple Text CTA */}
      <section className="w-full py-8 md:py-12 bg-transparent border-t border-[#111111]/10 text-center overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 md:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif text-[#1F1F1F] mb-6">Experience the quality.</motion.h2>
          <motion.div variants={fadeInUp}>
            <Link href="/shop">
              <Button className="bg-[#111111] text-white hover:bg-black rounded-none px-10 py-6 uppercase tracking-widest text-xs transition-colors duration-500">
                Shop The Product
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
