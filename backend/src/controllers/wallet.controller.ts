import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { WalletTransaction } from "../models/walletTransaction.model";
import { Booking } from "../models/booking.model";
import { Payment } from "../models/payment.model";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder",
});

export const getWalletBalance = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await User.findById(userId).select("walletBalance");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    balance: user.walletBalance,
  });
});

export const getWalletTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    WalletTransaction.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    WalletTransaction.countDocuments({ user_id: userId }),
  ]);

  res.status(200).json({
    success: true,
    data: transactions,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});

export const createRazorpayOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const { amount } = req.body;
  const numericAmount = Number(amount);

  if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
    throw new AppError("Invalid amount. Must be a positive number.", 400);
  }

  if (numericAmount > 100000) {
    throw new AppError("Maximum top-up amount is ₹1,00,000", 400);
  }

  // Create Razorpay order (amount is in paise)
  const options = {
    amount: Math.round(numericAmount * 100), 
    currency: "INR",
    receipt: `rcpt_${userId.toString().substring(0,8)}_${Date.now()}`.substring(0, 40),
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
  });
});

export const verifyRazorpayPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount) {
      throw new AppError("Missing payment verification details", 400);
  }

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "placeholder")
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new AppError("Invalid payment signature", 400);
  }

  // Payment signature is verified, but we must verify the actual amount paid from Razorpay
  // to prevent client-side tampering of the 'amount' field.
  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  
  if (payment.status !== 'captured' && payment.status !== 'authorized') {
      throw new AppError("Payment not successful", 400);
  }

  // payment.amount is in paise
  const actualAmount = Number(payment.amount) / 100;
  const sanitizedAmount = Math.round(actualAmount * 100) / 100;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Read balance BEFORE the update for audit trail
    const userBefore = await User.findById(userId).select("walletBalance").session(session);
    if (!userBefore) {
      throw new AppError("User not found", 404);
    }

    const balanceBefore = userBefore.walletBalance;

    // Atomic update of user balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { walletBalance: sanitizedAmount } },
      { new: true, session }
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    // Create immutable transaction record
    await WalletTransaction.create(
      [
        {
          user_id: userId,
          amount: sanitizedAmount,
          type: "topup",
          balance_before: balanceBefore,
          balance_after: updatedUser.walletBalance,
          description: `Wallet top-up via Razorpay (${razorpay_payment_id})`,
          status: "completed",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Wallet topped up successfully",
      balance: updatedUser.walletBalance,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export const payWithWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const { bookingId } = req.body;

  if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new AppError("Invalid booking ID", 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch Booking and validate
    const booking = await Booking.findById(bookingId).session(session);
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.renter_id.toString() !== userId) {
      throw new AppError("Not authorized to pay for this booking", 403);
    }

    if (booking.payment_status !== "pending") {
      throw new AppError("Booking is already paid or cancelled", 400);
    }

    const amountToPay = booking.pricing.totalAmount;

    if (!amountToPay || amountToPay <= 0) {
      throw new AppError("Invalid booking amount", 400);
    }

    // 2. Atomically deduct balance — the $gte filter prevents balance going negative
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, walletBalance: { $gte: amountToPay } },
      { $inc: { walletBalance: -amountToPay } },
      { new: true, session }
    );

    if (!updatedUser) {
      throw new AppError("Insufficient wallet balance", 400);
    }

    // 3. Create immutable transaction record
    await WalletTransaction.create(
      [
        {
          user_id: userId,
          amount: -amountToPay,
          type: "payment",
          reference_id: booking._id,
          balance_before: updatedUser.walletBalance + amountToPay,
          balance_after: updatedUser.walletBalance,
          description: `Payment for booking ${booking._id}`,
          status: "completed",
        },
      ],
      { session }
    );

    // 4. Create Payment record
    await Payment.create(
      [
        {
          booking_id: booking._id,
          renter_id: userId,
          owner_id: booking.owner_id,
          amount: amountToPay,
          currency: "INR",
          paymentMethod: "wallet",
          paymentStatus: "success",
          paidAt: new Date(),
        },
      ],
      { session }
    );

    // 5. Update Booking status
    booking.payment_status = "paid";
    booking.booking_status = "confirmed";
    await booking.save({ session });

    // 6. Credit owner's wallet with their earnings
    const ownerEarning = booking.pricing.ownerEarning;

    if (ownerEarning > 0) {
      const ownerBefore = await User.findById(booking.owner_id).select("walletBalance").session(session);
      const ownerBalanceBefore = ownerBefore?.walletBalance ?? 0;

      await User.findOneAndUpdate(
        { _id: booking.owner_id },
        { $inc: { walletBalance: ownerEarning } },
        { session }
      );

      // Create transaction record for the owner
      await WalletTransaction.create(
        [
          {
            user_id: booking.owner_id,
            amount: ownerEarning,
            type: "topup",
            reference_id: booking._id,
            balance_before: ownerBalanceBefore,
            balance_after: ownerBalanceBefore + ownerEarning,
            description: `Earning from booking ${booking._id}`,
            status: "completed",
          },
        ],
        { session }
      );
    }

    // 7. Commit
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Payment successful via Wallet",
      balance: updatedUser.walletBalance,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
