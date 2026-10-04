// routes/inventoryRoutes.js

import express from "express";

import {
  getInventory,
  getInventoryById,
  getInventoryByVariant,
  createInventory,
  updateInventory,
  addStock,
  removeStock,
  reserveStock,
  releaseStock,
  getLowStock,
  deleteInventory,
} from "../controllers/inventoryController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, admin);

// Important: specific routes must come before /:id
router.get("/low-stock", getLowStock);
router.get("/variant/:variantId", getInventoryByVariant);

router.get("/", getInventory);
router.post("/", createInventory);

router.get("/:id", getInventoryById);

router.put("/:id", updateInventory);

router.put("/:id/add", addStock);
router.put("/:id/remove", removeStock);

router.put("/:id/reserve", reserveStock);
router.put("/:id/release", releaseStock);

router.delete("/:id", deleteInventory);

export default router;