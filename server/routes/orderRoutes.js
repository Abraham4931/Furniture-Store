// routes/orderRoutes.js

import express from "express";

import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderItems,
  getPayment,
  createPayment,
  updatePayment,
  getShipment,
  createShipment,
  updateShipment,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────

router.get("/", protect, getOrders);

router.post("/", protect, createOrder);

router.get("/:id", protect, getOrderById);

router.put("/:id/status", protect, admin, updateOrderStatus);

router.put("/:id/cancel", protect, cancelOrder);

// ─────────────────────────────────────────────
// Order Items
// ─────────────────────────────────────────────

router.get("/:orderId/items", protect, getOrderItems);

// ─────────────────────────────────────────────
// Payment
// ─────────────────────────────────────────────

router.get("/:orderId/payment", protect, getPayment);

router.post("/:orderId/payment", protect, createPayment);

router.put(
  "/:orderId/payment",
  protect,
  admin,
  updatePayment
);

// ─────────────────────────────────────────────
// Shipment
// ─────────────────────────────────────────────

router.get("/:orderId/shipment", protect, getShipment);

router.post(
  "/:orderId/shipment",
  protect,
  admin,
  createShipment
);

router.put(
  "/:orderId/shipment",
  protect,
  admin,
  updateShipment
);

export default router;