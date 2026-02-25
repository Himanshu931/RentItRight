import { Router } from "express";
import { exploreItems, exploreItem } from "../controllers/explore.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "65fd2a9b9a1e3c2b7d4f1234"
 *         title:
 *           type: string
 *           example: "Canon Camera"
 *         image:
 *           type: string
 *           example: "https://cdn.example.com/image.jpg"
 *         dailyPrice:
 *           type: number
 *           example: 499
 *         category:
 *           type: string
 *           example: "Electronics"
 *         discount:
 *           type: number
 *           nullable: true
 *           example: 10
 *         rating:
 *           type: number
 *           example: 4.5
 */

/**
 * @swagger
 * /explore:
 *   get:
 *     summary: Get all items
 *     tags: [Explore]
 *     responses:
 *       200:
 *         description: Items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
router.get("/", exploreItems);

/**
 * @swagger
 * components:
 *   schemas:
 *     Owner:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "65fd2a9b9a1e3c2b7d4f9999"
 *         name:
 *           type: string
 *           example: "Rahul Singh"
 *         image:
 *           type: string
 *           nullable: true
 *           example: "https://cdn.app.com/profile.jpg"
 *
 *     ItemDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         location:
 *           type: string
 *         category:
 *           type: string
 *         rating:
 *           type: number
 *           example: 4.5
 *         price:
 *           type: number
 *           example: 499
 *         unavailableDates:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *         owner:
 *           $ref: '#/components/schemas/Owner'
 */

/**
 * @swagger
 * /explore/{id}:
 *   get:
 *     summary: Get item by id
 *     tags: [Explore]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "65fd2a9b9a1e3c2b7d4f1234"
 *     responses:
 *       200:
 *         description: Item fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemDetail'
 */
router.get("/:id", exploreItem);

export default router;