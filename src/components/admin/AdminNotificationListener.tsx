"use client";

import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { orderService } from '@/services/db';

export function AdminNotificationListener() {
  const isInitialLoad = useRef(true);
  const knownOrderIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = orderService.subscribeToOrders((allOrders) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        allOrders.forEach(order => {
          if (order.id) knownOrderIds.current.add(order.id);
        });
        return;
      }

      allOrders.forEach(order => {
        if (order.id && !knownOrderIds.current.has(order.id)) {
          // This is a new order that wasn't in the initial load
          knownOrderIds.current.add(order.id);
          
          if (!order.adminRead) {
            toast.success(`New order received: ${order.friendlyId || order.id}`, {
              duration: 6000,
              style: {
                borderRadius: '8px',
                background: '#1f2937',
                color: '#fff',
              }
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
}
