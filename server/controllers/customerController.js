// controllers/customerController.js

import asyncHandler from "express-async-handler";

import User from "../models/User.js";
import Address from "../models/Address.js";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getId = (value) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
};

const handleError = (res, error, message = "Something went wrong") => {
  console.error(error);

  // PostgreSQL foreign-key violation
  if (error.code === "23503") {
    return res.status(400).json({
      message: "Invalid related resource",
    });
  }

  // PostgreSQL unique violation
  if (error.code === "23505") {
    return res.status(400).json({
      message: "Resource already exists",
    });
  }

  return res.status(500).json({
    message,
    error: error.message,
  });
};

// ─────────────────────────────────────────────
// CUSTOMER PROFILE
// ─────────────────────────────────────────────

// @desc    Get customer profile
// @route   GET /api/customer/profile
// @access  Private
export const getCustomerProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    handleError(res, error, "Failed to fetch customer profile");
  }
});

// @desc    Update customer profile
// @route   PUT /api/customer/profile
// @access  Private
export const updateCustomerProfile = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    address = {},
  } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const updatedUser = await User.update(req.user.id, {
      name,
      email,
      address,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    handleError(res, error, "Failed to update customer profile");
  }
});

// ─────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────

// @desc    Get customer's addresses
// @route   GET /api/customer/addresses
// @access  Private
export const getAddresses = asyncHandler(async (req, res) => {
  try {
    const addresses = await Address.findByUserId(req.user.id);

    res.status(200).json(addresses);
  } catch (error) {
    handleError(res, error, "Failed to fetch addresses");
  }
});

// @desc    Get address by ID
// @route   GET /api/customer/addresses/:id
// @access  Private
export const getAddressById = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid address ID",
    });
  }

  try {
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // Ownership check
    if (address.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this address",
      });
    }

    res.status(200).json(address);
  } catch (error) {
    handleError(res, error, "Failed to fetch address");
  }
});

// @desc    Create customer address
// @route   POST /api/customer/addresses
// @access  Private
export const createAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    line1,
    line2,
    city,
    region,
    postalCode,
    country,
    phone,
    isDefault = false,
  } = req.body;

  if (!fullName || !line1 || !city || !country) {
    return res.status(400).json({
      message: "Full name, address line, city and country are required",
    });
  }

  try {
    const address = await Address.create({
      userId: req.user.id,
      fullName,
      line1,
      line2,
      city,
      region,
      postalCode,
      country,
      phone,
      isDefault,
    });

    res.status(201).json(address);
  } catch (error) {
    handleError(res, error, "Failed to create address");
  }
});

// @desc    Update customer address
// @route   PUT /api/customer/addresses/:id
// @access  Private
export const updateAddress = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid address ID",
    });
  }

  try {
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (address.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this address",
      });
    }

    const updatedAddress = await Address.update(id, req.body);

    res.status(200).json(updatedAddress);
  } catch (error) {
    handleError(res, error, "Failed to update address");
  }
});

// @desc    Delete customer address
// @route   DELETE /api/customer/addresses/:id
// @access  Private
export const deleteAddress = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid address ID",
    });
  }

  try {
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (address.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this address",
      });
    }

    await Address.delete(id);

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Failed to delete address");
  }
});

// @desc    Set address as default
// @route   PUT /api/customer/addresses/:id/default
// @access  Private
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid address ID",
    });
  }

  try {
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (address.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to modify this address",
      });
    }

    const updatedAddress = await Address.setDefault(
      id,
      req.user.id
    );

    res.status(200).json(updatedAddress);
  } catch (error) {
    handleError(res, error, "Failed to set default address");
  }
});

export default {
  getCustomerProfile,
  updateCustomerProfile,
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};