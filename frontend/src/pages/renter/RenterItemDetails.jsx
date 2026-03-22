import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ImageGallery from "../../components/renter_ui/item_detail/ImageGallery";
import ItemSummaryCard from "../../components/renter_ui/item_detail/ItemSummaryCard";
import OwnerCard from "../../components/renter_ui/item_detail/OwnerCard";
import ItemDescription from "../../components/renter_ui/item_detail/ItemDescription";
import ItemSpecs from "../../components/renter_ui/item_detail/ItemSpecs";
import RentalGuidelines from "../../components/renter_ui/item_detail/RentalGuidelines";

const RenterItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/explore/${id}`);
        const data = await res.json();
        
        if (data.status === "success") {
          setItem(data.item);
        } else {
          setError(data.message || "Failed to fetch item details");
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-text-primary">
          {error || "Item not found"}
        </h2>
        <p className="text-text-secondary">
          The item might have been removed or is no longer available.
        </p>
      </div>
    );
  }

  // Backwards compatibility for components that might expect certain fields
  const formattedItem = {
    ...item,
    image: item.images?.[0] || "",
    // Fallbacks for missing specs/guidelines from backend
    specs: item.specs || [
      { label: "Category", value: item.category },
      { label: "Availability", value: "Instant" },
    ],
    guidelines: item.guidelines || [
      "Return the item in the same condition it was received.",
      "Inform the owner of any damage immediately.",
      "Late returns may incur extra charges.",
    ]
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-20 py-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">

      {/* LEFT */}
      <div>
        <ImageGallery image={formattedItem.image} />

        <ItemDescription description={formattedItem.description} />

        <ItemSpecs specs={formattedItem.specs} />

        <RentalGuidelines rules={formattedItem.guidelines} />
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-6">
        <ItemSummaryCard item={formattedItem} />
        {formattedItem.owner && <OwnerCard owner={formattedItem.owner} />}
      </div>
    </div>
  );
};

export default RenterItemDetails;
