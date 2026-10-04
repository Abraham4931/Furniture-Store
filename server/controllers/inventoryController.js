// controllers/inventoryController.js

import asyncHandler from "express-async-handler";
import Inventory from "../models/Inventory.js";

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
      message: "Inventory record already exists",
    });
  }

  // PostgreSQL check constraint violation
  if (error.code === "23514") {
    return res.status(400).json({
      message: "Invalid inventory value",
    });
  }

  return res.status(500).json({
    message,
    error: error.message,
  });
};

// ─────────────────────────────────────────────
// GET INVENTORY
// ─────────────────────────────────────────────

// @desc    Get all inventory
// @route   GET /api/inventory
// @access  Private/Admin
export const getInventory = asyncHandler(async (req, res) => {
  try {
    const inventory = await Inventory.findAll();

    res.status(200).json(inventory);
  } catch (error) {
    handleError(res, error, "Failed to fetch inventory");
  }
});

// @desc    Get inventory by ID
// @route   GET /api/inventory/:id
// @access  Private/Admin
export const getInventoryById = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid inventory ID",
    });
  }

  try {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    res.status(200).json(inventory);
  } catch (error) {
    handleError(res, error, "Failed to fetch inventory");
  }
});

// @desc    Get inventory for a product variant
// @route   GET /api/inventory/variant/:variantId
// @access  Private/Admin
export const getInventoryByVariant = asyncHandler(
  async (req, res) => {
    const variantId = getId(req.params.variantId);

    if (!variantId) {
      return res.status(400).json({
        message: "Invalid product variant ID",
      });
    }

    try {
      const inventory = await Inventory.findByVariantId(variantId);

      if (!inventory) {
        return res.status(404).json({
          message: "Inventory record not found",
        });
      }

      res.status(200).json(inventory);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to fetch variant inventory"
      );
    }
  }
);

// ─────────────────────────────────────────────
// CREATE INVENTORY
// ─────────────────────────────────────────────

// @desc    Create inventory record
// @route   POST /api/inventory
// @access  Private/Admin
export const createInventory = asyncHandler(async (req, res) => {
  const {
    productVariantId,
    quantity = 0,
    reservedQuantity = 0,
    reorderLevel = 0,
  } = req.body;

  const variantId = getId(productVariantId);

  if (!variantId) {
    return res.status(400).json({
      message: "Valid product variant ID is required",
    });
  }

  if (quantity < 0) {
    return res.status(400).json({
      message: "Quantity cannot be negative",
    });
  }

  if (reservedQuantity < 0) {
    return res.status(400).json({
      message: "Reserved quantity cannot be negative",
    });
  }

  if (reservedQuantity > quantity) {
    return res.status(400).json({
      message: "Reserved quantity cannot exceed stock quantity",
    });
  }

  try {
    const existingInventory =
      await Inventory.findByVariantId(variantId);

    if (existingInventory) {
      return res.status(400).json({
        message: "Inventory already exists for this product variant",
      });
    }

    const inventory = await Inventory.create({
      productVariantId: variantId,
      quantity,
      reservedQuantity,
      reorderLevel,
    });

    res.status(201).json(inventory);
  } catch (error) {
    handleError(res, error, "Failed to create inventory");
  }
});

// ─────────────────────────────────────────────
// UPDATE INVENTORY
// ─────────────────────────────────────────────

// @desc    Update inventory record
// @route   PUT /api/inventory/:id
// @access  Private/Admin
export const updateInventory = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid inventory ID",
    });
  }

  const {
    quantity,
    reservedQuantity,
    reorderLevel,
  } = req.body;

  try {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    const newQuantity =
      quantity !== undefined
        ? Number(quantity)
        : Number(inventory.quantity);

    const newReservedQuantity =
      reservedQuantity !== undefined
        ? Number(reservedQuantity)
        : Number(inventory.reserved_quantity);

    if (newQuantity < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    if (newReservedQuantity < 0) {
      return res.status(400).json({
        message: "Reserved quantity cannot be negative",
      });
    }

    if (newReservedQuantity > newQuantity) {
      return res.status(400).json({
        message: "Reserved quantity cannot exceed stock quantity",
      });
    }

    const updatedInventory = await Inventory.update(id, {
      quantity: newQuantity,
      reservedQuantity: newReservedQuantity,
      reorderLevel,
    });

    res.status(200).json(updatedInventory);
  } catch (error) {
    handleError(res, error, "Failed to update inventory");
  }
});

