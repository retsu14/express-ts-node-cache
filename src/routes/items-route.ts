import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../handler/item-handler";
const router = Router();

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/create", createItem);
router.put("/update/:id", updateItem);
router.delete("/delete/:id", deleteItem);

module.exports = router;
