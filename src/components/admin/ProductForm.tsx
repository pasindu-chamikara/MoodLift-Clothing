"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product } from "@/types";
import { productService, settingsService } from "@/services/db";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  sizePrices: z.record(z.any()).optional(),
  colors: z.array(z.string()).optional(),
});

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
const AVAILABLE_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Red", hex: "#EF4444" },
  { name: "Green", hex: "#10B981" },
  { name: "Yellow", hex: "#F59E0B" },
  { name: "Orange", hex: "#F97316" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Beige", hex: "#F5F5DC" }
];

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);

  // Load featured status if editing
  useState(() => {
    if (initialData?.id) {
      settingsService.getSettings().then(settings => {
        if (settings?.featuredProductId === initialData.id) {
          setIsFeatured(true);
        }
      });
    }
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      imageUrl: initialData?.imageUrl || "",
      sizes: initialData?.sizes || [],
      sizePrices: initialData?.sizePrices || {},
      colors: initialData?.colors || [],
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);
    try {
      let finalImageUrl = data.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      const cleanSizePrices = Object.entries(data.sizePrices || {}).reduce((acc, [size, price]) => {
        if (price !== "" && price !== null && price !== undefined && !isNaN(Number(price)) && data.sizes.includes(size)) {
          acc[size] = Number(price);
        }
        return acc;
      }, {} as Record<string, number>);

      const productData = { ...data, imageUrl: finalImageUrl, sizePrices: cleanSizePrices };

      let productId = initialData?.id;

      if (productId) {
        await productService.updateProduct(productId, productData);
        toast.success("Product updated successfully");
      } else {
        productId = await productService.addProduct(productData);
        toast.success("Product created successfully");
      }

      // Handle featured product setting
      if (productId) {
        const settings = await settingsService.getSettings() || {
          storeName: "",
          contactEmail: "",
          supportPhone: "",
          currency: "USD",
          flatShippingRate: 0,
        };
        
        if (isFeatured) {
          await settingsService.saveSettings({ ...settings, featuredProductId: productId });
        } else if (settings.featuredProductId === productId) {
          await settingsService.saveSettings({ ...settings, featuredProductId: "" });
        }
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input 
            {...form.register("title")} 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Product Title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea 
            {...form.register("description")} 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Product Description"
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Price ($)</label>
            <input 
              type="number"
              step="0.01"
              {...form.register("price")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.price && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Stock</label>
            <input 
              type="number"
              {...form.register("stock")} 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {form.formState.errors.stock && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.stock.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Product Image</label>
          <input 
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {imageFile ? (
            <div className="mt-4 relative aspect-square w-40 overflow-hidden rounded-md border border-input">
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Preview" 
                className="object-cover w-full h-full"
              />
            </div>
          ) : initialData?.imageUrl ? (
            <div className="mt-4 relative aspect-square w-40 overflow-hidden rounded-md border border-input">
              <img 
                src={initialData.imageUrl} 
                alt="Current" 
                className="object-cover w-full h-full"
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Sizes & Specific Pricing (Optional)</label>
          <div className="flex flex-col gap-3">
            {AVAILABLE_SIZES.map(size => {
              const sizes = form.watch("sizes") || [];
              const isChecked = sizes.includes(size);
              return (
                <div key={size} className="flex items-center gap-4">
                  <label className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted min-w-[80px]">
                    <input 
                      type="checkbox" 
                      value={size}
                      {...form.register("sizes")} 
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{size}</span>
                  </label>
                  {isChecked && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <input
                        type="number"
                        step="0.01"
                        {...form.register(`sizePrices.${size}`)}
                        className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Base price"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {form.formState.errors.sizes && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.sizes.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Colors</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map(color => (
              <label key={color.name} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-muted">
                <input 
                  type="checkbox" 
                  value={color.name}
                  {...form.register("colors")} 
                  className="rounded border-gray-300"
                />
                <div 
                  className="w-4 h-4 rounded-full border border-gray-200" 
                  style={{ backgroundColor: color.hex }} 
                />
                <span className="text-sm">{color.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-medium text-foreground block">Feature this product on the home page</span>
              <span className="text-xs text-muted-foreground block">This will replace the currently featured product in the 'Crafted for Everyday Confidence' section.</span>
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
