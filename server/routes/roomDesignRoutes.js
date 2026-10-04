import express from "express";

import {
  getRoomDesigns,
  getRoomDesignById,
  createRoomDesign,
  updateRoomDesign,
  deleteRoomDesign,
  getRoomDesignItems,
  addRoomDesignItem,
  getRoomDesignItem,
  updateRoomDesignItem,
  removeRoomDesignItem,
  clearRoomDesign,
} from "../controllers/roomDesignController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Room designs
router.get("/", protect, getRoomDesigns);
router.post("/", protect, createRoomDesign);

router.get("/:id", protect, getRoomDesignById);
router.put("/:id", protect, updateRoomDesign);
router.delete("/:id", protect, deleteRoomDesign);

// Room design items
router.get(
  "/:designId/items",
  protect,
  getRoomDesignItems
);

router.post(
  "/:designId/items",
  protect,
  addRoomDesignItem
);

router.delete(
  "/:designId/items",
  protect,
  clearRoomDesign
);

router.get(
  "/items/:itemId",
  protect,
  getRoomDesignItem
);

router.put(
  "/items/:itemId",
  protect,
  updateRoomDesignItem
);

router.delete(
  "/items/:itemId",
  protect,
  removeRoomDesignItem
);

export default router;