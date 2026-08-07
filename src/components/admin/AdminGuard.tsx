"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/store/useAdminAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, login } = useAdminAuth();
  const [isMounted, setIsMounted] = useState(false);
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // avoid hydration mismatch
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(password, username);
    setIsLoading(false);
    
    if (!success) {
      setError("Invalid credentials.");
    } else {
      setError("");
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 w-full max-w-md rounded-xl shadow-sm border border-[#E8E1D9]">
          <div className="flex flex-col items-center mb-8">
            <Image src="/images/logo.jpg" alt="Logo" width={48} height={48} className="rounded-sm mb-4" />
            <h1 className="text-2xl font-serif text-[#1E1E1E]">Admin Login</h1>
            <p className="text-sm text-[#8B6B61] mt-2">Sign in to manage Moodlift</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-[#EF4444]/10 text-[#EF4444] text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F] block mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-[#E8E1D9] p-3 text-sm focus:outline-none focus:border-[#A67C52] bg-white rounded-md"
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F] block mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E8E1D9] p-3 text-sm focus:outline-none focus:border-[#A67C52] bg-white rounded-md"
                placeholder="••••••••"
                required
              />
            </div>
            <Button disabled={isLoading} type="submit" className="w-full bg-[#111111] text-white hover:bg-black uppercase tracking-widest text-xs py-6 rounded-md">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
