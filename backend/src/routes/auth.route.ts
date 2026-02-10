import { Router } from "express";
import { login, logout, register, sendOTP, verifyOTP } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login)
router.post("/logout", logout)
export default router;