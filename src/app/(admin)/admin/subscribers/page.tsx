"use client";

import { useEffect, useState } from "react";
import { subscriberService, Subscriber } from "@/services/db";
import { Trash2, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    setIsLoading(true);
    try {
      const data = await subscriberService.getSubscribers();
      data.sort((a, b) => {
        const dateA = a.subscribedAt ? new Date(a.subscribedAt).getTime() : 0;
        const dateB = b.subscribedAt ? new Date(b.subscribedAt).getTime() : 0;
        return dateB - dateA;
      });
      setSubscribers(data);
    } catch (error) {
      console.error("Failed to load subscribers:", error);
      toast.error("Failed to load subscribers");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      await subscriberService.deleteSubscriber(id);
      setSubscribers(subscribers.filter(s => s.id !== id));
      toast.success("Subscriber removed");
    } catch (error) {
      console.error("Failed to remove subscriber:", error);
      toast.error("Failed to remove subscriber");
    }
  }

  const filteredSubscribers = subscribers.filter(sub => {
    return sub.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h2>
          <p className="text-muted-foreground">Manage your mailing list subscribers.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search emails..."
              className="h-9 w-full sm:w-64 rounded-md border border-input bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Email Address</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Subscribed Date</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                    Loading subscribers...
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Mail className="h-10 w-10 text-muted-foreground/30 mb-3" />
                      <p>No subscribers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {sub.email}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'Unknown date'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(sub.id!)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                        title="Remove Subscriber"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
