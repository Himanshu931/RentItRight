import React, { useState, useEffect, useCallback } from "react";
import {
  PageHeader,
  Tabs,
  Pagination,
} from "../../components/admin_ui/UI";
import BookingCard from "../../components/admin_ui/BookingCard";

export default function AdminBookings() {
  const [tab, setTab] = useState("All Bookings");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      let url = `${import.meta.env.VITE_BACKEND_URL}/admin/bookings?page=${page}&limit=10`;
      
      let statusFilter = "all";
      if (tab === "Ongoing") statusFilter = "ongoing";
      if (tab === "Completed") statusFilter = "completed";
      if (tab === "Pending") statusFilter = "pending";
      if (tab === "Cancelled") statusFilter = "cancelled";

      url += `&status=${statusFilter}`;
      
      if (query) url += `&search=${encodeURIComponent(query)}`;

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
        setBookings(result.data.bookings);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch admin bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [page, tab, query]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [tab, query]);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <PageHeader
          title="Bookings Management"
          description="Monitor and manage all rental transactions across the platform"
        />

        <Tabs
          items={["All Bookings", "Pending", "Ongoing", "Completed", "Cancelled"]}
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
              placeholder="Search by item title, user name or email..."
              className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted w-full"
            />
          </div>
        </div>

        {/* Booking Cards */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-10 text-text-muted">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-text-muted">No bookings found.</div>
          ) : (
            bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))
          )}
        </div>

        {!loading && bookings.length > 0 && (
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
