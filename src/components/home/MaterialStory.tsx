import Image from "next/image";

export function MaterialStory() {
  return (
    <section className="bg-transparent py-12 md:py-16">
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-center">
          
          <div className="order-1 max-w-lg md:pr-12 flex flex-col items-center text-center px-4 md:px-8 mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] mb-6 tracking-tight">
              Premium Fabric. <br className="hidden md:block"/>
              <span className="font-serif italic text-[#C9A26B]">Everyday Comfort.</span>
            </h2>
            <p className="text-[#444] font-light text-base md:text-lg leading-relaxed mb-8">
              Every Mood Lift T-shirt is crafted from premium cotton that's soft, breathable, and gentle on your skin.
            </p>
            <p className="text-[#444] font-light text-base md:text-lg leading-relaxed">
              Carefully finished stitching and pre-shrunk fabric help each piece maintain its shape and comfort, so you can enjoy the same perfect fit and confidence every time you wear it.
            </p>
          </div>

          <div className="order-2 grid grid-cols-2 gap-2 md:gap-4">
            <div className="relative aspect-square w-full bg-[#f5f5f5]">
              <Image 
                src="/images/premium1.jpg"
                alt="Premium Fabric"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square w-full bg-[#f5f5f5] mt-12">
              <Image 
                src="/images/premium2.jpg"
                alt="Everyday Comfort"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
