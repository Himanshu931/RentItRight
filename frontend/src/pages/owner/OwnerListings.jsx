import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import SearchBar from "../../components/owner_ui/ownerListings/SearchBar";
import InventoryCard from "../../components/owner_ui/ownerListings/InventoryCard";
import InventoryTabs from "../../components/owner_ui/ownerListings/InventoryTabs";
import { inventoryItemsDummy } from "../../data/ownerListingDummy";
import AddItemModal from "../../modals/AddItemModal";
import EditItemModal from "../../modals/EditItemModal";

export default function OwnerListings() {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all-items");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const handleAddItem = (itemData) => {
        // 🔥 This is where backend API will be called later
        console.log("New Item Data:", itemData);
        setIsAddModalOpen(false);
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
    };

    const handleUpdateItem = (updatedItemData) => {
        // 🔥 This is where backend API will be called later
        console.log("Updated Item Data:", updatedItemData);
        setEditingItem(null);
    };

    const filteredItems = useMemo(() => {
        return inventoryItemsDummy
            .filter((item) => {
                switch (activeTab) {
                    case "all-items":
                        return true;
                    case "active-items":
                        return item.status === "active" || item.status === "rented";
                    case "rented-items":
                        return item.status === "rented";
                    case "paused":
                        return item.status === "paused";
                    default:
                        return true;
                }
            })
            .filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
            );
    }, [activeTab, search]);

    return (
        <main className="min-h-screen bg-app">
            <div className="max-w-[1400px] px-6 py-6 mx-auto space-y-8">

                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white mb-1">
                            Inventory
                        </h1>
                        <p className="text-text-secondary font-medium text-lg">
                            Manage and track your equipment
                        </p>
                    </div>
                    <SearchBar search={search} setSearch={setSearch} />
                </div>

                {/* Filter & Add Row */}
                <div className="flex justify-between items-center bg-transparent">
                    <InventoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

                    <button className="bg-bright hover:bg-bright/80 active:scale-95 text-app px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all 
                    hover:cursor-pointer"
                        onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} strokeWidth={3} />
                        New Item
                    </button>
                </div>

                {/* Inventory List */}
                <div className="space-y-4">
                    {filteredItems.map((item) => (
                        <InventoryCard
                            key={item.id}
                            item={item}
                            onEdit={() => handleEditItem(item)}
                        />
                    ))}
                </div>

            </div>

            {isAddModalOpen && (
                <AddItemModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddItem}
                />
            )}

            {editingItem && (
                <EditItemModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSubmit={handleUpdateItem}
                />
            )}
        </main>
    );
}
