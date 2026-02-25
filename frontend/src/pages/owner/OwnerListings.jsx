import { useState } from "react";
import { Plus } from "lucide-react";
import CompletedRentalCard from "../../components/owner_ui/ownerListings/CompletedRentalCard";
import SearchBar from "../../components/owner_ui/ownerListings/SearchBar";
import InventoryCard from "../../components/owner_ui/ownerListings/InventoryCard";
import InventoryTabs from "../../components/owner_ui/ownerListings/InventoryTabs";

export default function OwnerListings({
    inventoryItems = [],
    completedRentals = [],
    onEditItem,
    onPauseItem,
    onDeleteItem
}) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("active-items");

    const filteredItems = inventoryItems.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-app">
            <div className="max-w-[1400px] px-12 py-12 mx-auto space-y-12">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
                            Inventory
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">
                            Manage and track your equipment
                        </p>
                    </div>
                    <SearchBar search={search} setSearch={setSearch} />
                </div>

                {/* Filter & Add Row */}
                <div className="flex justify-between items-center bg-transparent">
                    <InventoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

                    <button className="bg-bright hover:bg-bright/80 active:scale-95 text-app px-6 py-3 rounded-2xl font-bold text-md flex items-center gap-3 transition-all ">
                        <Plus size={20} strokeWidth={3} />
                        New Item
                    </button>
                </div>

                {/* Inventory List */}
                <div className="space-y-4">
                    {filteredItems.map((item) => (
                        <InventoryCard
                            key={item.id}
                            item={item}
                            onEdit={onEditItem}
                            onPause={onPauseItem}
                            onDelete={onDeleteItem}
                        />
                    ))}
                </div>

                {/* Completed Section Detail */}
                <div className="pt-10">
                    <div className="flex items-center gap-6 mb-8">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.25em] whitespace-nowrap">
                            Recent Completed Rentals
                        </h2>
                        <div className="h-px bg-gray-800 w-full" />
                    </div>

                    <div className="space-y-4">
                        {completedRentals.map((rental) => (
                            <CompletedRentalCard
                                key={rental.id}
                                rental={rental}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}