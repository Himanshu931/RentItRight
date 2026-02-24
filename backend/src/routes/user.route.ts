import { Router } from "express";
import { VerifyUser } from "../middleware/verifyUser";
import { createProfile, getProfile, updateProfile, updateProfileImage, deleteProfile, updateAddress } from "../controllers/user.controller"

const router = Router();

/**
 * @swagger
 * /user/me/profile:
 *   post:
 *     summary: Create the Profile
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
 *              profileImage:
 *                 type: string
 *              address:{
 *                street: string,
 *                city: string,
 *                state: string,
 *                zip: string,
 *                country: string,
 *              }
 *              roles: 
 *                type: string
 *              
 *     responses:
 *       201:
 *         description: Profile created successfully
 */
router.post("/me/profile", VerifyUser, createProfile)


/**
 * @swagger
 * /user/me/profile:
 *   get:
 *     summary: Get the User's Profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Profile Fetched successfully
 */
router.get("/me/profile", VerifyUser, getProfile)

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
 *         description: Profile Updated successfully
 */
router.patch("/me/profile", VerifyUser, updateProfile)

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
 *         description: Profile Image Updated successfully
 */
router.patch("/me/avatar", VerifyUser, updateProfileImage)

/**
 * @swagger
 * /user/me/profile:
 *   delete:
 *     summary: Delete the User's Profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Profile Deleted successfully
 */
router.delete("/me/profile", VerifyUser, deleteProfile)

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
 *               address: {
 *                 street: string,
 *                 city: string,
 *                 state: string,
 *                 zip: string,
 *                 country: string,
 *               }
 *     responses:
 *       200:
 *         description: Address Updated successfully
 */
router.patch("/me/address", VerifyUser, updateAddress)


export default router;