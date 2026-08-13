export const metadata = {
  title: "Returns & Exchanges | MOODLIFT",
  description: "Returns and exchanges policy for MOODLIFT clothing.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl font-light tracking-tight text-[#222] sm:text-5xl mb-12 text-center">
        Returns & <span className="font-serif italic text-[#777]">Exchanges</span>
      </h1>
      <div className="space-y-6 text-[#555] leading-relaxed">
        <p>
          We want you to love your MOODLIFT purchase. If you are not completely satisfied, we gladly accept returns and exchanges within 30 days of receipt.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Conditions for Returns</h2>
        <p>
          To be eligible for a return or exchange, your item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">How to Initiate a Return</h2>
        <p>
          Please contact our support team with your order number to initiate a return. We will provide you with a return shipping label and instructions on how to send your package back to us.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Refunds</h2>
        <p>
          Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.
        </p>
      </div>
    </div>
  );
}
