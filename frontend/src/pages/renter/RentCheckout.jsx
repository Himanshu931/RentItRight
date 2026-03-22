import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RentCheckoutLayout from "../../components/renter_ui/rent_checkout/RentCheckoutLayout";

export default function RentCheckout() {
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
                    We couldn't load the item for checkout. Please try again.
                </p>
            </div>
        );
    }

    // Format item to match expected structure in CostSummary.jsx
    const formattedItem = {
        ...item,
        booking: {
            securityDeposit: item.securityDeposit || 0,
            serviceFee: Math.ceil((item.pricing?.daily || 0) * 0.05) || 50, // Example 5% or 50 min
            discounts: {
                monthlyPercent: item.discount?.monthly || 10,
                weeklyPercent: item.discount?.weekly || 5,
            },
            protection: {
                included: true,
                coverageAmount: (item.pricing?.daily || 0) * 100 || 50000,
            }
        }
    };

    return (
        <RentCheckoutLayout
            item={formattedItem}
            availability={{
                disabledDates: item.unavailableDates || []
            }}
        />
    );
}
