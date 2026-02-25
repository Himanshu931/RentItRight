export default function InventoryTabs({ activeTab, onTabChange }) {
    const tabs = ["Active Items", "Rented Items", "Completed", "Paused"];

    return (
        <div className="flex items-center gap-8 border-b border-gray-800/50">
            {tabs.map((tab) => {
                const id = tab.toLowerCase().replace(" ", "-");
                const isActive = activeTab === id;
                return (
                    <button
                        key={tab}
                        onClick={() => onTabChange(id)}
                        className={`pb-4 text-sm font-bold transition-all relative ${isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        {tab}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-bright" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
