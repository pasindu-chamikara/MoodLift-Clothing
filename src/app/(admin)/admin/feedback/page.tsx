"use client";

import { useEffect, useState } from "react";
import { reviewService, Review } from "@/services/db";

export default function FeedbackPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reviewService.getReviews().then((data) => {
      // Sort reviews by date descending
      const sortedData = (data as Review[]).sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      setReviews(sortedData);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-8">Customer Feedback</h2>
      
      {isLoading ? (
        <p className="text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground">No feedback has been submitted yet.</p>
      ) : (
        <div className="bg-white rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Rating</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Order ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-900">Comment</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reviews.map((review, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{review.customerName}</div>
                      <div className="text-gray-500">{review.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={idx < review.rating ? "" : "text-gray-300"}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {review.orderId}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {review.comment}
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
