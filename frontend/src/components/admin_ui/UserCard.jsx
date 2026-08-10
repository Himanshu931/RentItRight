import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Status } from "./UI";

export default function UserCard({ user, onToggle }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const endpoint = user.suspended ? "unsuspend" : "suspend";
    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${user._id}/${endpoint}`, {
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
      console.error(`Failed to ${endpoint} user:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-surface border border-divider rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-bright/30 transition-all ${
        user.suspended ? "opacity-60" : ""
      }`}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          className={`w-12 h-12 rounded-full object-cover border-2 border-divider flex-shrink-0 ${
            user.suspended ? "grayscale" : ""
          }`}
          src={user.avatar}
          alt={user.name}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-text-primary truncate">
              {user.name}
            </h3>
            <span className="text-bright text-xs font-semibold">
              {user.rating} ★
            </span>
          </div>
          <p className="text-text-muted text-xs truncate">{user.email}</p>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="px-2.5 py-1 rounded-lg bg-bright/10 text-bright text-xs font-bold border border-bright/20">
          {user.role}
        </span>
        <Status value={user.status} />
        <div className="text-center">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block">
            Joined
          </small>
          <span className="text-text-secondary text-xs font-medium">
            {user.joined}
          </span>
        </div>
        <div className="text-center">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block">
            {user.role === "Owner" ? "Total Items" : "Rentals"}
          </small>
          <span className="text-text-secondary text-xs font-medium">
            {user.count}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          title="View Profile"
          onClick={() => navigate(`/adminuserdetail/${user._id}`)}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-divider text-text-secondary hover:text-bright hover:border-bright/30 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            visibility
          </span>
        </button>
        <button
          title="Edit User"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-divider text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            edit_square
          </span>
        </button>
        <button
          title={user.suspended ? "Reactivate" : "Suspend"}
          onClick={handleToggle}
          disabled={loading}
          className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed " : ""
          }${
            user.suspended
              ? "bg-success/10 border-success/20 text-success hover:bg-success/20"
              : "bg-error/10 border-error/20 text-error hover:bg-error/20"
          }`}
        >
          <span className="material-symbols-outlined text-[18px] ">
            {loading ? "sync" : (user.suspended ? "restore" : "block")}
          </span>
        </button>
      </div>
    </div>
  );
}