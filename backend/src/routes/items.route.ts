import { Router } from "express";
import { getItemsByUser, pauseItem, deleteItem, updateItem, addItem } from "../controllers/items.controller";
import { VerifyUser } from "../middleware/verifyUser";
const router = Router();


//get all the items listed by an user
router.get("/", VerifyUser, getItemsByUser)

//add single element
router.post("/", VerifyUser, addItem)

router.patch("/:id", VerifyUser, updateItem)

router.patch("/:id/pause", VerifyUser, pauseItem)

router.delete("/:id/delete", VerifyUser, deleteItem)

export default router;

