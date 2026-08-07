import Image from "next/image";

export default function SizeGuidePage() {
  return (
    <div className="bg-transparent min-h-screen">
      {/* Header */}
      <div className="relative flex w-full flex-col items-center justify-center bg-gradient-to-br from-[#FFF8F7] to-[#F4EEE9] py-8 md:py-12 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C9A26B]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="z-10 flex flex-col items-center text-center px-4">
          <span className="mb-3 text-[10px] lg:text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A26B]">Moodlift Clothing</span>
          <h1 className="font-serif text-5xl italic tracking-tight text-[#1F1F1F] md:text-6xl">Size Guide</h1>
          <p className="mt-4 text-[#6B7280] text-xs md:text-sm max-w-md font-sans">
            Find your perfect fit. Compare your measurements with our sizing chart below.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-screen-md px-4 py-12 md:py-24">
        <div className="mb-16 relative w-full aspect-[4/3] bg-white border border-[#111111]/10">
          <Image 
            src="/images/sizechart.jpg?v=2" 
            alt="Moodlift Size Chart"
            fill
            className="object-contain"
            unoptimized={true}
          />
        </div>

        <div className="mb-12">
          <h2 className="font-serif text-2xl text-[#1F1F1F] mb-6">How to Measure</h2>
          <ul className="list-disc pl-5 text-[#6B7280] space-y-3 font-sans">
            <li><strong>Bust:</strong> Measure under your arms at the fullest part of your bust.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape a bit loose.</li>
            <li><strong>Hips:</strong> Measure around the fullest part of your body at the top of your leg.</li>
          </ul>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-[#111111]/20">
                <th className="py-4 px-4 font-semibold text-[#111111] uppercase text-xs tracking-widest">Size</th>
                <th className="py-4 px-4 font-semibold text-[#111111] uppercase text-xs tracking-widest">UK Size</th>
                <th className="py-4 px-4 font-semibold text-[#111111] uppercase text-xs tracking-widest">Bust (cm)</th>
                <th className="py-4 px-4 font-semibold text-[#111111] uppercase text-xs tracking-widest">Waist (cm)</th>
                <th className="py-4 px-4 font-semibold text-[#111111] uppercase text-xs tracking-widest">Hips (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#111111]/10 hover:bg-[#F9F9F9] transition-colors">
                <td className="py-4 px-4 text-sm font-semibold text-[#1F1F1F]">XS</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">6</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">80 - 83</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">62 - 65</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">88 - 91</td>
              </tr>
              <tr className="border-b border-[#111111]/10 hover:bg-[#F9F9F9] transition-colors">
                <td className="py-4 px-4 text-sm font-semibold text-[#1F1F1F]">S</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">8 - 10</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">84 - 88</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">66 - 70</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">92 - 96</td>
              </tr>
              <tr className="border-b border-[#111111]/10 hover:bg-[#F9F9F9] transition-colors">
                <td className="py-4 px-4 text-sm font-semibold text-[#1F1F1F]">M</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">12 - 14</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">89 - 94</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">71 - 76</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">97 - 102</td>
              </tr>
              <tr className="border-b border-[#111111]/10 hover:bg-[#F9F9F9] transition-colors">
                <td className="py-4 px-4 text-sm font-semibold text-[#1F1F1F]">L</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">16</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">95 - 101</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">77 - 83</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">103 - 109</td>
              </tr>
              <tr className="border-b border-[#111111]/10 hover:bg-[#F9F9F9] transition-colors">
                <td className="py-4 px-4 text-sm font-semibold text-[#1F1F1F]">XL</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">18</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">102 - 108</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">84 - 90</td>
                <td className="py-4 px-4 text-sm text-[#6B7280]">110 - 116</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
