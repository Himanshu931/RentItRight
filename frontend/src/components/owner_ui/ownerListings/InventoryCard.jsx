import { Edit2, Pause, Trash2, Star } from "lucide-react";

export default function InventoryCard({
    item,
    onEdit,
    onPause,
    onDelete
}) {
    const isRented = item.status === "rented";

    return (
        <div className="bg-surface border border-app/80 rounded-2xl overflow-hidden hover:border-bright transition-all group hover:cursor-pointer">
            <div className="flex flex-col md:flex-row">
                {/* Left: Info Section */}
                <div className="flex-1 p-4 flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-gray-800">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-base font-bold text-white tracking-tight">
                                {item.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${isRented
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}>
                                {item.status}
                            </span>
                            <div className="flex items-center gap-1 ml-auto md:ml-0">
                                <span className="text-sm font-bold text-white">{item.rating}</span>
                                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-[#1E4E49] rounded text-[10px] font-bold text-[#99F6E4] uppercase tracking-wider">
                                {item.category}
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-black text-white">${item.pricePerDay}</span>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">/day</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions Section */}
                <div className="border-t md:border-t-0 md:border-l border-gray-800/60 flex items-center px-5 py-4 md:py-0 bg-white/[0.01]">
                    <div className="flex items-center justify-center gap-6 w-full">
                        <ActionButton
                            icon={<Edit2 size={18} />}
                            label="EDIT"
                            onClick={() => onEdit?.(item.id)}
                        />
                        <ActionButton
                            icon={<Pause size={18} />}
                            label="PAUSE"
                            onClick={() => onPause?.(item.id)}
                        />
                        <ActionButton
                            icon={<Trash2 size={18} />}
                            label="DELETE"
                            onClick={() => onDelete?.(item.id)}
                            variant="danger"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, label, onClick, variant = "default" }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 group/btn"
        >
            <div className={`p-2.5 rounded-xl transition-all duration-200 ${variant === "danger"
                ? "text-gray-500 group-hover/btn:bg-red-500/10 group-hover/btn:text-red-500"
                : "text-gray-500 group-hover/btn:bg-white/5 group-hover/btn:text-white"
                }`}>
                {icon}
            </div>
            <span className="text-[10px] font-black tracking-[0.15em] text-gray-500 group-hover/btn:text-white transition-colors">
                {label}
            </span>
        </button>
    );
}