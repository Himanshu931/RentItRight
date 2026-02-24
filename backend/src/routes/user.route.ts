import { Router } from "express";
import { VerifyUser } from "../middleware/verifyUser";
import { createProfile, getProfile } from "../controllers/user.controller"

const router = Router();

router.post("/profile", VerifyUser, createProfile)
router.get("/get-profile", VerifyUser, getProfile)


export default router;