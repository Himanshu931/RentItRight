import { ChevronRight, Star } from "lucide-react";

export default function CompletedRentalCard({ rental }) {
    return (
        <div className="bg-[#0f172a]/40 border border-gray-800/60 rounded-2xl p-5 hover:border-gray-700 transition-all group">
            <div className="flex items-center gap-6">
                {/* Thumbnail */}
                <div className="h-14 w-14 rounded-xl overflow-hidden border border-gray-800 shrink-0">
                    <img
                        src={rental.image}
                        alt={rental.itemTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Title & Info */}
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-0.5">
                        {rental.itemTitle}
                    </h4>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">{rental.renterName}</span>
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white">{rental.rating.toFixed(1)}</span>
                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Earnings & Link */}
                <div className="flex items-center gap-12 text-right">
                    <div>
                        <p className="text-lg font-black text-white">
                            ${rental.amount.toFixed(2)}
                        </p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {rental.days} DAYS
                        </p>
                    </div>

                    <button className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-400 Transition-colors">
                        View Feedback
                        <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
}