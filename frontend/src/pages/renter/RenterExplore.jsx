import { useEffect, useState, useCallback } from "react";
import ExploreSearchBar from "../../components/renter_ui/explore/ExploreSearchBar";
import ExploreGrid from "../../components/renter_ui/explore/ExploreGrid";
import ExploreEmptyState from "../../components/renter_ui/explore/ExploreEmptyState";
import ExplorePagination from "../../components/renter_ui/explore/ExplorePagination";
import useAuth from "../../hooks/authHook";
import toast from "react-hot-toast";


const RenterExplore = () => {
  const [rentals, setRentals] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();


  const ITEMS_PER_PAGE = 16;

  const fetchWishlist = useCallback(async () => {
    try {
      if (!user) return;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/wishlist`, {
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setWishlistIds(new Set(data.data.map(item => item.id)));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [user]);


  const fetchRentals = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", p);
      queryParams.append("limit", ITEMS_PER_PAGE);

      const query = `${import.meta.env.VITE_BACKEND_URL}/explore?${queryParams.toString()}`
      const res = await fetch(query);
      const data = await res.json();
      const totalPages = Math.ceil((data.total || 0) / ITEMS_PER_PAGE);

      if (data.status === "success" || data.success) {
        setRentals(data.data || data.items || []);
        setTotalPages(totalPages || 1);
        setPage(p || 1);
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
    fetchWishlist();
  }, [page, fetchRentals, fetchWishlist]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleToggleWishlist = async (itemId) => {
    try {
      if (!user) {
        toast.error("Please login to use wishlist");
        return;
      }

      // Fetch CSRF Token
      const csrfRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrfRes.json();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        credentials: "include",
        body: JSON.stringify({ itemId })
      });
      const data = await response.json();
      if (data.success) {
        setWishlistIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(itemId)) {
            newSet.delete(itemId);
          } else {
            newSet.add(itemId);
          }
          return newSet;
        });
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };


  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-20 py-8 min-h-screen">
      <ExploreSearchBar value={search} onChange={setSearch} />

      {rentals.length === 0 && !loading ? (
        <ExploreEmptyState />
      ) : (
        <div className="flex flex-col gap-10">
          <ExploreGrid 
            rentals={rentals} 
            wishlistIds={wishlistIds} 
            onToggleWishlist={handleToggleWishlist} 
            loading={loading}
          />

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

