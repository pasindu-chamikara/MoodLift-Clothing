"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { orderService } from "@/services/db";
import { useAuth } from "@/store/useAuth";

// Types
type OrderStatus = "Pending" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";

interface OrderProduct {
  id: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  products: OrderProduct[];
  estimatedDelivery?: string;
  paymentMethod: string;
  shippingAddress: string;
  subtotal: number;
  discount: number;
  couponUsed?: string;
}

// Status Colors
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "Pending": return "text-[#F59E0B] bg-[#F59E0B]/10";
    case "Processing": return "text-[#3B82F6] bg-[#3B82F6]/10";
    case "Packed": return "text-[#8B5CF6] bg-[#8B5CF6]/10";
    case "Shipped": return "text-[#6366F1] bg-[#6366F1]/10";
    case "Delivered": return "text-[#22C55E] bg-[#22C55E]/10";
    case "Cancelled": return "text-[#EF4444] bg-[#EF4444]/10";
    default: return "text-gray-500 bg-gray-100";
  }
};

const getStatusDotColor = (status: OrderStatus) => {
  switch (status) {
    case "Pending": return "bg-[#F59E0B]";
    case "Processing": return "bg-[#3B82F6]";
    case "Packed": return "bg-[#8B5CF6]";
    case "Shipped": return "bg-[#6366F1]";
    case "Delivered": return "bg-[#22C55E]";
    case "Cancelled": return "bg-[#EF4444]";
    default: return "bg-gray-500";
  }
};

