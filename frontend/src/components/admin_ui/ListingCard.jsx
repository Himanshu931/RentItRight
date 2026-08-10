import React, { useState } from "react";
import { Status } from "./UI";

export default function ListingCard({ listing, onToggle }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/listings/${listing._id}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        credentials: "include"
      });
      const result = await response.json();
      if (result.success && onToggle) {
        onToggle();
      }
    } catch (error) {
      console.error("Failed to toggle listing status:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`bg-surface border border-divider rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-bright/30 transition-all ${
        listing.status === "Removed" ? "opacity-50" : ""
      }`}
    >
      {/* Image + Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-16 h-16 rounded-xl object-cover border border-divider flex-shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-text-primary truncate">
            {listing.title}
          </h3>
          <p className="text-text-muted text-xs mt-0.5">
            by{" "}
            <strong className="text-text-secondary">{listing.owner}</strong>{" "}
            <span className="text-bright text-xs font-semibold ml-1">
              {listing.rating} ★
            </span>
          </p>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-center">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block">
            Category
          </small>
          <span className="text-text-secondary text-xs font-medium">
            {listing.category}
          </span>
        </div>
        <div className="text-center">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block">
            Price
          </small>
          <span className="text-bright text-sm font-bold">
            ${listing.price}
            <small className="text-text-muted font-normal">/day</small>
          </span>
        </div>
        <Status value={listing.status} />
        <div className="text-center">
          <small
            className={`text-[10px] uppercase tracking-wider block ${
              listing.reports > 0 ? "text-error" : "text-text-muted"
            }`}
          >
            Reports
          </small>
          <span
            className={`text-xs font-bold ${
              listing.reports > 0 ? "text-error" : "text-text-secondary"
            }`}
          >
            {listing.reports}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          title="View Listing"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-divider text-text-secondary hover:text-bright hover:border-bright/30 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            visibility
          </span>
        </button>
        <button
          title={
            listing.status === "Removed"
              ? "Restore Listing"
              : "Disable Listing"
          }
          onClick={handleToggle}
          disabled={loading}
          className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed " : ""
          }${
            listing.status === "Removed"
              ? "bg-success/10 border-success/20 text-success hover:bg-success/20"
              : "bg-warning/10 border-warning/20 text-warning hover:bg-warning/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {loading ? "sync" : (listing.status === "Removed" ? "restore" : "block")}
          </span>
        </button>
        <button
          title="Remove Listing"
          disabled={listing.status === "Removed"}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-error/10 border border-error/20 text-error hover:bg-error/20 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">
            delete
          </span>
        </button>
      </div>
    </div>
  );
}