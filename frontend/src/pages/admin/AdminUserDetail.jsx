import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, StatCard } from "../../components/admin_ui/UI";

function Info({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-divider last:border-b-0">
      <small className="text-text-muted text-xs">{label}</small>
      <div className="flex items-center gap-2">
        <span className="text-text-primary text-sm font-medium">{value}</span>
        {icon && (
          <span className="material-symbols-outlined text-text-muted text-[16px] hover:text-bright cursor-pointer transition-colors">
            visibility
          </span>
        )}
      </div>
    </div>
  );
}

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const dotColors = {
    bright: "bg-bright",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    danger: "bg-error",
  };

  const fetchUserDetail = useCallback(async () => {
    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchUserDetail();
  }, [id, fetchUserDetail]);

  const handleSuspendToggle = async () => {
    if (!data) return;
    setActionLoading(true);
    const isSuspended = data.profile.isSuspended;
    const endpoint = isSuspended ? "unsuspend" : "suspend";
    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/${id}/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        fetchUserDetail();
      }
    } catch (error) {
      console.error("Failed to toggle suspend status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center h-full">
        <div className="text-text-secondary text-lg font-medium animate-pulse">Loading user profile...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex-1 flex items-center justify-center h-full">
        <div className="text-text-secondary text-lg font-medium">User not found.</div>
      </main>
    );
  }

  const { profile, stats, activity } = data;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link
            to="/adminusers"
            className="text-text-muted hover:text-bright transition-colors"
          >
            Users
          </Link>
          <span className="material-symbols-outlined text-text-muted text-[16px]">
            chevron_right
          </span>
          <span className="text-text-primary font-medium">
            {profile.name}
          </span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-black tracking-tight text-text-primary">
            User Profile Detail
          </h1>
          <div className="flex items-center gap-3">
            <Button icon="history">View Logs</Button>
            <Button icon="edit">Edit User</Button>
          </div>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-surface border border-divider rounded-2xl p-6 text-center">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-divider mx-auto mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-divider mx-auto mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-text-muted">person</span>
                </div>
              )}
              <h2 className="text-xl font-black text-text-primary">
                {profile.name}
              </h2>
              <p className="text-text-muted text-xs mt-1 mb-4">
                User ID: {profile._id}
              </p>

              {/* Chips */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-bright/10 text-bright text-xs font-bold border border-bright/20 capitalize">
                  {profile.role}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                  profile.status === "Active" 
                    ? "bg-success/10 text-success border-success/20" 
                    : profile.status === "Suspended" || profile.status === "Blocked"
                    ? "bg-error/10 text-error border-error/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    profile.status === "Active" ? "bg-success" : profile.status === "Suspended" || profile.status === "Blocked" ? "bg-error" : "bg-warning"
                  }`} />
                  {profile.status}
                </span>
                {profile.isVerified && (
                  <span className="px-2.5 py-1 rounded-lg bg-bright/10 text-bright text-xs font-bold border border-bright/20 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      verified
                    </span>
                    Verified
                  </span>
                )}
              </div>

              {/* Info Rows */}
              <div className="text-left">
                <Info
                  label="Email Address"
                  value={profile.email}
                />
                <Info
                  label="Phone Number"
                  value={profile.phone || "Not provided"}
                />
                <Info label="Join Date" value={profile.joinDate} />
                <Info label="Location" value={`${profile.address?.district || ''} ${profile.address?.state || ''}`.trim() || "Not provided"} />
              </div>
            </div>

            {/* Administrative Actions */}
            <div className="bg-surface border border-divider rounded-2xl p-6">
              <p className="text-text-secondary text-xs tracking-wider uppercase font-medium mb-4">
                Administrative Actions
              </p>
              <div className="flex flex-col gap-2">
                {!profile.isVerified && (
                  <Button icon="verified_user">Verify Identity</Button>
                )}
                <Button icon="flag" warning>
                  Flag Account
                </Button>
                <div onClick={handleSuspendToggle} className="w-full mt-3">
                  <Button icon="block" danger={!profile.isSuspended} warning={profile.isSuspended} className="w-full flex justify-center items-center gap-2">
                    {actionLoading ? "Processing..." : (profile.isSuspended ? "Restore Account" : "Suspend Account")}
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label={profile.role === "owner" ? "Total Listings" : "Total Rentals"}
                value={profile.role === "owner" ? (stats.totalListings || 0).toLocaleString() : stats.totalBookings.toLocaleString()}
              />
              <StatCard
                label={profile.role === "owner" ? "Total Earnings" : "Total Spent"}
                value={`₹${stats.totalEarnings.toLocaleString()}`}
                icon="payments"
              />
              <StatCard
                label="Avg. Rating"
                value={`${stats.avgRating.toFixed(1)} ★`}
                note={`${stats.reviewCount} reviews`}
              />
              <StatCard
                label="Disputes"
                value={stats.disputes.toLocaleString()}
                note={stats.disputes > 0 ? "ATTENTION" : "All clear"}
                noteType={stats.disputes > 0 ? "danger" : "success"}
              />
            </div>

            {/* Activity Timeline */}
            <div className="bg-surface border border-divider rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
                <span className="text-sm font-bold text-text-primary">
                  Recent Activity Timeline
                </span>
                <button className="text-xs text-bright font-semibold hover:underline cursor-pointer">
                  Download Report
                </button>
              </div>

              <div className="p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-divider" />

                  <div className="flex flex-col gap-6">
                    {activity.length === 0 ? (
                      <div className="text-text-muted text-sm py-4">No recent activity.</div>
                    ) : (
                      activity.map(({ title, time, text, tone }, index) => (
                        <div className="flex gap-4 relative" key={index}>
                          {/* Dot */}
                          <span
                            className={`w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1.5 relative z-10 ring-4 ring-surface ${
                              dotColors[tone] || "bg-text-muted"
                            }`}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="text-sm font-bold text-text-primary">
                                {title}
                              </h3>
                              <small className="text-text-muted text-xs flex-shrink-0">
                                {time}
                              </small>
                            </div>
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-divider px-6 py-4 text-center">
                <button className="text-sm text-bright font-semibold hover:underline cursor-pointer">
                  Show All Activity...
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}