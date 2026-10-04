// controllers/wishlistController.js

import asyncHandler from "express-async-handler";
import Wishlist from "../models/Wishlist.js";

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
// WISHLISTS
// ─────────────────────────────────────────────

// @desc    Get user's wishlists
// @route   GET /api/wishlist
// @access  Private
export const getWishlists = asyncHandler(async (req, res) => {
  try {
    const wishlists = await Wishlist.findByUserId(req.user.id);

    res.status(200).json(wishlists);
  } catch (error) {
    handleError(res, error, "Failed to fetch wishlists");
  }
});

// @desc    Get default wishlist
// @route   GET /api/wishlist/default
// @access  Private
export const getDefaultWishlist = asyncHandler(async (req, res) => {
  try {
    const wishlist = await Wishlist.findDefaultByUserId(req.user.id);

    if (!wishlist) {
      return res.status(404).json({
        message: "Default wishlist not found",
      });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    handleError(res, error, "Failed to fetch default wishlist");
  }
});

// @desc    Get wishlist by ID
// @route   GET /api/wishlist/:id
// @access  Private
export const getWishlistById = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid wishlist ID",
    });
  }

  try {
    const wishlist = await Wishlist.findWithItems(id);

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    // Ownership check
    if (wishlist.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this wishlist",
      });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    handleError(res, error, "Failed to fetch wishlist");
  }
});

// @desc    Create wishlist
// @route   POST /api/wishlist
// @access  Private
export const createWishlist = asyncHandler(async (req, res) => {
  const { name, isDefault = false } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      message: "Wishlist name is required",
    });
  }

  try {
    const wishlist = await Wishlist.create({
      userId: req.user.id,
      name: name.trim(),
      isDefault,
    });

    res.status(201).json(wishlist);
  } catch (error) {
    handleError(res, error, "Failed to create wishlist");
  }
});

// @desc    Update wishlist
// @route   PUT /api/wishlist/:id
// @access  Private
export const updateWishlist = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid wishlist ID",
    });
  }

  try {
    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    if (wishlist.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this wishlist",
      });
    }

    const updatedWishlist = await Wishlist.update(id, {
      name: req.body.name,
      isDefault: req.body.isDefault,
    });

    res.status(200).json(updatedWishlist);
  } catch (error) {
    handleError(res, error, "Failed to update wishlist");
  }
});

// @desc    Delete wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
export const deleteWishlist = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid wishlist ID",
    });
  }

  try {
    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    if (wishlist.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this wishlist",
      });
    }

    // Optional protection for the default wishlist
    if (wishlist.is_default) {
      return res.status(400).json({
        message: "Default wishlist cannot be deleted",
      });
    }

    await Wishlist.delete(id);

    res.status(200).json({
      message: "Wishlist deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Failed to delete wishlist");
  }
});

// ─────────────────────────────────────────────
// WISHLIST ITEMS
// ─────────────────────────────────────────────

// @desc    Add product variant to wishlist
// @route   POST /api/wishlist/items
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { wishlistId, productVariantId, quantity } = req.body;

  const parsedWishlistId = getId(wishlistId);
  const parsedProductVariantId = getId(productVariantId);

  if (!parsedWishlistId) {
    return res.status(400).json({
      message: "Valid wishlist ID is required",
    });
  }

  if (!parsedProductVariantId) {
    return res.status(400).json({
      message: "Valid product variant ID is required",
    });
  }

  try {
    const wishlist = await Wishlist.findById(parsedWishlistId);

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    if (wishlist.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to modify this wishlist",
      });
    }

    const item = await Wishlist.addItem({
      wishlistId: parsedWishlistId,
      productVariantId: parsedProductVariantId,
      quantity: quantity || 1,
    });

    res.status(201).json(item);
  } catch (error) {
    handleError(res, error, "Failed to add item to wishlist");
  }
});

// @desc    Get wishlist item
// @route   GET /api/wishlist/items/:itemId
// @access  Private
export const getWishlistItem = asyncHandler(async (req, res) => {
  const itemId = getId(req.params.itemId);

  if (!itemId) {
    return res.status(400).json({
      message: "Invalid wishlist item ID",
    });
  }

  try {
    const item = await Wishlist.findItem(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    const wishlist = await Wishlist.findById(item.wishlist_id);

    if (!wishlist || wishlist.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this wishlist item",
      });
    }

    res.status(200).json(item);
  } catch (error) {
    handleError(res, error, "Failed to fetch wishlist item");
  }
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/items/:itemId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const itemId = getId(req.params.itemId);

  if (!itemId) {
    return res.status(400).json({
      message: "Invalid wishlist item ID",
    });
  }

  try {
    const item = await Wishlist.findItem(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    const wishlist = await Wishlist.findById(item.wishlist_id);

    if (!wishlist || wishlist.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to modify this wishlist item",
      });
    }

    await Wishlist.removeItem(itemId);

    res.status(200).json({
      message: "Item removed from wishlist",
    });
  } catch (error) {
    handleError(res, error, "Failed to remove wishlist item");
  }
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist/:id/clear
// @access  Private
export const clearWishlist = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid wishlist ID",
    });
  }

  try {
    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    if (wishlist.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to modify this wishlist",
      });
    }

    await Wishlist.clear(id);

    res.status(200).json({
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    handleError(res, error, "Failed to clear wishlist");
  }
});