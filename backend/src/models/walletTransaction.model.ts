import mongoose, { Schema, Document } from "mongoose";

export interface IWalletTransaction extends Document {
  user_id: mongoose.Types.ObjectId;
  amount: number; // Positive for top-ups, negative for payments
  type: "topup" | "payment" | "refund" | "withdrawal";
  reference_id?: mongoose.Types.ObjectId; // E.g., Booking ID or external Payment ID
  balance_before: number;
  balance_after: number;
  description: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema: Schema<IWalletTransaction> = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["topup", "payment", "refund", "withdrawal"],
      required: true,
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId, // Optional reference to Booking/Payment models
    },
    balance_before: {
      type: Number,
      required: true,
    },
    balance_after: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

// Index for fetching a user's transaction history quickly
WalletTransactionSchema.index({ user_id: 1, createdAt: -1 });

export const WalletTransaction = mongoose.model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema);
