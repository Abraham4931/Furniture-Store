import express from "express";

import {
  getCart,
  getUserCarts,
  getCartById,
  createCart,
  addToCart,
  getCartItem,
  updateCartItem,
  removeFromCart,
  clearCart,
  updateCartStatus,
  deleteCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// ============================================================
// Cart
// ============================================================

// Get active cart
router.get("/", protect, getCart);

// Get all user's carts
router.get("/all", protect, getUserCarts);

// Create cart
router.post("/", protect, createCart);

// ============================================================
// Cart Items
// ============================================================

// Add item
router.post("/items", protect, addToCart);

// Get item
router.get("/items/:itemId", protect, getCartItem);

// Update quantity
router.put("/items/:itemId", protect, updateCartItem);

// Remove item
router.delete("/items/:itemId", protect, removeFromCart);

// Clear cart
router.delete("/clear", protect, clearCart);

// Get specific cart
router.get("/:id", protect, getCartById);

// Update cart status
router.put("/:id/status", protect, updateCartStatus);

// Delete cart
router.delete("/:id", protect, deleteCart);

export default router;