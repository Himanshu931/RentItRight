import React, { useState, useEffect, useCallback } from "react";
import {
  PageHeader,
  Button,
  Tabs,
  Pagination,
} from "../../components/admin_ui/UI";
import ListingCard from "../../components/admin_ui/ListingCard";

export default function Listings() {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Category");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      let url = `${import.meta.env.VITE_BACKEND_URL}/admin/listings?page=${page}&limit=10`;
      
      if (tab !== "All") url += `&status=${tab.toLowerCase()}`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (categoryFilter !== "Category") {
        url += `&category=${categoryFilter}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        setListings(result.data.listings);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch admin listings:", error);
    } finally {
      setLoading(false);
    }
  }, [page, tab, query, categoryFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [tab, query, categoryFilter]);

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
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer"
          >
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
          {loading ? (
            <div className="text-center py-10 text-text-muted">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-10 text-text-muted">No listings found.</div>
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} onToggle={fetchListings} />
            ))
          )}
        </div>

        {!loading && listings.length > 0 && (
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        )}
      </div>
    </main>
  );
}