import Image from "next/image";

export function InstagramGallery() {
  const images = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-screen-2xl px-4 md:px-8 text-center mb-12">
        <h2 className="mb-4 text-3xl font-light tracking-tight md:text-5xl">Shop our <span className="font-serif italic text-brand-luxury">Instagram</span></h2>
        <p className="text-sm text-muted-foreground">@moodliftclothing</p>
      </div>

      <div className="flex w-full overflow-hidden">
        {images.map((src, idx) => (
          <div key={idx} className="relative aspect-square w-1/2 md:w-1/5 flex-shrink-0 group cursor-pointer">
            <Image 
              src={src} 
              alt={`Instagram post ${idx + 1}`} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
              <span className="text-white text-sm font-semibold uppercase tracking-widest">Shop Look</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
