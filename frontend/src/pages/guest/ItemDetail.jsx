import ImageGallery from "../../components/guest_ui/item_detail/ImageGallery";
import ItemHeader from "../../components/guest_ui/item_detail/ItemHeader";
import ItemSpecs from "../../components/guest_ui/item_detail/ItemSpecs";
import AvailabilityCalendar from "../../components/guest_ui/item_detail/AvailabilityCalendar";
// import OwnerCard from "../../components/guest_ui/item_detail/OwnerCard";

export default function ItemDetail() {
    
    return (
        <main className="max-w-[1400px] mx-auto px-6 lg:px-20 pt-5">
            {/* Breadcrumb */}
            <nav className="text-xs text-text-secondary uppercase tracking-widest mb-5">
                Marketplace › Electronics ›{" "}
                <span className="text-text-primary">Photography</span>
            </nav>

            <div className="grid grid-cols-12 gap-12">
                {/* LEFT */}
                <div className="col-span-12 lg:col-span-8 space-y-10">
                    <ImageGallery />
                    <ItemHeader />

                    <section className="space-y-4 max-w-3xl">
                        <h3 className="text-xl font-bold">The Full Picture</h3>
                        <p className="text-text-secondary leading-relaxed">
                            The Sony Alpha a7 IV is the ultimate all-rounder for professionals and serious enthusiasts. Whether you are capturing high-resolution stills or cinematic 4K video, this mirrorless powerhouse delivers exceptional clarity and color reproduction.
                            </p>
                            <p>
                            The 33MP Exmor R sensor combined with the BIONZ XR processing engine offers 15+ stops of dynamic range and lightning-fast autofocus that tracks human, animal, and bird eyes with surgical precision
                        </p>
                    </section>

                    <ItemSpecs />
                </div>

                {/* RIGHT */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                        <AvailabilityCalendar />
                    

                    {/* <OwnerCard /> */}
                </div>
            </div>
        </main>
    );
}
