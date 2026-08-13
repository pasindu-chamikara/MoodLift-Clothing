import Link from "next/link";
import Image from "next/image";

export function FeaturedCategories() {
  return (
    <section className="bg-brand-neutral py-12 md:py-16">
      <div className="container mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-16 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h2 className="text-3xl font-light tracking-tight md:text-5xl">Shop by <span className="font-serif italic text-brand-luxury">Collection</span></h2>
          <Link href="/collections" className="group text-sm font-medium tracking-wide uppercase hover:text-brand-luxury transition-colors flex items-center gap-2">
            Explore All
            <span className="block h-[1px] w-8 bg-current transition-all group-hover:w-12"></span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          <Link href="/collections/oversized" className="group relative block h-[60vh] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
              alt="Oversized"
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <h3 className="mb-3 font-serif text-3xl italic">Oversized</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Shop Now</p>
            </div>
          </Link>

          <Link href="/collections/graphic" className="group relative block h-[60vh] overflow-hidden lg:translate-y-8">
            <Image 
              src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1920&auto=format&fit=crop" 
              alt="Graphic"
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <h3 className="mb-3 font-serif text-3xl italic">Graphic</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Shop Now</p>
            </div>
          </Link>

          <Link href="/collections/basics" className="group relative block h-[60vh] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1920&auto=format&fit=crop" 
              alt="Plain Basics"
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <h3 className="mb-3 font-serif text-3xl italic">Plain Basics</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Shop Now</p>
            </div>
          </Link>

          <Link href="/collections/cropped" className="group relative block h-[60vh] overflow-hidden lg:translate-y-8">
            <Image 
              src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1920&auto=format&fit=crop" 
              alt="Cropped"
              fill
              className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <h3 className="mb-3 font-serif text-3xl italic">Cropped</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">Shop Now</p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
