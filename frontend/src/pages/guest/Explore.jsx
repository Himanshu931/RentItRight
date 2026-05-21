import { useEffect, useState, useCallback } from "react";

import LoginBanner from "../../components/guest_ui/explore/LoginBanner";
import ExploreSearchBar from "../../components/renter_ui/explore/ExploreSearchBar";
// import ExploreFilters from "../../components/renter_ui/explore/ExploreFilters";
import ExploreGrid from "../../components/renter_ui/explore/ExploreGrid";
import ExploreEmptyState from "../../components/renter_ui/explore/ExploreEmptyState";
import SEO from "../../components/common/SEO";

import ExplorePagination from "../../components/renter_ui/explore/ExplorePagination";

const Explore = () => {
  const [rentals, setRentals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 16;

  const exploreSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": "Explore Rentals | RentItRight",
    "description": "Browse, filter, and search premium items, camera gear, power tools, party supplies, and appliances available for rent in your local community.",
    "url": "https://rentitright.vercel.app/explore"
  };

  const fetchRentals = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      // Search logic is currently disabled as per user request in RenterExplore
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
      <SEO
        title="Explore Rental Items"
        description="Search and browse thousands of tools, electronics, appliances, and camera gear available for rent in your local area on RentItRight."
        keywords="rentals, browse items, rent tools near me, hire camera gear, peer to peer gear rental, RentItRight explore"
        url="/explore"
        schema={exploreSchema}
      />
      <LoginBanner />
      <ExploreSearchBar value={search} onChange={setSearch} />

      {/* <ExploreFilters filters={filters} onChange={setFilters} /> */}

      {rentals.length === 0 && !loading ? (
        <ExploreEmptyState />
      ) : (
        <div className="flex flex-col gap-10">
          <ExploreGrid rentals={rentals} loading={loading} linkPrefix="/item" />

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

export default Explore;
