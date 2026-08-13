"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/db";
import { Product } from "@/types";
import { Search, Save, Check, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleStockChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    setStockUpdates(prev => ({
      ...prev,
      [id]: isNaN(num) ? 0 : num
    }));
  };

  const handleSaveStock = async (id: string) => {
    if (stockUpdates[id] === undefined) return;
    
    setSavingId(id);
    try {
      await productService.updateProduct(id, { stock: stockUpdates[id] });
      setProducts(products.map(p => p.id === id ? { ...p, stock: stockUpdates[id] } : p));
      setSavedId(id);
      setTimeout(() => setSavedId(null), 2000);
    } catch (error) {
      console.error("Failed to update stock:", error);
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Inventory Report - MOODLIFT", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    
    const tableData = filteredProducts.map(product => [
      product.sku || 'N/A',
      product.title,
      product.category || 'N/A',
      `Rs. ${product.price}`,
      stockUpdates[product.id!] !== undefined ? stockUpdates[product.id!].toString() : product.stock.toString()
    ]);

    autoTable(doc, {
      startY: 27,
      head: [['Product No.', 'Product', 'Category', 'Price', 'Stock Level']],
      body: tableData,
    });

    doc.save(`inventory_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage stock levels for your products.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              className="h-9 w-full sm:w-64 rounded-md border border-input bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="h-9 gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No products found.</div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-32">Product No.</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-48">Stock Level</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle text-muted-foreground text-xs font-mono">{product.sku || 'N/A'}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="h-full w-full bg-secondary" />
                          )}
                        </div>
                        <span className="font-medium">{product.title}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle capitalize">{product.category || 'N/A'}</td>
                    <td className="p-4 align-middle">Rs. {product.price}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          min="0"
                          value={stockUpdates[product.id!] !== undefined ? stockUpdates[product.id!] : product.stock}
                          onChange={(e) => handleStockChange(product.id!, e.target.value)}
                          className={`w-24 rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-1 ${
                            product.stock === 0 ? 'border-red-500 text-red-600 bg-red-50' : 
                            product.stock < 10 ? 'border-orange-500 text-orange-600 bg-orange-50' : 
                            'border-input bg-transparent focus:ring-ring'
                          }`}
                        />
                        {product.stock === 0 && <span className="text-xs text-red-500 font-medium">Out</span>}
                        {product.stock > 0 && product.stock < 10 && <span className="text-xs text-orange-500 font-medium">Low</span>}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      {stockUpdates[product.id!] !== undefined && stockUpdates[product.id!] !== product.stock && (
                        <Button 
                          size="sm" 
                          onClick={() => handleSaveStock(product.id!)}
                          disabled={savingId === product.id}
                          className="h-8 gap-1 bg-[#111] hover:bg-black"
                        >
                          {savingId === product.id ? "Saving..." : <><Save className="h-3 w-3" /> Save</>}
                        </Button>
                      )}
                      {savedId === product.id && (
                        <span className="inline-flex items-center text-xs text-green-600 font-medium gap-1 h-8 px-2">
                          <Check className="h-3 w-3" /> Saved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
