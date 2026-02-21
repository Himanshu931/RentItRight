import mongoose, { Schema, Document } from "mongoose";


export interface IItem extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  category: string;
  subCategory?: string;

  price: {
    daily: number;
    weekly?: number;
    monthly?: number;
  };

  discount: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  };

  securityDeposit: number;

  rating: {
    average: number;
    count: number;
  };

  location: {
    city: string;
    state: string;
    country: string;
    pincode: string;
  };

  availability: {
    isAvailable: boolean;
    unavailableDates: Date[];
  };

  isActive: boolean;
  totalBookings: number;

  createdAt: Date;
  updatedAt: Date;
}


const ItemSchema: Schema<IItem> = new Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    images: {
      type: [String],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
    },

    price: {
      daily: { type: Number, required: true },
      weekly: { type: Number },
      monthly: { type: Number },
    },

    discount: {
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },

    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },

    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    availability: {
      isAvailable: { type: Boolean, default: true },
      unavailableDates: [{ type: Date }],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* =======================
   Indexes (Important)
======================= */

// Fast filtering by city & category
ItemSchema.index({ "location.city": 1 });
ItemSchema.index({ category: 1 });

// Fast owner dashboard lookup
ItemSchema.index({ ownerId: 1 });


export const Item = mongoose.model<IItem>("Item", ItemSchema);