"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const msg = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    
    try {
      const { messageService } = await import("@/services/db");
      await messageService.addMessage(msg);
      toast.success("Message sent successfully! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-24 sm:py-32">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-light tracking-tight text-[#222] sm:text-5xl mb-4">
            Get in <span className="font-serif italic text-[#777]">Touch</span>
          </h1>
          <p className="text-[#777] text-sm md:text-base leading-relaxed">
            Have a question about an order, sizing, or styling? We're here to help. 
            Fill out the form below or reach us directly through our contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Information */}
          <div className="order-2 lg:order-1 flex flex-col justify-center space-y-10">
            <div>
              <h3 className="text-lg font-medium tracking-wide text-[#222] mb-6 uppercase text-sm">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-[#777] mt-0.5 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-[#222]">Email</p>
                    <a href="mailto:amayafashion508@gmail.com" className="text-sm text-[#777] hover:text-[#222] transition-colors">
                      amayafashion508@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#777] mt-0.5 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-[#222]">WhatsApp</p>
                    <a href="https://wa.me/94741805800" target="_blank" rel="noopener noreferrer" className="text-sm text-[#777] hover:text-[#222] transition-colors">
                      0741805800
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-[#777] mt-0.5 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-[#222]">Studio</p>
                    <p className="text-sm text-[#777] leading-relaxed">
                      123 Fashion Avenue<br />
                      Suite 400<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-[#777] mt-0.5 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-[#222]">Hours</p>
                    <p className="text-sm text-[#777] leading-relaxed">
                      Monday - Friday: 9am - 6pm EST<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-[#e5e5e5]">
              <p className="text-sm text-[#777]">
                Looking for answers right away? Check out our <a href="/faq" className="text-[#222] border-b border-[#222] pb-0.5 hover:text-[#555] hover:border-[#555] transition-colors">FAQ page</a>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="order-1 lg:order-2 bg-white p-8 sm:p-10 border border-[#e5e5e5]">
            <h2 className="text-xl font-light text-[#222] mb-8">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-xs font-medium text-[#777] uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="flex h-12 w-full border-b border-[#ddd] bg-transparent px-0 py-2 text-sm outline-none transition-colors placeholder:text-[#aaa] focus:border-[#222] text-[#222]"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-xs font-medium text-[#777] uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="flex h-12 w-full border-b border-[#ddd] bg-transparent px-0 py-2 text-sm outline-none transition-colors placeholder:text-[#aaa] focus:border-[#222] text-[#222]"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-[#777] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="flex h-12 w-full border-b border-[#ddd] bg-transparent px-0 py-2 text-sm outline-none transition-colors placeholder:text-[#aaa] focus:border-[#222] text-[#222]"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="subject" className="text-xs font-medium text-[#777] uppercase tracking-wider">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="flex h-12 w-full border-b border-[#ddd] bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-[#222] text-[#222] appearance-none"
                  required
                  defaultValue=""
                >
                  <option value="" disabled className="text-[#aaa]">Select a topic</option>
                  <option value="order">Order Inquiry</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="sizing">Sizing & Fit</option>
                  <option value="press">Press & Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-medium text-[#777] uppercase tracking-wider">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="flex w-full border-b border-[#ddd] bg-transparent px-0 py-2 text-sm outline-none transition-colors placeholder:text-[#aaa] focus:border-[#222] text-[#222] resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-none bg-[#222] px-8 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#555] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
