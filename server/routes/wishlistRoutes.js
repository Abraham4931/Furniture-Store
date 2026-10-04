import express from "express";

import {
  getWishlists,
  getDefaultWishlist,
  getWishlistById,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addToWishlist,
  getWishlistItem,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// ============================================================
// Wishlist
// ============================================================

router.get("/", protect, getWishlists);

router.get("/default", protect, getDefaultWishlist);

router.post("/", protect, createWishlist);

// ============================================================
// Wishlist Items
// ============================================================

router.post("/items", protect, addToWishlist);

router.get("/items/:itemId", protect, getWishlistItem);

router.delete(
  "/items/:itemId",
  protect,
  removeFromWishlist
);

// ============================================================
// Specific Wishlist
// ============================================================

router.get("/:id", protect, getWishlistById);

router.put("/:id", protect, updateWishlist);

router.delete("/:id", protect, deleteWishlist);

router.delete(
  "/:id/clear",
  protect,
  clearWishlist
);

export default router;