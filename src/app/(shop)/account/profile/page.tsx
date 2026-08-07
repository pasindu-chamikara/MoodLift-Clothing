"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsLoading(true);
      try {
        await login(name, email);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      } catch (error) {
        console.error("Failed to update profile", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href="/account" className="inline-flex items-center text-xs uppercase tracking-widest text-[#6B7280] hover:text-[#111111] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Account
        </Link>
        
        <h1 className="font-serif text-4xl text-[#1F1F1F] mb-10">Profile Details</h1>

        <div className="bg-white border border-[#111111]/10 p-8 md:p-12">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Full Name</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] transition-colors bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Email Address</label>
              <input 
                type="email"
                required
                disabled
                value={email}
                className="w-full border-b border-[#111111]/10 pb-2 pt-1 text-sm text-[#6B7280] bg-transparent cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>
            
            <div className="pt-4 flex items-center justify-between">
              <p className={`text-sm text-green-600 transition-opacity ${isSuccess ? 'opacity-100' : 'opacity-0'}`}>
                Profile updated successfully.
              </p>
              <Button type="submit" disabled={isLoading} className="bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-5 px-8">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
