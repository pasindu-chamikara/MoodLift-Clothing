"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users,
  MessageSquare,
  MessageCircle,
  Mail,
  LogOut,
  Menu,
  X,
  Settings,
  Archive,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/store/useAdminAuth';
import { OrderNotifications } from '@/components/admin/OrderNotifications';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { logout, role, username } = useAdminAuth();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: Archive },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageCircle },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Mail },
    ...(role === 'super_admin' ? [
      { name: 'Staff', href: '/admin/staff', icon: UserCog }
    ] : []),
    ...(['super_admin', 'admin'].includes(role as string) ? [
      { name: 'Settings', href: '/admin/settings', icon: Settings }
    ] : []),
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-card border-b border-border p-4">
        <span className="text-lg font-bold tracking-tight">MoodLift Admin</span>
        <div className="flex items-center gap-2">
          <OrderNotifications />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-card border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Sidebar Header */}
        <div className="flex md:hidden items-center justify-between h-20 border-b border-border px-6 shrink-0">
          <span className="text-lg font-bold tracking-tight">Admin</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
             <X className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Desktop Sidebar Header */}
        <div className="hidden md:flex flex-row items-center justify-between h-20 border-b border-border px-6 shrink-0">
          <div className="flex flex-col justify-center">
            <span className="text-lg font-bold tracking-tight">MoodLift</span>
            <span className="text-sm text-muted-foreground">Admin Workspace</span>
          </div>
          <OrderNotifications />
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="border-t border-border p-4 shrink-0">
          {username && (
            <div className="mb-4 px-3 flex flex-col">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logged in as</span>
              <span className="text-sm font-semibold truncate" title={username}>{username}</span>
              <span className="text-xs capitalize text-muted-foreground">{role?.replace('_', ' ')}</span>
            </div>
          )}
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
