export const metadata = {
  title: "Privacy Policy | MOODLIFT",
  description: "Privacy policy for MOODLIFT clothing.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl font-light tracking-tight text-[#222] sm:text-5xl mb-12 text-center">
        Privacy <span className="font-serif italic text-[#777]">Policy</span>
      </h1>
      <div className="space-y-6 text-[#555] leading-relaxed">
        <p>
          Your privacy is important to us. This Privacy Policy outlines how MOODLIFT collects, uses, and protects your personal information when you visit and use our website.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, shipping address, and payment information.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">How We Use Your Information</h2>
        <p>
          We use your information to process transactions, deliver your orders, and communicate with you about products, services, and promotional offers. We do not sell your personal information to third parties.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>
      </div>
    </div>
  );
}
