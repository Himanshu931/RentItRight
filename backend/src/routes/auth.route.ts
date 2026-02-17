import { Router } from "express";
import {
  login,
  logout,
  me,
  register,
  sendOTP,
  verifyOTP,
} from "../controllers/auth.controller";
import { VerifyUser } from "../middleware/verifyUser";

const router = Router();

router.post("/register", register);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/me", VerifyUser, me);
router.post("/logout", VerifyUser, logout);
export default router;
