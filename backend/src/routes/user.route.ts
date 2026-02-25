import { Router } from "express";
import { VerifyUser } from "../middleware/verifyUser";
import { createProfile, getProfile, updateProfile, updateProfileImage, deleteProfile, updateAddress } from "../controllers/user.controller"

const router = Router();

/**
 * @swagger
 * /user/me/profile:
 *   post:
 *     summary: Create the User's Profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   district:
 *                     type: string
 *                   state:
 *                     type: string
 *                   pincode:
 *                     type: string
 *               roles:
 *                 type: string
 *                 enum: [renter, owner, admin]
 *     responses:
 *       201:
 *         description: Profile created successfully
 */
router.post("/me/profile", VerifyUser, createProfile);


/**
 * @swagger
 * /user/me/profile:
 *   get:
 *     summary: Get the User's Profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 */
router.get("/me/profile", VerifyUser, getProfile);


/**
 * @swagger
 * /user/me/profile:
 *   patch:
 *     summary: Update the User's Profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch("/me/profile", VerifyUser, updateProfile);


/**
 * @swagger
 * /user/me/avatar:
 *   patch:
 *     summary: Update the User's Profile Image
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 */
router.patch("/me/avatar", VerifyUser, updateProfileImage);


/**
 * @swagger
 * /user/me/profile:
 *   delete:
 *     summary: Delete the User's Profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
router.delete("/me/profile", VerifyUser, deleteProfile);


/**
 * @swagger
 * /user/me/address:
 *   patch:
 *     summary: Update the User's Address
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pincode:
 *                 type: string
 *               district:
 *                 type: string
 *               state:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.patch("/me/address", VerifyUser, updateAddress);

export default router;