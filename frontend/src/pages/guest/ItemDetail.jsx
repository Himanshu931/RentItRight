import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "../../components/guest_ui/item_detail/ImageGallery";
import ItemHeader from "../../components/guest_ui/item_detail/ItemHeader";
import ItemSpecs from "../../components/guest_ui/item_detail/ItemSpecs";
import AvailabilityCalendar from "../../components/guest_ui/item_detail/AvailabilityCalendar";
import SEO from "../../components/common/SEO";

export default function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/explore/${id}`);
                const data = await res.json();
                if (data.status === "success") {
                    setItem(data.item);
                }
            } catch (err) {
                console.error("Failed to fetch item:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-text-secondary">Loading item details...</div>;
    if (!item) return <div className="min-h-screen flex items-center justify-center text-error">Item not found</div>;

    const itemPrice = item.pricing?.daily || item.price?.daily || item.dailyPrice || item.price || 0;
    const itemSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": item.title,
        "image": item.images || [],
        "description": item.description,
        "category": item.category,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": itemPrice,
            "priceValidUntil": "2027-12-31",
            "availability": "https://schema.org/InStock",
            "url": window.location.href
        }
    };

    return (
        <>
            <SEO
                title={`${item.title} for Rent`}
                description={`Rent ${item.title} (Category: ${item.category}) starting at ₹${itemPrice}/day in ${item.location?.city || "your area"}. Check availability on RentItRight.`}
                keywords={`${item.title}, rent ${item.title}, ${item.category} rental, hire ${item.title}, RentItRight`}
                image={item.images?.[0]}
                type="product"
                schema={itemSchema}
            />
            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Breadcrumb */}
                <nav className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <span>Marketplace</span>
                    <span className="material-symbols-outlined !text-sm mt-0.5">chevron_right</span>
                    <span>{item.category}</span>
                    <span className="material-symbols-outlined !text-sm mt-0.5">chevron_right</span>
                    <span className="text-text-primary">{item.title}</span>
                </nav>

            <div className="grid grid-cols-12 gap-8 lg:gap-10">
                {/* LEFT */}
                <div className="col-span-12 lg:col-span-8 space-y-10">
                    <ImageGallery images={item.images} />
                    <ItemHeader item={item} />

                    <section className="space-y-6 max-w-3xl">
                        <h3 className="text-2xl font-black text-text-primary tracking-tight">The Full Picture</h3>
                        <div className="text-text-secondary leading-relaxed font-medium text-lg">
                            <p>{item.description}</p>
                        </div>
                    </section>

                    {/* Specifications only if they exist in a future schema, for now removing hardcoded one */}
                    {/* <ItemSpecs /> */}
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <AvailabilityCalendar unavailableDates={item.unavailableDates} />
                </div>
            </div>
        </main>
        </>
    );
}
