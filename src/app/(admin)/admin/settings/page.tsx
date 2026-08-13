"use client";

import { useEffect, useState } from "react";
import { settingsService, productService } from "@/services/db";
import { StoreSettings, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useAdminAuth } from "@/store/useAdminAuth";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SettingsPage() {
  const { role: currentUserRole } = useAdminAuth();
  const isStaff = currentUserRole === 'staff';

  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "",
    contactEmail: "",
    supportPhone: "",
    currency: "LKR",
    flatShippingRate: 0,
    featuredProductId: "",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    shopTheLookTitle: "",
    shopTheLookDescription: "",
    promoBannerSubtitle: "",
    promoBannerTitle: "",
    promoBannerDescription: "",
    newArrivalsSubtitle: "",
    newArrivalsTitle: "",
    promoDiscountPercentage: 0,
    promoDiscountProductIds: [],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [shopTheLookImageFile, setShopTheLookImageFile] = useState<File | null>(null);
  const [promoBannerImageFile, setPromoBannerImageFile] = useState<File | null>(null);
  const [promoBannerImage2File, setPromoBannerImage2File] = useState<File | null>(null);
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [settingsData, productsData] = await Promise.all([
        settingsService.getSettings(),
        productService.getProducts()
      ]);

      if (settingsData) {
        setSettings(prev => ({ ...prev, ...settingsData }));
      }
      if (productsData) {
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");
    try {
      let finalSettings = { ...settings };

      if (heroImageFile) {
        const storageRef = ref(storage, `settings/${Date.now()}_hero_${heroImageFile.name}`);
        const snapshot = await uploadBytes(storageRef, heroImageFile);
        finalSettings.heroImage = await getDownloadURL(snapshot.ref);
      }
      if (shopTheLookImageFile) {
        const storageRef = ref(storage, `settings/${Date.now()}_shop_${shopTheLookImageFile.name}`);
        const snapshot = await uploadBytes(storageRef, shopTheLookImageFile);
        finalSettings.shopTheLookImage = await getDownloadURL(snapshot.ref);
      }
      if (promoBannerImageFile) {
        const storageRef = ref(storage, `settings/${Date.now()}_promo_${promoBannerImageFile.name}`);
        const snapshot = await uploadBytes(storageRef, promoBannerImageFile);
        finalSettings.promoBannerImage = await getDownloadURL(snapshot.ref);
      }
      if (promoBannerImage2File) {
        const storageRef = ref(storage, `settings/${Date.now()}_promo2_${promoBannerImage2File.name}`);
        const snapshot = await uploadBytes(storageRef, promoBannerImage2File);
        finalSettings.promoBannerImage2 = await getDownloadURL(snapshot.ref);
      }

      await settingsService.saveSettings(finalSettings);
      setSettings(finalSettings);
      setSaveMessage("Settings saved successfully.");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: (name === 'flatShippingRate' || name === 'promoDiscountPercentage') 
        ? (value === '' ? '' : parseFloat(value)) 
        : value
    }));
  };

  return (
    <AdminGuard allowedRoles={['super_admin', 'admin', 'staff']}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your global store preferences.</p>
        </div>

        <div className="rounded-md border bg-card p-6">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading settings...</div>
          ) : (
            <div className="space-y-6">

              <form onSubmit={handleSave} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">General Information</h3>
                  <Button type="submit" size="sm" variant="outline" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="storeName" className="text-sm font-medium">Store Name</label>
                    <input
                      id="storeName"
                      name="storeName"
                      value={settings.storeName}
                      onChange={handleChange}
                      disabled
                      className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="MOODLIFT"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</label>
                    <input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="contact@moodlift.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="supportPhone" className="text-sm font-medium">Support Phone</label>
                    <input
                      id="supportPhone"
                      name="supportPhone"
                      type="tel"
                      value={settings.supportPhone}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </form>

              <form onSubmit={handleSave} className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">E-commerce Settings</h3>
                  <Button type="submit" size="sm" variant="outline" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="currency" className="text-sm font-medium">Currency</label>
                    <select
                      id="currency"
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="LKR">LKR (Rs)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="flatShippingRate" className="text-sm font-medium">Flat Shipping Rate</label>
                    <input
                      id="flatShippingRate"
                      name="flatShippingRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.flatShippingRate ?? ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="featuredProductId" className="text-sm font-medium">Featured Product (Home Page)</label>
                    <select
                      id="featuredProductId"
                      name="featuredProductId"
                      value={settings.featuredProductId || ""}
                      onChange={handleChange}
                      disabled={isStaff}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">None</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>{product.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>

              <form onSubmit={handleSave} className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Homepage Content</h3>
                  <Button type="submit" size="sm" variant="outline" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="heroTitle" className="text-sm font-medium">Hero Title</label>
                    <input
                      id="heroTitle"
                      name="heroTitle"
                      value={settings.heroTitle || ""}
                      onChange={handleChange}
                      disabled={isStaff}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Wear Confidence. Every Day."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="heroSubtitle" className="text-sm font-medium">Hero Subtitle</label>
                    <input
                      id="heroSubtitle"
                      name="heroSubtitle"
                      value={settings.heroSubtitle || ""}
                      onChange={handleChange}
                      disabled={isStaff}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="New Collection 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="heroDescription" className="text-sm font-medium">Hero Description</label>
                    <textarea
                      id="heroDescription"
                      name="heroDescription"
                      value={settings.heroDescription || ""}
                      onChange={handleChange}
                      disabled={isStaff}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Discover minimal, premium women's T-shirts..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="heroImage" className="text-sm font-medium">Hero Image</label>
                    <input
                      id="heroImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setHeroImageFile(e.target.files[0]);
                        }
                      }}
                      disabled={isStaff}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {settings.heroImage && !heroImageFile && <p className="text-xs text-muted-foreground">Current image: <a href={settings.heroImage} target="_blank" className="underline">View</a></p>}
                    {heroImageFile && <p className="text-xs text-green-600">New image selected</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="shopTheLookTitle" className="text-sm font-medium">Shop The Look Title</label>
                    <input
                      id="shopTheLookTitle"
                      name="shopTheLookTitle"
                      value={settings.shopTheLookTitle || ""}
                      onChange={handleChange}
                      disabled={isStaff}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Crafted for Everyday Confidence"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="shopTheLookDescription" className="text-sm font-medium">Shop The Look Description</label>
                    <textarea
                      id="shopTheLookDescription"
                      name="shopTheLookDescription"
                      value={settings.shopTheLookDescription || ""}
                      onChange={handleChange}
                      disabled={isStaff}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Our premium women's T-shirts are made from soft..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="shopTheLookImage" className="text-sm font-medium">Shop The Look Image</label>
                    <input
                      id="shopTheLookImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setShopTheLookImageFile(e.target.files[0]);
                        }
                      }}
                      disabled={isStaff}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {settings.shopTheLookImage && !shopTheLookImageFile && <p className="text-xs text-muted-foreground">Current image: <a href={settings.shopTheLookImage} target="_blank" className="underline">View</a></p>}
                    {shopTheLookImageFile && <p className="text-xs text-green-600">New image selected</p>}
                  </div>
                </div>
              </form>

              <form onSubmit={handleSave} className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Promotions & Campaigns</h3>
                  <Button type="submit" size="sm" variant="outline" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="promoBannerSubtitle" className="text-sm font-medium">Promo Banner Subtitle</label>
                    <input
                      id="promoBannerSubtitle"
                      name="promoBannerSubtitle"
                      value={settings.promoBannerSubtitle || ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Limited Time Only"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="promoBannerTitle" className="text-sm font-medium">Promo Banner Title</label>
                    <input
                      id="promoBannerTitle"
                      name="promoBannerTitle"
                      value={settings.promoBannerTitle || ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Mid-Season Sale"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="promoBannerDescription" className="text-sm font-medium">Promo Banner Description</label>
                    <textarea
                      id="promoBannerDescription"
                      name="promoBannerDescription"
                      value={settings.promoBannerDescription || ""}
                      onChange={handleChange}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Elevate your wardrobe with our premium printed tees..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="promoDiscountPercentage" className="text-sm font-medium">Promo Discount Percentage (%)</label>
                    <input
                      id="promoDiscountPercentage"
                      name="promoDiscountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.promoDiscountPercentage ?? ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Apply Discount to Products</label>
                    <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto p-4 border rounded-md bg-background">
                      {products.map(product => (
                        <label key={product.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(settings.promoDiscountProductIds || []).includes(product.id!)}
                            onChange={(e) => {
                              const currentSelected = settings.promoDiscountProductIds || [];
                              if (e.target.checked) {
                                setSettings(prev => ({ ...prev, promoDiscountProductIds: [...currentSelected, product.id!] }));
                              } else {
                                setSettings(prev => ({ ...prev, promoDiscountProductIds: currentSelected.filter(id => id !== product.id) }));
                              }
                            }}
                            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                          />
                          <span className="text-sm">{product.title}</span>
                        </label>
                      ))}
                      {products.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No products available.</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Select the products you want the discount to apply to.</p>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="promoBannerImage" className="text-sm font-medium">Promo Banner Image</label>
                    <input
                      id="promoBannerImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPromoBannerImageFile(e.target.files[0]);
                        }
                      }}
                      disabled={isStaff}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {settings.promoBannerImage && !promoBannerImageFile && <p className="text-xs text-muted-foreground">Current image: <a href={settings.promoBannerImage} target="_blank" className="underline">View</a></p>}
                    {promoBannerImageFile && <p className="text-xs text-green-600">New image selected</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="promoBannerImage2" className="text-sm font-medium">Promo Banner Image 2 (Optional)</label>
                    <input
                      id="promoBannerImage2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPromoBannerImage2File(e.target.files[0]);
                        }
                      }}
                      disabled={isStaff}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {settings.promoBannerImage2 && !promoBannerImage2File && <p className="text-xs text-muted-foreground">Current image: <a href={settings.promoBannerImage2} target="_blank" className="underline">View</a></p>}
                    {promoBannerImage2File && <p className="text-xs text-green-600">New image selected</p>}
                  </div>
                </div>
              </form>

              <div className="pt-6 border-t flex items-center justify-between">
                <p className={`text-sm ${saveMessage.includes('Failed') ? 'text-destructive' : 'text-green-600'}`}>
                  {saveMessage}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
