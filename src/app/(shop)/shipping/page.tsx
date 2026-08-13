export const metadata = {
  title: "Shipping Policy | MOODLIFT",
  description: "Shipping policy for MOODLIFT clothing.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl font-light tracking-tight text-[#222] sm:text-5xl mb-12 text-center">
        Shipping <span className="font-serif italic text-[#777]">Policy</span>
      </h1>
      <div className="space-y-6 text-[#555] leading-relaxed">
        <p>
          At MOODLIFT, we strive to deliver your premium T-shirts as quickly and efficiently as possible. We offer standard and expedited shipping options at checkout.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Processing Time</h2>
        <p>
          All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Shipping Rates & Delivery Estimates</h2>
        <p>
          Shipping charges for your order will be calculated and displayed at checkout. Standard shipping generally takes 3-5 business days. Delivery delays can occasionally occur.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">International Shipping</h2>
        <p>
          We currently ship to select international destinations. Please note that customs duties and taxes may apply upon delivery, and these are the responsibility of the customer.
        </p>
      </div>
    </div>
  );
}
