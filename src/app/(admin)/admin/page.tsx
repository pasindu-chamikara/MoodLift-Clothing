"use client";

import { useEffect, useState } from "react";
import { productService, orderService } from "@/services/db";
import { Package, ShoppingCart, Activity, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    products: 0,
    orders: 0,
    activeOrders: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [products, orders] = await Promise.all([
          productService.getProducts(),
          orderService.getOrders()
        ]);
        
        let totalRevenue = 0;
        let activeCount = 0;

        orders.forEach(order => {
          if (order.status !== 'cancelled') {
            totalRevenue += order.totalAmount || 0;
          }
          if (order.status === 'pending' || order.status === 'processing') {
            activeCount++;
          }
        });

        setMetrics({
          products: products.length,
          orders: orders.length,
          activeOrders: activeCount,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { name: "Total Products", value: metrics.products.toString(), icon: Package, description: "Active in store" },
    { name: "Total Orders", value: metrics.orders.toString(), icon: ShoppingCart, description: "All time orders" },
    { name: "Active Orders", value: metrics.activeOrders.toString(), icon: Activity, description: "Pending or processing" },
    { name: "Total Revenue", value: `$${metrics.revenue.toFixed(2)}`, icon: DollarSign, description: "Lifetime earnings" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your store's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{stat.name}</h3>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
