"use client";

import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/db';
import { Order } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export function OrderNotifications() {
  const [unreadOrders, setUnreadOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = orderService.subscribeToOrders((allOrders) => {
      const unread = allOrders
        .filter(order => !order.adminRead)
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      setUnreadOrders(unread);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOrderClick = async (orderId: string) => {
    try {
      await orderService.markOrderAsRead(orderId);
      setIsOpen(false);
      router.push('/admin/orders');
    } catch (error) {
      console.error("Failed to mark order as read:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadOrders.length > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background text-[10px] text-white flex items-center justify-center font-bold pb-[1px]">
            {unreadOrders.length > 9 ? '9+' : unreadOrders.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 md:left-0 md:right-auto mt-2 w-80 rounded-md border border-border bg-card shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <h3 className="text-sm font-semibold">New Orders ({unreadOrders.length})</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {unreadOrders.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No new orders
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {unreadOrders.map(order => (
                  <li key={order.id}>
                    <button 
                      onClick={() => handleOrderClick(order.id!)}
                      className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex flex-col gap-1"
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-sm font-medium">{order.friendlyId || 'New Order'}</span>
                        <span className="text-xs text-muted-foreground">
                          {order.createdAt ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }) : 'Just now'}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        Customer: {order.shippingAddress?.name || 'Guest'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {unreadOrders.length > 0 && (
            <div className="p-2 border-t border-border bg-muted/30 text-center">
              <button 
                onClick={() => { setIsOpen(false); router.push('/admin/orders'); }}
                className="text-xs text-primary hover:underline font-medium"
              >
                View all orders
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
