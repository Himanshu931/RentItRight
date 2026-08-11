import { useState } from "react";
import { X, Package, ImagePlus, IndianRupee, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import CategoryInput from "../components/common/CategoryInput";

function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5 font-medium animate-[fadeIn_0.2s_ease-out]">
            <AlertCircle size={12} className="shrink-0" />
            {message}
        </p>
    );
}

export default function AddItemModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        itemName: "",
        category: "",
        description: "",
        dailyPrice: "",
        weeklyPrice: "",
        monthlyPrice: "",
        securityDeposit: "",
        images: []
    });
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    const clearError = (field) => {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        clearError(name);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const updatedImages = [...formData.images, ...files].slice(0, 5);
        setFormData((prev) => ({ ...prev, images: updatedImages }));
        clearError("images");
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const uploadImagesToCloudinary = async (files) => {
        const uploadUrl = import.meta.env.VITE_CLOUDINARY_URL;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

        const uploadPromises = files.map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", uploadPreset);

            try {
                const response = await fetch(uploadUrl, {
                    method: "POST",
                    body: data,
                });
                const resData = await response.json();
                return resData.secure_url;
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                return null;
            }
        });

        return Promise.all(uploadPromises);
    };

    const addItemToBackend = async (data) => {
        try {
            const csrfRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
                method: "GET",
                credentials: "include"
            });
            const { csrfToken } = await csrfRes.json();

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to add item");

            return result;
        } catch (error) {
            console.error("Backend error:", error);
            throw error;
        }
    };

    const validate = () => {
        const newErrors = {};
        const { itemName, category, description, dailyPrice, weeklyPrice, monthlyPrice, securityDeposit } = formData;

        // Title
        if (!itemName.trim()) {
            newErrors.itemName = "Item name is required";
        } else if (itemName.trim().length < 4) {
            newErrors.itemName = "Item name must be at least 4 characters";
        }

        // Category
        if (!category.trim()) {
            newErrors.category = "Category is required";
        }

        // Description
        if (!description.trim()) {
            newErrors.description = "Description is required";
        } else if (description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }

        // Daily price
        if (!dailyPrice) {
            newErrors.dailyPrice = "Daily price is required";
        } else if (isNaN(Number(dailyPrice)) || Number(dailyPrice) < 1) {
            newErrors.dailyPrice = "Daily price must be at least ₹1";
        }

        // Weekly price (optional)
        if (weeklyPrice && (isNaN(Number(weeklyPrice)) || Number(weeklyPrice) < 0)) {
            newErrors.weeklyPrice = "Weekly price must be a valid number";
        }

        // Monthly price (optional)
        if (monthlyPrice && (isNaN(Number(monthlyPrice)) || Number(monthlyPrice) < 0)) {
            newErrors.monthlyPrice = "Monthly price must be a valid number";
        }

        // Security deposit
        if (!securityDeposit) {
            newErrors.securityDeposit = "Security deposit is required";
        } else if (isNaN(Number(securityDeposit)) || Number(securityDeposit) < 1) {
            newErrors.securityDeposit = "Security deposit must be at least ₹1";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setIsUploading(true);
        try {
            const imageUrls = await uploadImagesToCloudinary(formData.images);
            const finalData = {
                title: formData.itemName.trim(),
                description: formData.description.trim(),
                category: formData.category.trim(),
                price: {
                    daily: Number(formData.dailyPrice),
                    weekly: Number(formData.weeklyPrice) || 0,
                    monthly: Number(formData.monthlyPrice) || 0
                },
                securityDeposit: Number(formData.securityDeposit),
                images: imageUrls.filter(url => url !== null)
            };

            await addItemToBackend(finalData);

            toast.success("Item added successfully! 🚀");
            if (onSubmit) {
                onSubmit(finalData);
            }
            onClose();
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to add item. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const inputClass = (field) =>
        `w-full bg-card border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-all ${
            errors[field]
                ? "border-red-500/60 focus:border-red-400 focus:ring-1 focus:ring-red-400/30"
                : "border-divider focus:border-bright focus:ring-1 focus:ring-bright/30"
        }`;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/40 relative animate-[modalIn_0.25s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-divider">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-bright/10">
                            <Package size={20} className="text-bright" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-primary tracking-tight">Add New Item</h2>
                            <p className="text-xs text-text-muted font-medium">List a new item for rent</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">

                    {/* Item Name & Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                                Item Name<span className="text-bright"> *</span>
                            </label>
                            <input
                                type="text"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                placeholder="e.g. Sony A7III Camera"
                                className={inputClass("itemName")}
                            />
                            <FieldError message={errors.itemName} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                                Category<span className="text-bright"> *</span>
                            </label>
                            <CategoryInput
                                id="add-item-category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Type or select category"
                                className={inputClass("category")}
                            />
                            <FieldError message={errors.category} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                            Description<span className="text-bright"> *</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell renters about your item, its condition, and what's included..."
                            rows="3"
                            className={`${inputClass("description")} resize-none`}
                        />
                        <div className="flex justify-between items-start">
                            <FieldError message={errors.description} />
                            <span className={`text-xs mt-1.5 ${formData.description.length < 10 ? "text-text-muted" : "text-bright/70"}`}>
                                {formData.description.length}/10 min
                            </span>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1.5 uppercase tracking-wider">
                            Upload Images
                        </label>

                        <label
                            htmlFor="imageUpload"
                            className="block border-2 border-dashed border-divider hover:border-bright/40 rounded-xl p-6 text-center cursor-pointer bg-card/50 hover:bg-bright/5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-bright/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-bright/20 transition-colors">
                                <ImagePlus size={22} className="text-bright" />
                            </div>
                            <p className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                                Drag & drop or click to upload
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                                JPG, PNG up to 10MB &middot; Max 5 images
                            </p>
                            {formData.images.length > 0 && (
                                <p className="text-xs text-bright font-bold mt-2">
                                    {formData.images.length} file{formData.images.length > 1 ? "s" : ""} selected
                                </p>
                            )}
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="imageUpload"
                            />
                        </label>
                        {/* Thumbnail Preview */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                                {formData.images.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative group rounded-xl overflow-hidden border border-divider bg-card"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="w-full h-20 object-cover"
                                        />

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage(index);
                                            }}
                                            className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pricing Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <IndianRupee size={14} className="text-bright" />
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                                Pricing
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">
                                    Daily <span className="text-bright">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
                                    <input
                                        type="text"
                                        name="dailyPrice"
                                        value={formData.dailyPrice}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`${inputClass("dailyPrice")} pl-7`}
                                    />
                                </div>
                                <FieldError message={errors.dailyPrice} />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">
                                    Weekly
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
                                    <input
                                        type="text"
                                        name="weeklyPrice"
                                        value={formData.weeklyPrice}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`${inputClass("weeklyPrice")} pl-7`}
                                    />
                                </div>
                                <FieldError message={errors.weeklyPrice} />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">
                                    Monthly
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
                                    <input
                                        type="text"
                                        name="monthlyPrice"
                                        value={formData.monthlyPrice}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`${inputClass("monthlyPrice")} pl-7`}
                                    />
                                </div>
                                <FieldError message={errors.monthlyPrice} />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">
                                    Deposit <span className="text-bright">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
                                    <input
                                        type="text"
                                        name="securityDeposit"
                                        value={formData.securityDeposit}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className={`${inputClass("securityDeposit")} pl-7`}
                                    />
                                </div>
                                <FieldError message={errors.securityDeposit} />
                            </div>
                        </div>
                    </div>

                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-divider">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-text-secondary bg-card border border-divider hover:bg-elevated hover:text-text-primary transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-bright text-app hover:bg-bright/85 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-app/30 border-t-app rounded-full animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            "Add Item"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
