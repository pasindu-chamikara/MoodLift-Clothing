"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@/store/useAuth";

export default function AddressesPage() {
  const { addresses, setAddresses } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
    isDefault: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async (id: number) => {
    try {
      await setAddresses(addresses.filter(address => address.id !== id));
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.name && newAddress.street && newAddress.city && newAddress.postalCode && newAddress.phone) {
      setIsSaving(true);
      try {
        await setAddresses([
          ...addresses,
          { ...newAddress, id: Date.now() }
        ]);
        setIsAdding(false);
        setNewAddress({ name: "", street: "", city: "", postalCode: "", phone: "", isDefault: false });
      } catch (error) {
        console.error("Failed to add address", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="bg-transparent min-h-screen py-12 md:py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/account" className="inline-flex items-center text-xs uppercase tracking-widest text-[#6B7280] hover:text-[#111111] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Account
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="font-serif text-4xl text-[#1F1F1F]">Saved Addresses</h1>
          {!isAdding && (
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-5 px-6 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Address
            </Button>
          )}
        </div>

        {isAdding ? (
          <div className="bg-white border border-[#111111]/10 p-8 md:p-12 mb-10">
            <h2 className="font-serif text-2xl text-[#1F1F1F] mb-6">Add New Address</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Full Name</label>
                  <input type="text" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Telephone Number</label>
                  <input type="tel" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Street Address</label>
                  <input type="text" required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">City</label>
                  <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Postal Code</label>
                  <input type="text" required value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} className="w-full border-b border-[#111111]/20 pb-2 pt-1 text-sm focus:outline-none focus:border-[#111111] bg-transparent" />
                </div>
                <div className="space-y-2 md:col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="isDefault" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} />
                  <label htmlFor="isDefault" className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F]">Set as default address</label>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-[#111111]/10">
                <Button type="button" onClick={() => setIsAdding(false)} variant="outline" className="border-[#111111]/20 text-[#1F1F1F] hover:bg-[#F2F2F2] rounded-none uppercase tracking-widest text-xs py-5 px-8">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-5 px-8">
                  {isSaving ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.length === 0 ? (
              <div className="md:col-span-2 text-center py-10 bg-white border border-[#111111]/10 text-[#6B7280]">
                You don't have any saved addresses.
              </div>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="bg-white border border-[#111111]/10 p-6 flex flex-col h-full relative">
                  {address.isDefault && (
                    <span className="absolute top-6 right-6 text-[10px] font-semibold uppercase tracking-widest bg-[#F2F2F2] px-2 py-1 text-[#1F1F1F]">
                      Default
                    </span>
                  )}
                  <h3 className="font-serif text-xl text-[#1F1F1F] mb-4">{address.name}</h3>
                  <div className="text-sm text-[#6B7280] space-y-1 mb-6 flex-grow">
                    <p>{address.street}</p>
                    <p>{address.city}, {address.postalCode}</p>
                    <p className="pt-2">{address.phone}</p>
                  </div>
                  
                  <div className="flex gap-4 border-t border-[#111111]/10 pt-4 mt-auto">
                    <button className="flex items-center gap-1 text-xs uppercase tracking-widest text-[#1F1F1F] hover:text-[#6B7280] transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(address.id)}
                      className="flex items-center gap-1 text-xs uppercase tracking-widest text-[#EF4444] hover:text-[#DC2626] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
