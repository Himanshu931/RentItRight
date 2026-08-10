import React from "react";
import {
  PageHeader,
  Button,
  StatCard,
  SectionTitle,
} from "../../components/admin_ui/UI";

const health = [
  ["Active Listings", "7,840", "success"],
  ["Paused by Owner", "245", "warning"],
  ["Removed/Reported", "125", "error"],
];

const bookings = [
  ["Active Sessions", "456", "bright"],
  ["Completed (MTD)", "1,240", "success"],
  ["Cancelled", "18", "muted"],
];

function OverviewCard({ title, total, active, suspended }) {
  return (
    <div className="bg-surface border border-divider rounded-2xl overflow-hidden hover:border-bright/30 transition-all">
      <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
        <span className="text-sm font-bold text-text-primary">{title}</span>
        <a
          href="#"
          className="text-xs text-bright font-semibold hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-3 divide-x divide-divider">
        <div className="px-6 py-5 text-center">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block mb-1">
            Total
          </small>
          <strong className="text-xl font-black text-text-primary">
            {total}
          </strong>
        </div>
        <div className="px-6 py-5 text-center">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block mb-1">
            Active
          </small>
          <strong className="text-xl font-black text-text-primary">
            {active}
          </strong>
        </div>
        <div className="px-6 py-5 text-center">
          <small className="text-text-muted text-[10px] uppercase tracking-wider block mb-1">
            Suspended
          </small>
          <strong className="text-xl font-black text-error">{suspended}</strong>
        </div>
      </div>
    </div>
  );
}

function HealthCard({ title, rows }) {
  const dotColors = {
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    bright: "bg-bright",
    muted: "bg-text-muted",
    danger: "bg-error",
    blue: "bg-bright",
  };

  return (
    <div className="bg-surface border border-divider rounded-2xl p-6 hover:border-bright/30 transition-all">
      <p className="text-text-secondary text-xs tracking-wider uppercase font-medium mb-4">
        {title}
      </p>
      <div className="flex flex-col gap-3">
        {rows.map(([label, value, tone]) => (
          <div className="flex items-center justify-between" key={label}>
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  dotColors[tone] || dotColors.muted
                }`}
              />
              <span className="text-sm text-text-secondary">{label}</span>
            </div>
            <strong className="text-sm font-bold text-text-primary">
              {value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <PageHeader
          title="Admin Dashboard"
          description="Platform-wide performance and administrative control center."
          actions={
            <>
              <Button icon="download">Export Data</Button>
              <Button primary>System Settings</Button>
            </>
          }
        />

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard
            label="Total Users"
            value="12,450"
            note="+12% growth"
            noteType="success"
          />
          <StatCard
            label="Total Listings"
            value="8,210"
            note="+5.2% MTD"
            noteType="success"
          />
          <StatCard label="Active Rentals" value="456" note="Live tracking" />
          <StatCard
            label="Open Disputes"
            value="24"
            note="High priority"
            noteType="danger"
          />
          <StatCard
            label="Pending KYC"
            value="85"
            note="4h wait avg."
            noteType="warning"
          />
        </div>

        {/* User Overview */}
        <section className="mb-10">
          <SectionTitle>User Overview</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OverviewCard
              title="Owners"
              total="5,200"
              active="4,850"
              suspended="12"
            />
            <OverviewCard
              title="Renters"
              total="7,250"
              active="6,900"
              suspended="45"
            />
          </div>
        </section>

        {/* Platform Health */}
        <section className="mb-10">
          <SectionTitle>Platform Health</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthCard title="Listings Health" rows={health} />
            <HealthCard title="Bookings Status" rows={bookings} />
          </div>
        </section>

        {/* Financial Snapshot */}
        <section className="mb-10">
          <SectionTitle>Financial Snapshot</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Gross Revenue"
              value="$452,100"
              note="Total volume processed"
              icon="account_balance_wallet"
            />
            <StatCard
              label="Commission Earned"
              value="$67,815"
              note="Platform net fees"
              icon="percent"
            />
            <StatCard
              label="Payouts Pending"
              value="$34,220"
              note="Awaiting owner withdrawal"
              icon="outbound"
            />
          </div>
        </section>

        {/* Attention Required */}
        <section className="mb-10">
          <SectionTitle>Attention Required</SectionTitle>
          <div className="bg-surface border border-error/20 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-divider bg-error/5">
              <span className="material-symbols-outlined text-error text-xl">
                report
              </span>
              <strong className="text-sm font-bold text-text-primary">
                Critical Alerts
              </strong>
            </div>
            <div className="divide-y divide-divider">
              {[
                "12 listings have multiple reports",
                "85 users are waiting for KYC verification",
                "24 disputes require administrative attention",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="text-sm text-text-secondary">{text}</span>
                  <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-divider text-xs font-semibold text-text-secondary hover:text-bright hover:border-bright/30 transition-all cursor-pointer">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}