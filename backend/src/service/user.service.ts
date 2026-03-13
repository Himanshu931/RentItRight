
import { User } from "../models/user.model"
import { Item } from "../models/item.model"
import { Booking } from "../models/booking.model";
import { AppError } from "../utils/AppError";

interface userData {
    name: string;
    phone: string;
    address: {
        pincode: string;
        district: string;
        state: string;
    };
    roles: "renter" | "owner" | "admin";
    profileImage?: string;
}

interface updateUserData {
    name?: string;
    phone?: string;
    address?: {
        pincode?: string;
        district?: string;
        state?: string;
    };
}

interface addressData {
    pincode?: string;
    district?: string;
    state?: string;
}

export const userProfileService = async (userId: string, userData: userData) => {

    const isMobileExists = await User.findOne({ phone: userData.phone });
    if (isMobileExists) {
        throw new AppError("Mobile number already exists", 400);
    }

    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { success: true, user }
}

export const getUserProfileService = async (userId: string) => {

    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const profile: any = {
        id: user._id.toString(),
        email: user.email,
        name: user.name!,
        phone: user.phone!,
        address: {
            pincode: user.address?.pincode!,
            district: user.address?.district!,
            state: user.address?.state!,
        },
        profileImage: user.profileImage!,
    }

    if (user.roles?.includes("renter")) {
        profile.renter = user.renter;
    }

    if (user.roles?.includes("owner")) {
        profile.owner = user.owner;
    }

    return profile;
}

export const updateProfileService = async (userId: string, userData: updateUserData) => {

    const allowedFields = ["name", "phone", "address"]
    const filteredData = Object.fromEntries(
        Object.entries(userData).filter(([key]) => allowedFields.includes(key))
    );

    const user = await User.findByIdAndUpdate(userId, { $set: filteredData }, { new: true, runValidators: true })
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { success: true }
}

export const updateProfileImageService = async (userId: string, profileImage: string) => {

    const user = await User.findByIdAndUpdate(userId, { $set: { profileImage } }, { new: true, runValidators: true })
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { success: true }
}

export const updateAddressService = async (userId: string, address: addressData) => {
    const user = await User.findByIdAndUpdate(userId, { $set: { address } }, { new: true, runValidators: true })
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { success: true }
}

export const deleteProfileService = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId, { new: true })
    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { success: true }
}

export const dashboardDataService = async (userId: string) => {

    const user = await User.findById(userId).lean();

    if (!user) {
        throw new AppError("User not found", 404);
    }

    console.log("user role", user.roles)

    if (user.roles === "owner") {
        const activeOwnerRentals = await Item.countDocuments({
            owner: userId,
            status: "active",
        });

        return {
            totalListings: user.owner?.totalListings ?? 0,
            activeRentals: activeOwnerRentals,
            totalEarnings: user.owner?.totalEarnings ?? 0,
        };
    }

    if (user.roles === "renter") {
        const activeRenterRentals = await Booking.countDocuments({
            renter_id: userId,
            booking_status: "ongoing",
        });

        const upcomingRentals = await Booking.countDocuments({
            renter_id: userId,
            booking_status: "confirmed",
            start_date: { $gt: new Date() },
        });

        return {
            activeRentals: activeRenterRentals,
            upcomingRentals,
            wishlist: user.renter?.wishlist?.length ?? 0,
        };
    }

    throw new AppError("Invalid user role", 400);
};
