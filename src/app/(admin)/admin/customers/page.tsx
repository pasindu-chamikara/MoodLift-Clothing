"use client";

import { useEffect, useState } from "react";
import { dbService, orderService } from "@/services/db";
import { Order } from "@/types";

interface Customer {
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersData = await dbService.getCollection('users');
        const ordersData = await orderService.getOrders();
        
        const customerMap = new Map<string, Customer>();
        
        // First map all registered users
        usersData.forEach((u: any) => {
          customerMap.set(u.email, {
            email: u.email,
            name: u.name,
            totalOrders: 0,
            totalSpent: 0
          });
        });
        
        // Aggregate order data for all users (including guests)
        ordersData.forEach(order => {
          const email = order.customerEmail || "guest@example.com";
          if (!customerMap.has(email)) {
            customerMap.set(email, {
              email: email,
              name: order.customerName || "Guest",
              totalOrders: 0,
              totalSpent: 0
            });
          }
          const cust = customerMap.get(email)!;
          cust.totalOrders += 1;
          cust.totalSpent += order.totalAmount;
        });
        
        // Convert to array and sort by total spent descending
        const customerArray = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(customerArray);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString()}`;

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Customers</h2>
      
      {isLoading ? (
        <p className="text-muted-foreground">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="text-muted-foreground">No customers found.</p>
      ) : (
        <div className="bg-white rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center">Total Orders</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((customer, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
