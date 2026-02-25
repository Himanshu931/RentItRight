import WishlistHeader from "../../components/renter_ui/wishlist/WishlistHeader";
import WishlistTabs from "../../components/renter_ui/wishlist/WishlistTabs";
import WishlistGrid from "../../components/renter_ui/wishlist/WishlistGrid";
import { useState } from "react";
import { useMemo } from "react";

export default function RenterWishlist() {

    const wishlistItems = [
        {
            id: "w1",
            title: "Sony Alpha a7 IV",
            category: "Professional Gear",
            rating: 4.9,
            reviews: 128,
            pricePerDay: 85,
            image:
                "https://images.unsplash.com/photo-1606986601547-a4d886b671b2",
            available: true,
        },
        {
            id: "w2",
            title: "DJI Mavic 3 Pro",
            category: "Drones",
            rating: 5.0,
            reviews: 42,
            pricePerDay: 120,
            image:
                "https://images.unsplash.com/photo-1667822339262-bf66ed5531a2",
            available: true,
        },
        {
            id: "w3",
            title: "Aputure 600d Pro",
            category: "Lighting",
            rating: 4.8,
            reviews: 15,
            pricePerDay: 95,
            image:
                "https://images.unsplash.com/photo-1581591524425-c7e0978865fc",
            available: true,
        },
        {
            id: "w4",
            title: "RED Komodo 6K",
            category: "Cameras",
            rating: 4.9,
            reviews: 29,
            pricePerDay: 250,
            image:
                "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb",
            available: false,
        },
    ];


    const [activeTab, setActiveTab] = useState("all");

    const filteredItems = useMemo(() => {
        if (activeTab === "available") {
            return wishlistItems.filter((item) => item.available);
        }
        return wishlistItems;
    }, [activeTab]);

    return (
        <main className="flex-1 overflow-y-auto bg-background-dark">
            <div className="max-w-[1200px] mx-auto px-8 py-10">
                <WishlistHeader
                    title="Your Saved Items"
                    subtitle="Premium gear waiting for your next project."
                    total={filteredItems.length}
                />

                <WishlistTabs activeTab={activeTab}
                    onChange={setActiveTab} />

                <WishlistGrid items={filteredItems} />
            </div>
        </main>
    );
}
