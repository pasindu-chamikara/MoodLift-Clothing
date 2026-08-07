"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase for a full refund. Items must be unworn, unwashed, and in their original condition with tags attached. Please note that final sale items are not eligible for return."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days within the US. Expedited shipping is available at checkout for 1-2 business day delivery. International shipping times vary by destination, usually taking 7-14 business days."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. International shipping costs are calculated at checkout based on your location and the weight of your order. Please be aware that you may be responsible for customs duties and taxes."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you will receive a confirmation email containing a tracking number and a link to monitor your package's progress."
  },
  {
    question: "Are your materials sustainable?",
    answer: "We are committed to sustainability. Our core collection features organic cotton, recycled polyester, and eco-friendly dyes. We continually strive to improve our environmental footprint throughout our supply chain."
  },
  {
    question: "What should I do if my item is damaged?",
    answer: "We sincerely apologize if you receive a damaged or defective item. Please contact our customer support team within 7 days of receiving your order with your order number and photos of the damage, and we will arrange a replacement or refund."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-24 sm:py-32">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-3xl font-light tracking-tight text-[#222] sm:text-5xl mb-4">
            Frequently Asked <span className="font-serif italic text-[#777]">Questions</span>
          </h1>
          <p className="text-[#777] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our products, shipping, returns, and more. Can't find the answer you're looking for? Reach out to our customer support team.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={false}
              className="border border-[#e5e5e5] bg-white overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-medium tracking-wide text-[#222]">
                  {faq.question}
                </span>
                <span className="ml-6 flex items-center justify-center flex-shrink-0 text-[#777] transition-colors hover:text-[#222]">
                  {openIndex === index ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-6 pb-6 text-sm leading-relaxed text-[#777]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-[#777] mb-4">Still have questions?</p>
          <a 
            href="/contact" 
            className="inline-block border-b border-[#222] pb-1 text-sm font-medium tracking-wide text-[#222] transition-colors hover:text-[#555] hover:border-[#555]"
          >
            Contact Customer Support
          </a>
        </div>
      </div>
    </div>
  );
}