const formatCurrency = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`;
};

export default function OrderPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");
  const [search, setSearch] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.email) return;

    orderService.getOrders().then(allOrders => {
      const userOrders = allOrders.filter((o: any) => o.customerEmail === user.email);

      const mappedOrders: Order[] = userOrders.map((o: any) => {
        const rawStatus = o.status || "pending";
        const statusStr = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

        const mappedProducts = (o.items || []).map((item: any) => ({
          id: item.id,
          name: item.title || "Product",
          size: item.size || "M",
          color: item.color || "Default",
          qty: item.quantity || 1,
          price: item.price || 0,
          image: item.imageUrl || item.image || "/images/logo.jpg",
        }));

        const subtotal = mappedProducts.reduce((acc: number, p: any) => acc + (p.price * p.qty), 0);
        const total = o.totalAmount || subtotal;

        return {
          id: o.id || Math.random().toString(),
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recently",
          status: (["Pending", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"].includes(statusStr) ? statusStr : "Pending") as OrderStatus,
          total: total,
          products: mappedProducts,
          paymentMethod: "Cash on Delivery",
          shippingAddress: o.shippingAddress ? `${o.shippingAddress.street || ''}, ${o.shippingAddress.city || ''}, ${o.shippingAddress.postalCode || ''}` : "No address provided",
          subtotal: subtotal,
          discount: 0
        };
      });

      mappedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(mappedOrders);
    });
  }, [user]);

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedOrders);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedOrders(newSet);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "Active" && ["Delivered", "Cancelled"].includes(order.status)) return false;
    if (filter === "Completed" && !["Delivered", "Cancelled"].includes(order.status)) return false;
    
    if (search && !order.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-transparent text-[#1E1E1E] py-8 md:py-16 px-4 font-sans">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-serif mb-3 text-[#1E1E1E]">My Orders</h1>
          <p className="text-[#8B6B61] text-sm md:text-base">Track your purchases and manage your orders.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B6B61] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E1D9] rounded-none focus:outline-none focus:border-[#A67C52] text-sm"
            />
          </div>
          
          <div className="flex bg-[#E8E1D9]/50 p-1 rounded-none w-full md:w-auto">
            {["All", "Active", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-none text-sm font-medium transition-colors ${
                  filter === tab 
                    ? "bg-white text-[#1E1E1E] shadow-sm" 
                    : "text-[#8B6B61] hover:text-[#1E1E1E]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-[#E8E1D9] rounded-none p-12 text-center">
              <h3 className="text-xl font-serif text-[#1E1E1E] mb-2">No orders found</h3>
              <p className="text-[#8B6B61] mb-6">You haven't placed any orders yet, or no orders match your search.</p>
              <Button className="bg-[#A67C52] hover:bg-[#8C6848] text-white">Start Shopping</Button>
            </div>
          ) : (
            filteredOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                isExpanded={expandedOrders.has(order.id)}
                onToggle={() => toggleExpand(order.id)}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}

import { useCart } from "@/store/useCart";
import { useRouter } from "next/navigation";

function OrderCard({ order, isExpanded, onToggle }: { order: Order; isExpanded: boolean; onToggle: () => void }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleBuyAgain = () => {
    order.products.forEach(p => {
      addItem({
        productId: p.id,
        title: p.name,
        price: p.price,
        imageUrl: p.image,
        size: p.size,
        color: p.color,
        quantity: p.qty
      });
    });
    router.push('/cart');
  };

  const handleComingSoon = (feature: string) => {
    alert(`${feature} feature is coming soon!`);
  };
  
  const renderActions = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return (
          <>
            <Button variant="outline" className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 h-9 px-4 text-xs">
              Cancel Order
            </Button>
            <Button onClick={onToggle} variant="outline" className="border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52]/10 h-9 px-4 text-xs">
              View Details
            </Button>
          </>
        );
      case "Processing":
      case "Packed":
        return (
          <Button onClick={onToggle} variant="outline" className="border-[#A67C52] text-[#A67C52] hover:bg-[#A67C52]/10 h-9 px-4 text-xs">
            View Details
          </Button>
        );
      case "Shipped":
        return (
          <Button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white h-9 px-4 text-xs">
            Track Order
          </Button>
        );
      case "Delivered":
        return (
          <>
            <Button onClick={handleBuyAgain} variant="outline" className="border-[#E8E1D9] text-[#1E1E1E] hover:bg-[#F8F6F3] h-9 px-4 text-xs">
              Buy Again
            </Button>
            <Button onClick={() => window.open(`/order/${order.id}/invoice`, '_blank')} variant="outline" className="border-[#E8E1D9] text-[#1E1E1E] hover:bg-[#F8F6F3] h-9 px-4 text-xs hidden sm:flex">
              Invoice
            </Button>
            <Button onClick={() => setIsReviewModalOpen(true)} className="bg-[#A67C52] hover:bg-[#8C6848] text-white h-9 px-4 text-xs">
              Leave Review
            </Button>
          </>
        );
      case "Cancelled":
        return (
          <Button onClick={handleBuyAgain} variant="outline" className="border-[#E8E1D9] text-[#1E1E1E] hover:bg-[#F8F6F3] h-9 px-4 text-xs">
            Buy Again
          </Button>
        );
    }
  };

  return (
    <>
    <div className="bg-white border border-[#E8E1D9] rounded-none overflow-hidden shadow-sm transition-all">
      {/* Desktop Layout Header */}
      <div className="hidden md:flex items-center justify-between p-6 border-b border-[#E8E1D9] bg-[#FFFFFF]">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs text-[#8B6B61] mb-1">Order ID</p>
            <p className="font-semibold text-[#1E1E1E]">{order.id}</p>
          </div>
          <div>
            <p className="text-xs text-[#8B6B61] mb-1">Date</p>
            <p className="font-semibold text-[#1E1E1E]">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-[#8B6B61] mb-1">Total</p>
            <p className="font-semibold text-[#1E1E1E]">{formatCurrency(order.total)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-none text-xs font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(order.status)}`} />
            {order.status}
          </div>
          <div className="flex gap-2">
             {renderActions(order.status)}
          </div>
        </div>
      </div>

      {/* Mobile Layout Header */}
      <div className="md:hidden p-5 border-b border-[#E8E1D9]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-semibold text-[#1E1E1E]">{order.id}</p>
            <p className="text-xs text-[#8B6B61] mt-1">{order.date}</p>
          </div>
          <div className={`px-2.5 py-1 rounded-none text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(order.status)}`} />
            {order.status}
          </div>
        </div>
        
        <div className="mb-4">
           <p className="text-sm text-[#8B6B61]">Total: <span className="font-semibold text-[#1E1E1E]">{formatCurrency(order.total)}</span></p>
        </div>
        
        <div className="flex flex-wrap gap-2">
           {renderActions(order.status)}
        </div>
      </div>

      {/* Product Summary Grid */}
      <div className="p-5 md:p-6 bg-white">
         <div className="flex flex-col md:flex-row gap-6">
           <div className="flex-1">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.products.slice(0, 3).map(product => (
                  <div key={product.id} className="flex gap-3 p-3 border border-[#E8E1D9] rounded-none">
                    <div className="relative w-16 h-20 bg-[#F8F6F3] rounded-none overflow-hidden shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-medium text-sm text-[#1E1E1E] line-clamp-1">{product.name}</p>
                      <p className="text-xs text-[#8B6B61] mt-0.5">Size: {product.size} | {product.color}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-medium">Qty: {product.qty}</p>
                        <p className="text-xs font-semibold">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             {order.products.length > 3 && (
               <p className="text-xs text-[#8B6B61] mt-4">+ {order.products.length - 3} more items</p>
             )}
           </div>
           
           <div className="md:w-32 flex flex-col items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-[#E8E1D9] pt-4 md:pt-0 md:pl-6">
              <Button 
                variant="ghost" 
                onClick={onToggle}
                className="w-full flex justify-between md:justify-center items-center text-[#A67C52] hover:bg-[#F8F6F3] hover:text-[#8C6848]"
              >
                {isExpanded ? (
                  <>Hide <ChevronUp className="w-4 h-4 ml-1 md:ml-2" /></>
                ) : (
                  <>Details <ChevronDown className="w-4 h-4 ml-1 md:ml-2" /></>
                )}
              </Button>
           </div>
         </div>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="border-t border-[#E8E1D9] bg-[#F8F6F3]/30 p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Timeline */}
            <div className="lg:col-span-2">
              <h4 className="font-serif text-lg mb-6">Order Timeline</h4>
              
              {order.status === "Cancelled" ? (
                <div className="flex items-start gap-4 text-[#EF4444]">
                   <div className="w-4 h-4 rounded-full bg-[#EF4444] mt-1 shrink-0" />
                   <div>
                     <p className="font-medium">Order Cancelled</p>
                     <p className="text-sm text-[#EF4444]/70">This order was cancelled and will not be fulfilled.</p>
                   </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-4 left-4 w-[2px] h-[calc(100%-2rem)] bg-[#E8E1D9] z-0 hidden sm:block" />
                  
                  <div className="space-y-6 relative z-10">
                    <TimelineItem 
                      active={true} 
                      completed={true} 
                      title="Order Placed" 
                      date={order.date} 
                    />
                    <TimelineItem 
                      active={order.status !== "Pending"} 
                      completed={["Packed", "Shipped", "Delivered"].includes(order.status)} 
                      title="Processing" 
                      date="We are preparing your items." 
                    />
                    <TimelineItem 
                      active={["Shipped", "Delivered"].includes(order.status)} 
                      completed={order.status === "Delivered"} 
                      title="Shipped" 
                      date={order.status === "Shipped" || order.status === "Delivered" ? "Package is on the way." : "Pending"} 
                    />
                    <TimelineItem 
                      active={order.status === "Delivered"} 
                      completed={order.status === "Delivered"} 
                      title="Delivered" 
                      date={order.status === "Delivered" ? "Package delivered successfully." : "Pending"} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Info Summary */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-none border border-[#E8E1D9]">
                <h4 className="font-medium text-sm text-[#8B6B61] uppercase tracking-wider mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8B6B61]">Subtotal</span>
                    <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-[#22C55E]">
                      <span>Discount {order.couponUsed ? `(${order.couponUsed})` : ""}</span>
                      <span className="font-medium">- {formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#8B6B61]">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#E8E1D9] flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-none border border-[#E8E1D9]">
                 <h4 className="font-medium text-sm text-[#8B6B61] uppercase tracking-wider mb-3">Shipping Info</h4>
                 {order.estimatedDelivery && order.status !== "Delivered" && order.status !== "Cancelled" && (
                   <div className="mb-3 pb-3 border-b border-[#E8E1D9]">
                     <p className="text-xs text-[#8B6B61] mb-1">Estimated Delivery</p>
                     <p className="font-medium text-sm">{order.estimatedDelivery}</p>
                   </div>
                 )}
                 <div className="mb-3 pb-3 border-b border-[#E8E1D9]">
                    <p className="text-xs text-[#8B6B61] mb-1">Payment Method</p>
                    <p className="font-medium text-sm">{order.paymentMethod}</p>
                 </div>
                 <div>
                    <p className="text-xs text-[#8B6B61] mb-1">Address</p>
                    <p className="font-medium text-sm leading-relaxed">{order.shippingAddress}</p>
                 </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
    {isReviewModalOpen && (
      <ReviewModal 
        orderId={order.id} 
        onClose={() => setIsReviewModalOpen(false)} 
      />
    )}
    </>
  );
}

import { reviewService } from "@/services/db";

function ReviewModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment) {
      setIsSubmitting(true);
      try {
        await reviewService.addReview({
          orderId,
          customerEmail: user?.email || "guest@example.com",
          customerName: user?.name || "Guest",
          rating,
          comment
        });
        alert("Thank you for your review!");
        onClose();
      } catch (error) {
        console.error("Failed to submit review", error);
        alert("Failed to submit review.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          &times;
        </button>
        <h2 className="text-2xl font-serif mb-6 text-center">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F] block mb-2">Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setRating(star)}
                  className={`text-3xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
             <label className="text-xs font-semibold uppercase tracking-widest text-[#1F1F1F] block mb-2">Comment</label>
             <textarea 
               required
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               className="w-full border border-[#111111]/20 p-3 text-sm focus:outline-none focus:border-[#111111]"
               rows={4}
               placeholder="Tell us what you thought about your order..."
             />
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full bg-[#111111] text-white hover:bg-black rounded-none uppercase tracking-widest text-xs py-6">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function TimelineItem({ active, completed, title, date }: { active: boolean; completed: boolean; title: string; date: string }) {
  
  let bgColor = "bg-white border-2 border-[#E8E1D9]";
  if (completed) {
    bgColor = "bg-[#A67C52] border-2 border-[#A67C52]";
  } else if (active) {
    bgColor = "bg-white border-2 border-[#A67C52]";
  }

  return (
    <div className={`flex items-start gap-4 ${active ? "opacity-100" : "opacity-40"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${bgColor} sm:translate-x-0`}>
        <div className={`w-2.5 h-2.5 rounded-full ${completed ? 'bg-white' : (active ? 'bg-[#A67C52]' : 'bg-transparent')}`} />
      </div>
      <div className="pt-1">
        <h5 className={`font-semibold text-sm ${completed || active ? "text-[#1E1E1E]" : "text-[#8B6B61]"}`}>{title}</h5>
        <p className="text-xs text-[#8B6B61] mt-1">{date}</p>
      </div>
    </div>
  );
}
