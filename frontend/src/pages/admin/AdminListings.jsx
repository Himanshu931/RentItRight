import React, { useMemo, useState } from "react";
import {
  PageHeader,
  Button,
  Tabs,
  Pagination,
} from "../../components/admin_ui/UI";
import ListingCard from "../../components/admin_ui/ListingCard";

const image1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBM2gGou9x5jcS9RUf8eQEnhc1midWteOEv3hvkr0D9yGzvwZHgni205cy8nyOkQuVuA5-oEAy81Eze19jjz5ddCDEHqGCWhaqPM5APoXhfXbSyEacQ_egtMXRm3sr1ZYN2d-Ju1jrsboLkM2GuA56vEzIRMKbCJBUtOPTJTmR48-VAhgZR3Y5t41blBwNCrP_fDpWTk-A0RUAMedMI_O5gLd9JcyL7-34Jym1sYTqkRjM7d2MUlJfuDrLBUKhZnDoEAb_CjePBh9I";
const image2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBFhbkmVfhcr3L6sNpfyMrRA9fQam52ZDDHa46Fbtw9nslOm8rJdGJQAZthw2f15WaLKgR1d9YNEJSTi1tyekpes8raS0a6Xviel0spACrZD4jMCueDrB-PJ5Y1Pna_Z68fq1ghRmrw2k5hklj4HlA9af9y3-J_oGAEKrLN5HOtEBtka5706IHRq5e-91NOCNTPy5iGqaBHivpcxqwStS6a8a68IzUuQNg8f3ZCUf1MpvovhjUZJWWL0-AMn5v2prSjN9fbHLKWL-4";
const image3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBM5E9Cm9Lkgv6ZM75X35Uuw-Xmdd0yqkvOoNchkllqhMvYbXn0u_ggqhoHzShcQA7c1eOMkaEsqeatwdHZUV9Jzvm5yO9B2V2goq_GvyTOjc_jqjB_tkX0JnaZPgc9sXzYx4in-TG9sEXsn5RtHhaYmWnMWlaPZhM507VBDm0oLFkDfc9I1CRWkV8euoplby4wfZjqT3VMgcaq8YirYsY0ryfoYRVlr-Ts0dNn94ECVDtExMd_seMe6cjmn-FxYaeinoTdqcuLhe0";
const image4 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUh8BnmQ5zQTSyb6qoGqytWq57BYVixq5lFDms1wi7AtDxZdj5RZrEHClPGb6wyHNzKpIe5K3OU4uY7nViQVZTggDb4MsA4pMTSVX45bLVHllCYVWiv25qotI4ziuv1bmeuWk_46e9Qzt9jI0Pw1qrjuslA0qc5Gu37uNkKeLm0H5uvVjVVnOY2CDwVzvmL7O59j3uCurL3BjDwYbyglaFVTmNByymql4d-bPraQpNMj8_cdj1vXmkqPL6iNzcVErxJZ1YMRggBoE";

const listings = [
  {
    title: "Professional DSLR Camera Kit",
    owner: "Marcus Richardson",
    rating: "4.9",
    category: "Electronics",
    price: 45,
    status: "Active",
    reports: 0,
    image: image1,
  },
  {
    title: "Mountain E-Bike - Trek 2023",
    owner: "Sarah Jenkins",
    rating: "4.8",
    category: "Sports",
    price: 72,
    status: "Paused",
    reports: 2,
    image: image2,
  },
  {
    title: "Industrial Generator 5000W",
    owner: "Leo D'Angelo",
    rating: "4.7",
    category: "Tools",
    price: 120,
    status: "Reported",
    reports: 14,
    image: image3,
  },
  {
    title: "Home Cinema Projector 4K",
    owner: "Elena Rodriguez",
    rating: "4.5",
    category: "Electronics",
    price: 30,
    status: "Removed",
    reports: 0,
    image: image4,
  },
];

export default function Listings() {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      listings.filter((l) => {
        const tabMatch = tab === "All" || l.status === tab;
        const q = query.toLowerCase();
        return (
          tabMatch &&
          (!q || `${l.title} ${l.owner}`.toLowerCase().includes(q))
        );
      }),
    [tab, query]
  );

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <PageHeader
          title="Admin Listings Management Hub"
          description="Review, monitor, and manage all platform inventory"
          actions={<Button icon="add_circle">New Listing</Button>}
        />

        <Tabs
          items={["All", "Active", "Paused", "Reported", "Removed"]}
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
              placeholder="Search title or ID..."
              className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted w-full"
            />
          </div>
          <select className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer">
            <option>Category</option>
            <option>Electronics</option>
            <option>Tools</option>
            <option>Vehicles</option>
            <option>Real Estate</option>
          </select>
          <select className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer">
            <option>Owner</option>
            <option>Verified Only</option>
            <option>Premium Owners</option>
          </select>
          <select className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer">
            <option>Price Range</option>
            <option>$0 - $50</option>
            <option>$50 - $200</option>
            <option>$200+</option>
          </select>
          <select className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer">
            <option>Location</option>
            <option>North America</option>
            <option>Europe</option>
            <option>Asia</option>
          </select>
        </div>

        {/* Listing Cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.title} listing={listing} />
          ))}
        </div>

        <Pagination total="142" />

        {/* Bulk Action Bar */}
        <div className="mt-6 bg-surface border border-divider rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm text-text-secondary font-medium">
            3 listings selected
          </span>
          <div className="flex items-center gap-2">
            <Button icon="download">Export</Button>
            <Button icon="block" warning>
              Disable
            </Button>
            <Button icon="delete" danger>
              Remove
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}