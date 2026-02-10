import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

// Delete unverified users after 1 hour
UserSchema.index(
    { createdAt: 1 },
    {
        expireAfterSeconds: 3600, // 1 hour
        partialFilterExpression: { isVerified: false },
    }
);


export default mongoose.model<IUser>("User", UserSchema);


