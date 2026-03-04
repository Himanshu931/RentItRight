import { useState, useEffect } from "react";
import { X, ChevronDown, ImagePlus, Package, DollarSign, IndianRupee } from "lucide-react";

export default function EditItemModal({ item, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        itemName: "",
        category: "",
        description: "",
        images: [],
        dailyPrice: "",
        weeklyPrice: "",
        monthlyPrice: ""
    });

    useEffect(() => {
        if (item) {
            setFormData({
                itemName: item.title || "",
                category: item.category || "",
                description: item.description || "Complete professional photography kit including Sony A7R IV, 24-70mm lens, 3 extra batteries, and 128GB SD card. Perfect for high-end production work.",
                images: item.images || (item.image ? [item.image] : []),
                dailyPrice: item.pricePerDay || "",
                weeklyPrice: item.pricePerWeekly || "510",
                monthlyPrice: item.pricePerMonthly || "1800"
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        const updatedImages = [...formData.images, ...imageUrls].slice(0, 5);
        setFormData(prev => ({
            ...prev,
            images: updatedImages
        }));
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/40 relative animate-[modalIn_0.25s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <style>{`
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to   { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-divider">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-bright/10">
                            <Package size={20} className="text-bright" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-primary tracking-tight">Edit Item</h2>
                            <p className="text-xs text-text-muted font-medium">Update your listing details</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSave} className="space-y-5">

                        <div className="pt-2">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Item Name</label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={formData.itemName}
                                        onChange={handleChange}
                                        className="w-full bg-card border border-divider rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bright focus:ring-1 focus:ring-bright/30 transition-all font-medium"
                                        placeholder="Enter item name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Category</label>
                                    <div className="relative group">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-card border border-divider rounded-xl px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:border-bright focus:ring-1 focus:ring-bright/30 transition-all appearance-none cursor-pointer font-medium"
                                            required
                                        >
                                            <option value="" className="bg-card text-text-muted">Select Category</option>
                                            <option value="Photography" className="bg-card">Photography</option>
                                            <option value="Electronics" className="bg-card">Electronics</option>
                                            <option value="Furniture" className="bg-card">Furniture</option>
                                            <option value="Sports" className="bg-card">Sports</option>
                                            <option value="Music" className="bg-card">Music</option>
                                        </select>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-card border border-divider rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bright focus:ring-1 focus:ring-bright/30 transition-all resize-none font-medium"
                                    placeholder="Describe your item..."
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div className="pt-2">
                            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">Images</label>
                            <div className="flex flex-wrap gap-3">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative w-28 h-20 rounded-xl overflow-hidden border border-divider group bg-card">
                                        <img src={img} alt="item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-divider bg-card/50 hover:bg-bright/5 hover:border-bright/40 transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer">
                                    <div className="p-1 bg-bright/10 rounded-lg ">
                                        <ImagePlus size={20} className="text-bright" />
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="pt-2 pb-2">
                            <div className="flex items-center gap-1 mb-4">
                                <IndianRupee size={14} className="text-bright font-black" />
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Pricing</label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">Daily Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
                                        <input
                                            type="text"
                                            name="dailyPrice"
                                            value={formData.dailyPrice}
                                            onChange={handleChange}
                                            className="w-full bg-card border border-divider rounded-xl pl-7 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-bright focus:ring-1 focus:ring-bright/30 transition-all font-bold"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">Weekly Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
                                        <input
                                            type="text"
                                            name="weeklyPrice"
                                            value={formData.weeklyPrice}
                                            onChange={handleChange}
                                            className="w-full bg-card border border-divider rounded-xl pl-7 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-bright focus:ring-1 focus:ring-bright/30 transition-all font-bold"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">Monthly Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
                                        <input
                                            type="text"
                                            name="monthlyPrice"
                                            value={formData.monthlyPrice}
                                            onChange={handleChange}
                                            className="w-full bg-card border border-divider rounded-xl pl-7 pr-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-bright focus:ring-1 focus:ring-bright/30 transition-all font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-divider">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-text-secondary bg-card border border-divider hover:bg-elevated hover:text-text-primary transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-bright text-app hover:bg-bright/85 active:scale-[0.98] transition-all"
                    >
                        Save Changes
                    </button>
                </div>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 5px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                `}</style>
            </div>
        </div>
    );
}