// ─────────────────────────────────────────────
// STOCK OPERATIONS
// ─────────────────────────────────────────────

// @desc    Add stock
// @route   PUT /api/inventory/:id/add
// @access  Private/Admin
export const addStock = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);
  const quantity = Number(req.body.quantity);

  if (!id) {
    return res.status(400).json({
      message: "Invalid inventory ID",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  try {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    const updatedInventory = await Inventory.addStock(
      id,
      quantity
    );

    res.status(200).json(updatedInventory);
  } catch (error) {
    handleError(res, error, "Failed to add stock");
  }
});

// @desc    Remove stock
// @route   PUT /api/inventory/:id/remove
// @access  Private/Admin
export const removeStock = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);
  const quantity = Number(req.body.quantity);

  if (!id) {
    return res.status(400).json({
      message: "Invalid inventory ID",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  try {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    const availableStock =
      Number(inventory.quantity) -
      Number(inventory.reserved_quantity);

    if (quantity > availableStock) {
      return res.status(400).json({
        message: "Cannot remove more than available stock",
      });
    }

    const updatedInventory = await Inventory.removeStock(
      id,
      quantity
    );

    res.status(200).json(updatedInventory);
  } catch (error) {
    handleError(res, error, "Failed to remove stock");
  }
});

// ─────────────────────────────────────────────
// RESERVATIONS
// ─────────────────────────────────────────────

// @desc    Reserve stock
// @route   PUT /api/inventory/:id/reserve
// @access  Private/Admin
export const reserveStock = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);
  const quantity = Number(req.body.quantity);

  if (!id) {
    return res.status(400).json({
      message: "Invalid inventory ID",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  try {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    const availableStock =
      Number(inventory.quantity) -
      Number(inventory.reserved_quantity);

    if (quantity > availableStock) {
      return res.status(400).json({
        message: "Not enough available stock to reserve",
      });
    }

    const updatedInventory = await Inventory.reserveStock(
      id,
      quantity
    );

    res.status(200).json(updatedInventory);
  } catch (error) {
    handleError(res, error, "Failed to reserve stock");
  }
});

// @desc    Release reserved stock
// @route   PUT /api/inventory/:id/release
// @access  Private/Admin
export const releaseStock = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);
  const quantity = Number(req.body.quantity);

  if (!id) {
    return res.status(400).json({
      message: "Invalid inventory ID",
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      message: "Quantity must be a positive integer",
    });
  }

  try {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    if (quantity > Number(inventory.reserved_quantity)) {
      return res.status(400).json({
        message:
          "Cannot release more than the reserved quantity",
      });
    }

    const updatedInventory =
      await Inventory.releaseStock(id, quantity);

    res.status(200).json(updatedInventory);
  } catch (error) {
    handleError(res, error, "Failed to release reserved stock");
  }
});

// ─────────────────────────────────────────────
// LOW STOCK
// ─────────────────────────────────────────────

// @desc    Get low-stock inventory
// @route   GET /api/inventory/low-stock
// @access  Private/Admin
export const getLowStock = asyncHandler(async (req, res) => {
  try {
    const inventory = await Inventory.findLowStock();

    res.status(200).json(inventory);
  } catch (error) {
    handleError(res, error, "Failed to fetch low-stock inventory");
  }
});

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

// @desc    Delete inventory record
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
export const deleteInventory = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid inventory ID",
    });
  }

  try {
    const inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory record not found",
      });
    }

    await Inventory.delete(id);

    res.status(200).json({
      message: "Inventory deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Failed to delete inventory");
  }
});

export default {
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
};