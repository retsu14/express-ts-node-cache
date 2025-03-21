import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../handler/item-handler";
import protect from "../middlewares/auth-middleware";
const router = Router();

router.get("/", protect, getItems);
router.get("/:id", protect, getItemById);
router.post("/create", createItem);
router.put("/update/:id", protect, updateItem);
router.delete("/delete/:id", protect, deleteItem);

module.exports = router;
