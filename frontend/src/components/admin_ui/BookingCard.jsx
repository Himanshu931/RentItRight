import React from "react";
import { Status } from "./UI";

export default function BookingCard({ booking }) {
  const { item, renter, owner, startDate, endDate, totalAmount, status, paymentStatus } = booking;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPaymentTone = (pStatus) => {
    switch (pStatus) {
      case "paid": return "success";
      case "pending": return "warning";
      case "failed": return "error";
      case "refunded": return "muted";
      default: return "muted";
    }
  };

  return (
    <div className="bg-surface border border-divider rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-bright/30 transition-all">
      {/* Item Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          className="w-16 h-16 rounded-xl object-cover border border-divider flex-shrink-0"
          src={item?.images?.[0] || "https://via.placeholder.com/150"}
          alt={item?.title || "Item Image"}
        />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-text-primary truncate">
            {item?.title || "Unknown Item"}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-text-muted">person</span>
              <span className="text-text-secondary truncate max-w-[100px]">{renter?.name || "Unknown"} (R)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-text-muted">storefront</span>
              <span className="text-text-secondary truncate max-w-[100px]">{owner?.name || "Unknown"} (O)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="text-left">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block">
            Dates
          </small>
          <span className="text-text-secondary text-xs font-medium">
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </div>
        <div className="text-left">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block">
            Amount
          </small>
          <span className="text-bright text-sm font-bold">
            ₹{totalAmount?.toLocaleString() || 0}
          </span>
        </div>
        
        <div className="flex flex-col gap-2">
           <Status value={status} />
           <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border max-w-fit uppercase tracking-wider bg-${getPaymentTone(paymentStatus)}/10 text-${getPaymentTone(paymentStatus)} border-${getPaymentTone(paymentStatus)}/20`}>
             {paymentStatus}
           </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <button
          title="View Details"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-divider text-text-secondary hover:text-bright hover:border-bright/30 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            visibility
          </span>
        </button>
      </div>
    </div>
  );
}
