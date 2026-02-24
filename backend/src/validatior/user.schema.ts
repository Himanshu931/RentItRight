import z from "zod"

export const profileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),

    phone: z.string().min(10, "Phone must be at least 10 digits long"),

    address: z.object({
        pincode: z.string().min(6, "Pincode must be 6 digits"),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        country: z.string().min(2, "Country is required"),
    }),

    roles: z.enum(["renter", "owner", "admin"]).default("renter"),

    profileImage: z.string().min(3, "Profile image must be at least 3 characters long").optional(),
});

export const updateProfileSchema = profileSchema.partial();

export const updateAddressSchema = z.object({
    pincode: z.string().min(6, "Pincode must be 6 digits").optional(),
    city: z.string().min(2, "City is required").optional(),
    state: z.string().min(2, "State is required").optional(),
    country: z.string().min(2, "Country is required").optional(),
})
