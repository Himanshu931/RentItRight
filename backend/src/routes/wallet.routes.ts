import express from "express";
import {
  getWalletBalance,
  getWalletTransactions,
  createRazorpayOrder,
  verifyRazorpayPayment,
  payWithWallet,
  withdrawFromWallet,
} from "../controllers/wallet.controller";
import { VerifyUser } from "../middleware/verifyUser";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiting for sensitive financial endpoints
const financialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: "Too many financial requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(VerifyUser); // All wallet routes require authentication

router.get("/balance", getWalletBalance);
router.get("/transactions", getWalletTransactions);

// Apply rate limiting to endpoints that change balance
router.post("/create-razorpay-order", financialLimiter, createRazorpayOrder);
router.post("/verify-razorpay-payment", financialLimiter, verifyRazorpayPayment);
router.post("/pay", financialLimiter, payWithWallet);
router.post("/withdraw", financialLimiter, withdrawFromWallet);

export default router;
