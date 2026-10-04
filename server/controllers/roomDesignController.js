import asyncHandler from "express-async-handler";

import RoomDesign from "../models/RoomDesign.js";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getId = (value) => {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : null;
};

const handleError = (
  res,
  error,
  message = "Something went wrong"
) => {
  console.error(error);

  // Foreign-key violation
  if (error.code === "23503") {
    return res.status(400).json({
      message: "Invalid related resource",
    });
  }

  // Unique constraint violation
  if (error.code === "23505") {
    return res.status(400).json({
      message: "Resource already exists",
    });
  }

  // Check constraint violation
  if (error.code === "23514") {
    return res.status(400).json({
      message: "Invalid room design value",
    });
  }

  return res.status(500).json({
    message,
    error: error.message,
  });
};

// ─────────────────────────────────────────────
// ROOM DESIGNS
// ─────────────────────────────────────────────

// @desc    Get user's room designs
// @route   GET /api/room-designs
// @access  Private
export const getRoomDesigns = asyncHandler(async (req, res) => {
  try {
    const designs = await RoomDesign.findByUserId(req.user.id);

    res.status(200).json(designs);
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to fetch room designs"
    );
  }
});

// @desc    Get room design by ID
// @route   GET /api/room-designs/:id
// @access  Private
export const getRoomDesignById = asyncHandler(
  async (req, res) => {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid room design ID",
      });
    }

    try {
      const design = await RoomDesign.findWithItems(id);

      if (!design) {
        return res.status(404).json({
          message: "Room design not found",
        });
      }

      if (
        design.user_id !== req.user.id &&
        !req.user.is_admin
      ) {
        return res.status(403).json({
          message:
            "Not authorized to access this room design",
        });
      }

      res.status(200).json(design);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to fetch room design"
      );
    }
  }
);

// @desc    Create room design
// @route   POST /api/room-designs
// @access  Private
export const createRoomDesign = asyncHandler(
  async (req, res) => {
    const {
      name,
      roomType,
      width,
      height,
      depth,
      backgroundImage,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Room design name is required",
      });
    }

    try {
      const design = await RoomDesign.create({
        userId: req.user.id,
        name: name.trim(),
        roomType,
        width,
        height,
        depth,
        backgroundImage,
      });

      res.status(201).json(design);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to create room design"
      );
    }
  }
);

// @desc    Update room design
// @route   PUT /api/room-designs/:id
// @access  Private
export const updateRoomDesign = asyncHandler(
  async (req, res) => {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid room design ID",
      });
    }

    try {
      const design = await RoomDesign.findById(id);

      if (!design) {
        return res.status(404).json({
          message: "Room design not found",
        });
      }

      if (
        design.user_id !== req.user.id &&
        !req.user.is_admin
      ) {
        return res.status(403).json({
          message:
            "Not authorized to update this room design",
        });
      }

      const updatedDesign = await RoomDesign.update(
        id,
        req.body
      );

      res.status(200).json(updatedDesign);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to update room design"
      );
    }
  }
);

// @desc    Delete room design
// @route   DELETE /api/room-designs/:id
// @access  Private
export const deleteRoomDesign = asyncHandler(
  async (req, res) => {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid room design ID",
      });
    }

    try {
      const design = await RoomDesign.findById(id);

      if (!design) {
        return res.status(404).json({
          message: "Room design not found",
        });
      }

      if (
        design.user_id !== req.user.id &&
        !req.user.is_admin
      ) {
        return res.status(403).json({
          message:
            "Not authorized to delete this room design",
        });
      }

      await RoomDesign.delete(id);

      res.status(200).json({
        message: "Room design deleted successfully",
      });
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to delete room design"
      );
    }
  }
);

// ─────────────────────────────────────────────
// ROOM DESIGN ITEMS
// ─────────────────────────────────────────────

// @desc    Get items in room design
// @route   GET /api/room-designs/:designId/items
// @access  Private
export const getRoomDesignItems = asyncHandler(
  async (req, res) => {
    const designId = getId(req.params.designId);

    if (!designId) {
      return res.status(400).json({
        message: "Invalid room design ID",
      });
    }

    try {
      const design = await RoomDesign.findById(designId);

      if (!design) {
        return res.status(404).json({
          message: "Room design not found",
        });
      }

      if (
        design.user_id !== req.user.id &&
        !req.user.is_admin
      ) {
        return res.status(403).json({
          message:
            "Not authorized to access this room design",
        });
      }

      const items =
        await RoomDesign.findItems(designId);

      res.status(200).json(items);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to fetch room design items"
      );
    }
  }
);

