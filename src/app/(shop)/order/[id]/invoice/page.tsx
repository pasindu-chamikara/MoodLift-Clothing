"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/services/db";

export default function InvoicePage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (id) {
      orderService.getOrder(id).then(fetchedOrder => {
        setOrder(fetchedOrder);
        // Automatically open print dialog after a short delay to ensure rendering
        setTimeout(() => {
          window.print();
        }, 500);
      });
    }
  }, [id]);

  if (!order) return <div className="p-10 text-center font-serif text-xl">Loading Invoice...</div>;

  const formatCurrency = (amount: number) => `Rs. ${amount?.toLocaleString() || 0}`;

  return (
    <div className="bg-white min-h-screen text-black p-8 md:p-16 max-w-4xl mx-auto font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .invoice-container, .invoice-container * { visibility: visible; }
          .invoice-container { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />

      <div className="invoice-container">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight uppercase">Moodlift</h1>
            <p className="text-sm mt-2 text-gray-600">The Premium Clothing Experience</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-800">Invoice</h2>
            <p className="text-sm mt-1"><span className="font-semibold">Invoice No:</span> {order.friendlyId || `#ML-${(order.id || "").slice(0, 5).toUpperCase()}`}</p>
            <p className="text-sm"><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="flex justify-between mb-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Billed To</h3>
            <p className="font-semibold">{order.customerName}</p>
            <p className="text-sm">{order.customerEmail}</p>
            {order.shippingAddress && (
              <div className="text-sm mt-1">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              </div>
            )}
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Shipped From</h3>
            <p className="font-semibold">Moodlift Inc.</p>
            <p className="text-sm">123 Fashion Ave</p>
            <p className="text-sm">New York, NY 10001</p>
            <p className="text-sm">support@moodlift.com</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-10 text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black uppercase text-xs tracking-widest">
              <th className="py-3 font-semibold">Item Description</th>
              <th className="py-3 font-semibold text-center">Qty</th>
              <th className="py-3 font-semibold text-right">Price</th>
              <th className="py-3 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item: any, i: number) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-4">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Color: {item.color || 'N/A'}</p>
                </td>
                <td className="py-4 text-center">{item.quantity}</td>
                <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                <td className="py-4 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency((order.items || []).reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping (COD)</span>
              <span>{formatCurrency(order.totalAmount - (order.items || []).reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0))}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-black pt-3">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Thank you for shopping with Moodlift. We appreciate your business.</p>
          <p className="mt-1">If you have any questions concerning this invoice, contact our support team.</p>
        </div>
      </div>
    </div>
  );
}
