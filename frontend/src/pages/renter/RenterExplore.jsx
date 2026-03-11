import { useEffect, useState, useCallback } from "react";

import ExploreSearchBar from "../../components/renter_ui/explore/ExploreSearchBar";
// import ExploreFilters from "../../components/renter_ui/explore/ExploreFilters";
import ExploreGrid from "../../components/renter_ui/explore/ExploreGrid";
import ExploreEmptyState from "../../components/renter_ui/explore/ExploreEmptyState";

import ExplorePagination from "../../components/renter_ui/explore/ExplorePagination";

const RenterExplore = () => {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 16;

  const fetchRentals = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      // Search logic is currently disabled as per user request to "fetch all data"
      // But we use /search endpoint for page-based pagination features
      queryParams.append("page", p);
      queryParams.append("limit", ITEMS_PER_PAGE);

      const query = `${import.meta.env.VITE_BACKEND_URL}/explore?${queryParams.toString()}`
      console.log(query)
      const res = await fetch(query);
      const data = await res.json();
      console.log(data)
      const totalPages=Math.ceil((data.total || 0) / ITEMS_PER_PAGE);

      if (data.status === "success") {
        setRentals(data.data || []);
        setTotalPages(totalPages || 1);
        setPage(p || 1);

        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals(page);
  }, [page, fetchRentals]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-20 py-8 min-h-screen">
      <ExploreSearchBar value={search} onChange={setSearch} />

      {/* <ExploreFilters filters={filters} onChange={setFilters} /> */}

      {rentals.length === 0 && !loading ? (
        <ExploreEmptyState />
      ) : (
        <div className="flex flex-col gap-10">
          <ExploreGrid rentals={rentals} />

          <ExplorePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RenterExplore;
