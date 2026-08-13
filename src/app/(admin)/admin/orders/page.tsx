"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/db";
import { Order } from "@/types";
import { Trash2, Search, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<"all" | "daily" | "weekly" | "monthly" | "custom">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | Order['status']>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      // Sort by date descending
      data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: Order['status']) {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await orderService.deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      (order.id && order.id.toLowerCase().includes(searchLower)) ||
      (order.friendlyId && order.friendlyId.toLowerCase().includes(searchLower)) ||
      (order.shippingAddress?.name && order.shippingAddress.name.toLowerCase().includes(searchLower))
    );

    if (!matchesSearch) return false;

    if (filterStatus !== "all" && order.status !== filterStatus) return false;

    if (filterPeriod === "all" || !order.createdAt) return true;

    const orderDate = new Date(order.createdAt);
    const now = new Date();
    
    if (filterPeriod === "daily") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return orderDate >= today;
    } else if (filterPeriod === "weekly") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= oneWeekAgo;
    } else if (filterPeriod === "monthly") {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return orderDate >= oneMonthAgo;
    } else if (filterPeriod === "custom") {
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);
      return orderDate >= start && orderDate <= end;
    }

    return true;
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Orders Report - MOODLIFT", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    
    let periodText = "All Time";
    if (filterPeriod === 'daily') periodText = "Today";
    else if (filterPeriod === 'weekly') periodText = "Last 7 Days";
    else if (filterPeriod === 'monthly') periodText = "Last 30 Days";
    else if (filterPeriod === 'custom') periodText = `${startDate || 'Start'} to ${endDate || 'End'}`;
    
    doc.text(`Period: ${periodText}`, 14, 27);
    
    let statusText = "All Statuses";
    if (filterStatus !== 'all') {
      statusText = filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1);
    }
    doc.text(`Status: ${statusText}`, 14, 32);
    
    const tableData = filteredOrders.map(order => [
      order.friendlyId || `#ML-${(order.id || "").slice(0, 5).toUpperCase()}`,
      order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
      order.shippingAddress?.name || 'Guest',
      formatCurrency(order.totalAmount),
      order.status.toUpperCase()
    ]);

    autoTable(doc, {
      startY: 37,
      head: [['Order ID', 'Date', 'Customer', 'Total', 'Status']],
      body: tableData,
    });

    doc.save(`orders_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage customer orders and fulfillments.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {filterPeriod === 'custom' && (
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <span className="text-sm text-muted-foreground">to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          )}
          
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as any)}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Time</option>
            <option value="daily">Today</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
            <option value="custom">Custom Dates</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search orders..."
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
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{order.friendlyId || `#ML-${(order.id || "").slice(0, 5).toUpperCase()}`}</td>
                    <td className="p-4 align-middle">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 align-middle">
                      {order.shippingAddress?.name || 'Guest'}
                      <div className="text-xs text-muted-foreground">{order.shippingAddress?.city}, {order.shippingAddress?.country}</div>
                    </td>
                    <td className="p-4 align-middle font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="p-4 align-middle">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id!, e.target.value as Order['status'])}
                        className={`text-xs px-2 py-1 rounded-full border outline-none cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => order.id && handleDelete(order.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
