import { success } from "zod";
import { User } from "../models/user.model"
interface userData {
    name: string;
    phone: string;
    address: {
        pincode: string;
        city: string;
        state: string;
        country: string;
    };
    roles: "renter" | "owner" | "admin";
    profileImage?: string;
}

interface updateUserData {
    name?: string;
    phone?: string;
    address?: {
        pincode?: string;
        city?: string;
        state?: string;
        country?: string;
    };
}

interface addressData {
    pincode?: string;
    city?: string;
    state?: string;
    country?: string;
}

export const userProfileService = async (userId: string, userData: userData) => {

    const isMobileExists = await User.findOne({ phone: userData.phone });
    if (isMobileExists) {
        throw new Error("Mobile number already exists");
    }

    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) {
        throw new Error("User not found");
    }

    return { success: true, user }
}

export const getUserProfileService = async (userId: string) => {

    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }

    const profile: any = {
        id: user._id.toString(),
        email: user.email,
        name: user.name!,
        phone: user.phone!,
        address: {
            pincode: user.address?.pincode!,
            city: user.address?.city!,
            state: user.address?.state!,
            country: user.address?.country!,
        },
        profileImage: user.profileImage!,
    }

    if (user.roles?.includes("renter")) {
        profile.renter = user.renter;
    }

    if (user.roles?.includes("owner")) {
        profile.owner! = user.owner;
    }

    return profile;
}

export const updateProfileService = async (userId: string, userData: updateUserData) => {

    const allowedFields = ["name", "phone", "address"]
    const filteredData = Object.fromEntries(
        Object.entries(userData).filter(([key]) => allowedFields.includes(key))
    );

    const user = await User.findByIdAndUpdate(userId, { $set: filteredData }, { new: true, revalidate: true })
    if (!user) {
        throw new Error("User not found");
    }

    return { success: true }
}

export const updateProfileImageService = async (userId: string, profileImage: string) => {

    const user = await User.findByIdAndUpdate(userId, { $set: { profileImage } }, { new: true, revalidate: true })
    if (!user) {
        throw new Error("User not found");
    }

    return { success: true }
}

export const updateAddressService = async (userId: string, address: addressData) => {
    const user = await User.findByIdAndUpdate(userId, { $set: { address } }, { new: true, revalidate: true })
    if (!user) {
        throw new Error("User not found");
    }

    return { success: true }
}
export const deleteProfileService = async (userId: string) => {
    const user = await User.findByIdAndDelete(userId, { new: true })
    if (!user) {
        throw new Error("User not found");
    }

    return { success: true }
}