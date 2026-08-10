import React, { useMemo, useState } from "react";
import {
  PageHeader,
  Button,
  Tabs,
  Pagination,
} from "../../components/admin_ui/UI";
import UserCard from "../../components/admin_ui/UserCard";

const users = [
  {
    name: "Marcus Richardson",
    email: "marcus.r@example.com",
    role: "Owner",
    status: "Active",
    joined: "Oct 12, 2023",
    count: "24 Listings",
    rating: "4.9",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBM2gGou9x5jcS9RUf8eQEnhc1midWteOEv3hvkr0D9yGzvwZHgni205cy8nyOkQuVuA5-oEAy81Eze19jjz5ddCDEHqGCWhaqPM5APoXhfXbSyEacQ_egtMXRm3sr1ZYN2d-Ju1jrsboLkM2GuA56vEzIRMKbCJBUtOPTJTmR48-VAhgZR3Y5t41blBwNCrP_fDpWTk-A0RUAMedMI_O5gLd9JcyL7-34Jym1sYTqkRjM7d2MUlJfuDrLBUKhZnDoEAb_CjePBh9I",
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.j88@webmail.com",
    role: "Renter",
    status: "Active",
    joined: "Jan 05, 2024",
    count: "12 Orders",
    rating: "4.8",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFhbkmVfhcr3L6sNpfyMrRA9fQam52ZDDHa46Fbtw9nslOm8rJdGJQAZthw2f15WaLKgR1d9YNEJSTi1tyekpes8raS0a6Xviel0spACrZD4jMCueDrB-PJ5Y1Pna_Z68fq1ghRmrw2k5hklj4HlA9af9y3-J_oGAEKrLN5HOtEBtka5706IHRq5e-91NOCNTPy5iGqaBHivpcxqwStS6a8a68IzUuQNg8f3ZCUf1MpvovhjUZJWWL0-AMn5v2prSjN9fbHLKWL-4",
  },
  {
    name: "Leo D'Angelo",
    email: "leo.pro@design.io",
    role: "Owner",
    status: "Pending",
    joined: "Mar 15, 2024",
    count: "0 Listings",
    rating: "4.7",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBM5E9Cm9Lkgv6ZM75X35Uuw-Xmdd0yqkvOoNchkllqhMvYbXn0u_ggqhoHzShcQA7c1eOMkaEsqeatwdHZUV9Jzvm5yO9B2V2goq_GvyTOjc_jqjB_tkX0JnaZPgc9sXzYx4in-TG9sEXsn5RtHhaYmWnMWlaPZhM507VBDm0oLFkDfc9I1CRWkV8euoplby4wfZjqT3VMgcaq8YirYsY0ryfoYRVlr-Ts0dNn94ECVDtExMd_seMe6cjmn-FxYaeinoTdqcuLhe0",
  },
  {
    name: "Elena Rodriguez",
    email: "elena.rod@private.com",
    role: "Renter",
    status: "Suspended",
    joined: "Nov 11, 2022",
    count: "32 Orders",
    rating: "4.5",
    suspended: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUh8BnmQ5zQTSyb6qoGqytWq57BYVixq5lFDms1wi7AtDxZdj5RZrEHClPGb6wyHNzKpIe5K3OU4uY7nViQVZTggDb4MsA4pMTSVX45bLVHllCYVWiv25qotI4ziuv1bmeuWk_46e9Qzt9jI0Pw1qrjuslA0qc5Gu37uNkKeLm0H5uvVjVVnOY2CDwVzvmL7O59j3uCurL3BjDwYbyglaFVTmNByymql4d-bPraQpNMj8_cdj1vXmkqPL6iNzcVErxJZ1YMRggBoE",
  },
];

export default function Users() {
  const [tab, setTab] = useState("All Users");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchesTab =
          tab === "All Users" || u.role === tab.slice(0, -1);
        const q = query.toLowerCase();
        return (
          matchesTab &&
          (!q || `${u.name} ${u.email}`.toLowerCase().includes(q))
        );
      }),
    [tab, query]
  );

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <PageHeader
          title="Users Management"
          description="Manage owners and renters across the platform"
          actions={
            <>
              <Button icon="download">Export Users</Button>
              <Button icon="person_add">Add Admin</Button>
            </>
          }
        />

        <Tabs
          items={["All Users", "Owners", "Renters"]}
          active={tab}
          onChange={setTab}
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-surface border border-divider rounded-xl px-4 py-2.5 flex-1 min-w-[250px] max-w-md focus-within:border-bright/40 transition-colors">
            <span className="material-symbols-outlined text-text-muted text-[20px]">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or user ID..."
              className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted w-full"
            />
          </div>
          <select className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer">
            <option>Account Status</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Pending</option>
          </select>
          <select className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer">
            <option>Verification Level</option>
            <option>Verified</option>
            <option>Unverified</option>
            <option>Premium Owner</option>
          </select>
        </div>

        {/* User Cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((user) => (
            <UserCard key={user.name} user={user} />
          ))}
        </div>

        <Pagination total="42" />
      </div>
    </main>
  );
}