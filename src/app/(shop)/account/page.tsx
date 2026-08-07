"use client";

import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccountPage() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && (isLoginMode || name)) {
      setIsLoading(true);
      try {
        // If login mode, pass empty name to preserve existing name in DB
        await login(isLoginMode ? "" : name, email);
      } catch (error) {
        console.error("Auth failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-transparent min-h-screen py-12 md:py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#111111]/10 p-10">
          <h1 className="font-serif text-3xl text-[#1F1F1F] mb-2 text-center">
            {isLoginMode ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-[#6B7280] mb-8 text-sm text-center">
            {isLoginMode ? "Enter your details below to access your account." : "Register below to create your account."}
          </p>
          
          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Full Name</label>
                <input 
                  type="text"
                  required={!isLoginMode}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] transition-colors bg-transparent"
                  placeholder="Jane Doe"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] transition-colors bg-transparent"
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] transition-colors bg-transparent"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-6 mt-4">
              {isLoading ? (isLoginMode ? "Signing In..." : "Creating Account...") : (isLoginMode ? "Sign In" : "Register")}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <button 
              type="button" 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-xs font-medium text-[#6B7280] hover:text-[#111111] transition-colors underline underline-offset-4 uppercase tracking-widest"
            >
              {isLoginMode ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="font-serif text-4xl text-[#1F1F1F] mb-2">My Account</h1>
            <p className="text-[#6B7280]">Welcome back, {user?.name}</p>
          </div>
          <Button 
            onClick={logout}
            variant="outline"
            className="border-[#111111] text-[#111111] hover:bg-[#F2F2F2] rounded-none uppercase tracking-widest text-xs py-5 px-8"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#111111]/10 p-8 flex flex-col items-center text-center">
            <h2 className="font-serif text-xl text-[#1F1F1F] mb-3">Order History</h2>
            <p className="text-[#6B7280] text-sm mb-6 flex-grow">Track your recent orders, view details, and manage returns.</p>
            <Link href="/order" className="w-full">
              <Button className="w-full bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-5">
                View Orders
              </Button>
            </Link>
          </div>
          
          <div className="bg-white border border-[#111111]/10 p-8 flex flex-col items-center text-center">
            <h2 className="font-serif text-xl text-[#1F1F1F] mb-3">Profile Details</h2>
            <p className="text-[#6B7280] text-sm mb-6 flex-grow">Manage your personal information and contact details.</p>
            <Link href="/account/profile" className="w-full">
              <Button variant="outline" className="w-full border-[#111111]/20 text-[#1F1F1F] hover:bg-[#F2F2F2] rounded-none uppercase tracking-widest text-xs py-5">
                Edit Profile
              </Button>
            </Link>
          </div>
          
          <div className="bg-white border border-[#111111]/10 p-8 flex flex-col items-center text-center">
            <h2 className="font-serif text-xl text-[#1F1F1F] mb-3">Saved Addresses</h2>
            <p className="text-[#6B7280] text-sm mb-6 flex-grow">Manage your shipping and billing addresses for faster checkout.</p>
            <Link href="/account/addresses" className="w-full">
              <Button variant="outline" className="w-full border-[#111111]/20 text-[#1F1F1F] hover:bg-[#F2F2F2] rounded-none uppercase tracking-widest text-xs py-5">
                View Addresses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
