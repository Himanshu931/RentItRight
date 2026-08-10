import React, { useState, useEffect, useCallback } from "react";
import {
  PageHeader,
  Button,
  Tabs,
  Pagination,
} from "../../components/admin_ui/UI";
import UserCard from "../../components/admin_ui/UserCard";

export default function Users() {
  const [tab, setTab] = useState("All Users");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Account Status");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      let url = `${import.meta.env.VITE_BACKEND_URL}/admin/users?page=${page}&limit=10`;
      
      if (tab === "Owners") url += "&role=owner";
      if (tab === "Renters") url += "&role=renter";
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (statusFilter !== "Account Status") {
        url += `&status=${statusFilter.toLowerCase()}`;
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
        setUsers(result.data.users);
        setTotalPages(result.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, tab, query, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [tab, query, statusFilter]);

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
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-divider rounded-xl px-4 py-2.5 text-sm text-text-secondary outline-none focus:border-bright/40 transition-colors appearance-none cursor-pointer"
          >
            <option>Account Status</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Inactive</option>
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
          {loading ? (
            <div className="text-center py-10 text-text-muted">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-text-muted">No users found.</div>
          ) : (
            users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))
          )}
        </div>

        {!loading && users.length > 0 && (
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