"use client";

import { useEffect, useState } from "react";
import { messageService, ContactMessage } from "@/services/db";
import { Trash2, Search, Mail, MailOpen, Reply, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setIsLoading(true);
    try {
      const data = await messageService.getMessages();
      // Sort by date descending
      data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: ContactMessage['status']) {
    try {
      await messageService.updateMessageStatus(id, newStatus);
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      toast.success("Status updated");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await messageService.deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'unread': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'read': return <MailOpen className="h-4 w-4 text-gray-500" />;
      case 'replied': return <Reply className="h-4 w-4 text-green-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800 border-blue-200 font-semibold';
      case 'read': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(msg => {
    const searchLower = searchQuery.toLowerCase();
    return (
      msg.email.toLowerCase().includes(searchLower) ||
      msg.subject.toLowerCase().includes(searchLower) ||
      msg.firstName.toLowerCase().includes(searchLower) ||
      msg.lastName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">Manage customer inquiries and contact forms.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search messages..."
              className="h-9 w-full sm:w-64 rounded-md border border-input bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1 rounded-md border bg-card overflow-hidden h-[calc(100vh-220px)] flex flex-col">
          <div className="bg-muted/50 p-3 border-b font-medium text-sm flex justify-between items-center">
            <span>Inbox ({messages.filter(m => m.status === 'unread').length} unread)</span>
          </div>
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No messages found.</div>
            ) : (
              <div className="divide-y">
                {filteredMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status === 'unread') handleStatusChange(msg.id!, 'read');
                    }}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-muted' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm truncate pr-2 ${msg.status === 'unread' ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                        {msg.firstName} {msg.lastName}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(msg.status)}
                      <p className={`text-xs truncate ${msg.status === 'unread' ? 'font-semibold text-foreground/90' : 'text-muted-foreground'}`}>
                        {msg.subject}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="md:col-span-2 rounded-md border bg-card h-[calc(100vh-220px)] flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">{selectedMessage.firstName} {selectedMessage.lastName}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'Unknown date'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(selectedMessage.id!, e.target.value as ContactMessage['status'])}
                    className={`text-xs px-2 py-1.5 rounded-md border outline-none cursor-pointer ${getStatusColor(selectedMessage.status)}`}
                  >
                    <option value="unread">Mark Unread</option>
                    <option value="read">Mark Read</option>
                    <option value="replied">Mark Replied</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(selectedMessage.id!)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 bg-muted/30 p-6 rounded-lg border">
                  {selectedMessage.message}
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-sm font-semibold mb-4">Reply to Customer</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    To reply to this customer, click the button below to open your default email client with their email address pre-filled.
                  </p>
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    onClick={() => handleStatusChange(selectedMessage.id!, 'replied')}
                  >
                    <Button className="flex items-center gap-2">
                      <Reply className="h-4 w-4" />
                      Reply via Email
                    </Button>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <Mail className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Message Selected</h3>
              <p className="text-sm">Select a message from the list to view its contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