// @desc    Add item to room design
// @route   POST /api/room-designs/:designId/items
// @access  Private
export const addRoomDesignItem = asyncHandler(
  async (req, res) => {
    const designId = getId(req.params.designId);

    if (!designId) {
      return res.status(400).json({
        message: "Invalid room design ID",
      });
    }

    const {
      productVariantId,
      positionX = 0,
      positionY = 0,
      positionZ = 0,
      rotationX = 0,
      rotationY = 0,
      rotationZ = 0,
      scaleX = 1,
      scaleY = 1,
      scaleZ = 1,
    } = req.body;

    const variantId = getId(productVariantId);

    if (!variantId) {
      return res.status(400).json({
        message: "Valid product variant ID is required",
      });
    }

    try {
      const design = await RoomDesign.findById(designId);

      if (!design) {
        return res.status(404).json({
          message: "Room design not found",
        });
      }

      if (design.user_id !== req.user.id) {
        return res.status(403).json({
          message:
            "Not authorized to modify this room design",
        });
      }

      const item = await RoomDesign.addItem({
        roomDesignId: designId,
        productVariantId: variantId,
        positionX,
        positionY,
        positionZ,
        rotationX,
        rotationY,
        rotationZ,
        scaleX,
        scaleY,
        scaleZ,
      });

      res.status(201).json(item);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to add item to room design"
      );
    }
  }
);

// @desc    Get room design item
// @route   GET /api/room-designs/items/:itemId
// @access  Private
export const getRoomDesignItem = asyncHandler(
  async (req, res) => {
    const itemId = getId(req.params.itemId);

    if (!itemId) {
      return res.status(400).json({
        message: "Invalid room design item ID",
      });
    }

    try {
      const item = await RoomDesign.findItem(itemId);

      if (!item) {
        return res.status(404).json({
          message: "Room design item not found",
        });
      }

      const design = await RoomDesign.findById(
        item.room_design_id
      );

      if (
        !design ||
        (design.user_id !== req.user.id &&
          !req.user.is_admin)
      ) {
        return res.status(403).json({
          message:
            "Not authorized to access this room design item",
        });
      }

      res.status(200).json(item);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to fetch room design item"
      );
    }
  }
);

// @desc    Update room design item
// @route   PUT /api/room-designs/items/:itemId
// @access  Private
export const updateRoomDesignItem = asyncHandler(
  async (req, res) => {
    const itemId = getId(req.params.itemId);

    if (!itemId) {
      return res.status(400).json({
        message: "Invalid room design item ID",
      });
    }

    try {
      const item = await RoomDesign.findItem(itemId);

      if (!item) {
        return res.status(404).json({
          message: "Room design item not found",
        });
      }

      const design = await RoomDesign.findById(
        item.room_design_id
      );

      if (
        !design ||
        (design.user_id !== req.user.id &&
          !req.user.is_admin)
      ) {
        return res.status(403).json({
          message:
            "Not authorized to update this room design item",
        });
      }

      const updatedItem =
        await RoomDesign.updateItem(
          itemId,
          req.body
        );

      res.status(200).json(updatedItem);
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to update room design item"
      );
    }
  }
);

// @desc    Remove item from room design
// @route   DELETE /api/room-designs/items/:itemId
// @access  Private
export const removeRoomDesignItem = asyncHandler(
  async (req, res) => {
    const itemId = getId(req.params.itemId);

    if (!itemId) {
      return res.status(400).json({
        message: "Invalid room design item ID",
      });
    }

    try {
      const item = await RoomDesign.findItem(itemId);

      if (!item) {
        return res.status(404).json({
          message: "Room design item not found",
        });
      }

      const design = await RoomDesign.findById(
        item.room_design_id
      );

      if (
        !design ||
        (design.user_id !== req.user.id &&
          !req.user.is_admin)
      ) {
        return res.status(403).json({
          message:
            "Not authorized to remove this room design item",
        });
      }

      await RoomDesign.removeItem(itemId);

      res.status(200).json({
        message: "Item removed from room design",
      });
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to remove room design item"
      );
    }
  }
);

// @desc    Clear room design items
// @route   DELETE /api/room-designs/:designId/items
// @access  Private
export const clearRoomDesign = asyncHandler(
  async (req, res) => {
    const designId = getId(req.params.designId);

    if (!designId) {
      return res.status(400).json({
        message: "Invalid room design ID",
      });
    }

    try {
      const design = await RoomDesign.findById(designId);

      if (!design) {
        return res.status(404).json({
          message: "Room design not found",
        });
      }

      if (design.user_id !== req.user.id) {
        return res.status(403).json({
          message:
            "Not authorized to modify this room design",
        });
      }

      await RoomDesign.clearItems(designId);

      res.status(200).json({
        message: "Room design cleared successfully",
      });
    } catch (error) {
      handleError(
        res,
        error,
        "Failed to clear room design"
      );
    }
  }
);