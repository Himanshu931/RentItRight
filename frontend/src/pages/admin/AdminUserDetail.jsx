import React from "react";
import { Link } from "react-router-dom";
import { Button, StatCard } from "../../components/admin_ui/UI";

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBM2gGou9x5jcS9RUf8eQEnhc1midWteOEv3hvkr0D9yGzvwZHgni205cy8nyOkQuVuA5-oEAy81Eze19jjz5ddCDEHqGCWhaqPM5APoXhfXbSyEacQ_egtMXRm3sr1ZYN2d-Ju1jrsboLkM2GuA56vEzIRMKbCJBUtOPTJTmR48-VAhgZR3Y5t41blBwNCrP_fDpWTk-A0RUAMedMI_O5gLd9JcyL7-34Jym1sYTqkRjM7d2MUlJfuDrLBUKhZnDoEAb_CjePBh9I";

const activity = [
  [
    "Booking Completed",
    "2 hours ago",
    "Completed rental of Professional DSLR Kit to Sarah Jenkins. Earnings: $145.00",
    "bright",
  ],
  [
    "New Listing Published",
    "Yesterday, 4:15 PM",
    "Added Vintage Leather Sofa to the Home & Furniture category.",
    "success",
  ],
  [
    "Listing Flagged",
    "Oct 28, 2023",
    "System automatically flagged Electric Power Drill for \u201cDuplicate Images\u201d policy violation.",
    "warning",
  ],
  [
    "Dispute Opened",
    "Oct 15, 2023",
    "User Leo D\u2019Angelo filed a claim regarding Industrial Vacuum Cleaner. Status: In Review.",
    "error",
  ],
];

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
  const dotColors = {
    bright: "bg-bright",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    danger: "bg-error",
  };

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
            Marcus Richardson
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
              <img
                src={avatar}
                alt="Marcus Richardson"
                className="w-24 h-24 rounded-full object-cover border-4 border-divider mx-auto mb-4"
              />
              <h2 className="text-xl font-black text-text-primary">
                Marcus Richardson
              </h2>
              <p className="text-text-muted text-xs mt-1 mb-4">
                User ID: #USR-88219
              </p>

              {/* Chips */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-2.5 py-1 rounded-lg bg-bright/10 text-bright text-xs font-bold border border-bright/20">
                  Owner
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-success/10 text-success text-xs font-bold border border-success/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Active
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-bright/10 text-bright text-xs font-bold border border-bright/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    verified
                  </span>
                  Verified
                </span>
              </div>

              {/* Info Rows */}
              <div className="text-left">
                <Info
                  label="Email Address"
                  value="marcus.r***@example.com"
                  icon="visibility"
                />
                <Info
                  label="Phone Number"
                  value="+1 (555) •••-4291"
                  icon="visibility"
                />
                <Info label="Join Date" value="October 12, 2023" />
                <Info label="Location" value="Seattle, WA, USA" />
              </div>
            </div>

            {/* Administrative Actions */}
            <div className="bg-surface border border-divider rounded-2xl p-6">
              <p className="text-text-secondary text-xs tracking-wider uppercase font-medium mb-4">
                Administrative Actions
              </p>
              <div className="flex flex-col gap-2">
                <Button icon="verified_user">Verify Identity</Button>
                <Button icon="flag" warning>
                  Flag Account
                </Button>
                <Button icon="block" danger>
                  Suspend Account
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-8 flex flex-col gap-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Rentals"
                value="142"
                note="+12%"
                noteType="success"
              />
              <StatCard
                label="Total Earnings"
                value="$8.4k"
                icon="payments"
              />
              <StatCard
                label="Avg. Rating"
                value="4.9 ★"
                note="88 reviews"
              />
              <StatCard
                label="Disputes"
                value="2"
                note="ATTENTION"
                noteType="danger"
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
                    {activity.map(([title, time, text, tone]) => (
                      <div className="flex gap-4 relative" key={title}>
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
                          {title === "Listing Flagged" && (
                            <div className="flex items-center gap-2 mt-3">
                              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-divider text-xs font-semibold text-text-secondary hover:text-bright hover:border-bright/30 transition-all cursor-pointer">
                                View Listing
                              </button>
                              <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-divider text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all cursor-pointer">
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-divider px-6 py-4 text-center">
                <button className="text-sm text-bright font-semibold hover:underline cursor-pointer">
                  Show All Activity (324)
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}