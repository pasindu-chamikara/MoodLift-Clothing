export const metadata = {
  title: "Terms of Service | MOODLIFT",
  description: "Terms of service for MOODLIFT clothing.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
      <h1 className="text-3xl font-light tracking-tight text-[#222] sm:text-5xl mb-12 text-center">
        Terms of <span className="font-serif italic text-[#777]">Service</span>
      </h1>
      <div className="space-y-6 text-[#555] leading-relaxed">
        <p>
          Welcome to MOODLIFT. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Use of Our Website</h2>
        <p>
          You may use our website for lawful purposes only. You must not use our site in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Product Information</h2>
        <p>
          We make every effort to display as accurately as possible the colors and images of our products. However, we cannot guarantee that your computer monitor's display of any color will be accurate.
        </p>
        <h2 className="text-xl font-medium text-[#222] mt-8">Changes to Terms</h2>
        <p>
          We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
        </p>
      </div>
    </div>
  );
}
