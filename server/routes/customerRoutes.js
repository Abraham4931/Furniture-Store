// routes/customerRoutes.js

import express from "express";

import {
  getCustomerProfile,
  updateCustomerProfile,
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/customerController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Customer profile
router.get("/profile", protect, getCustomerProfile);
router.put("/profile", protect, updateCustomerProfile);

// Addresses
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, createAddress);

router.get(
  "/addresses/:id",
  protect,
  getAddressById
);

router.put(
  "/addresses/:id",
  protect,
  updateAddress
);

router.delete(
  "/addresses/:id",
  protect,
  deleteAddress
);

router.put(
  "/addresses/:id/default",
  protect,
  setDefaultAddress
);

export default router;