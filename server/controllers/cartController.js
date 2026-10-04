import Cart from "../models/Cart.js";

// ============================================================
// Get the logged-in user's active cart
// GET /api/cart
// ============================================================
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findActiveByUserId(userId);

    // Create an active cart if the user doesn't have one
    if (!cart) {
      cart = await Cart.create({
        userId,
      });
    }

    const cartWithItems = await Cart.findWithItems(cart.id);

    return res.status(200).json({
      success: true,
      cart: cartWithItems,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};


// ============================================================
// Get all carts belonging to the logged-in user
// GET /api/cart/all
// ============================================================
export const getUserCarts = async (req, res) => {
  try {
    const userId = req.user.id;

    const carts = await Cart.findByUserId(userId);

    return res.status(200).json({
      success: true,
      count: carts.length,
      carts,
    });
  } catch (error) {
    console.error("Get user carts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch carts",
    });
  }
};


// ============================================================
// Get a specific cart
// GET /api/cart/:id
// ============================================================
export const getCartById = async (req, res) => {
  try {
    const cartId = Number(req.params.id);

    if (!Number.isInteger(cartId) || cartId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart ID",
      });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Users can only access their own carts
    if (Number(cart.user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this cart",
      });
    }

    const cartWithItems = await Cart.findWithItems(cartId);

    return res.status(200).json({
      success: true,
      cart: cartWithItems,
    });
  } catch (error) {
    console.error("Get cart by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};


// ============================================================
// Create a new cart
// POST /api/cart
// ============================================================
export const createCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.create({
      userId,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Cart created successfully",
      cart,
    });
  } catch (error) {
    console.error("Create cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create cart",
    });
  }
};


// ============================================================
// Add an item to cart
// POST /api/cart/items
// ============================================================
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      product_variant_id,
      quantity = 1,
      unit_price,
    } = req.body;

    // --------------------------------------------------------
    // Validation
    // --------------------------------------------------------
    if (!product_variant_id) {
      return res.status(400).json({
        success: false,
        message: "Product variant ID is required",
      });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    if (
      unit_price === undefined ||
      Number(unit_price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid unit price is required",
      });
    }

    // --------------------------------------------------------
    // Find active cart
    // --------------------------------------------------------
    let cart = await Cart.findActiveByUserId(userId);

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        userId,
        status: "active",
      });
    }

    // --------------------------------------------------------
    // Add item
    // --------------------------------------------------------
    const item = await Cart.addItem({
      cartId: cart.id,
      productVariantId: Number(product_variant_id),
      quantity: Number(quantity),
      unitPrice: Number(unit_price),
    });

    const updatedCart = await Cart.findWithItems(
      cart.id
    );

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      item,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Product variant does not exist",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};


// ============================================================
// Get a specific cart item
// GET /api/cart/items/:itemId
// ============================================================
export const getCartItem = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const item = await Cart.findItem(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Make sure the item belongs to the logged-in user
    const cart = await Cart.findById(item.cart_id);

    if (
      !cart ||
      Number(cart.user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Get cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart item",
    });
  }
};


// ============================================================
// Update cart item quantity
// PUT /api/cart/items/:itemId
// ============================================================
export const updateCartItem = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    if (
      quantity === undefined ||
      Number(quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find item
    const existingItem = await Cart.findItem(itemId);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Check ownership
    const cart = await Cart.findById(
      existingItem.cart_id
    );

    if (
      !cart ||
      Number(cart.user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const item = await Cart.updateItemQuantity(
      itemId,
      Number(quantity)
    );

    const updatedCart = await Cart.findWithItems(
      cart.id
    );

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      item,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
};


// ============================================================
// Remove item from cart
// DELETE /api/cart/items/:itemId
// ============================================================
export const removeFromCart = async (req, res) => {
  try {
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item ID",
      });
    }

    const existingItem = await Cart.findItem(itemId);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // Check ownership
    const cart = await Cart.findById(
      existingItem.cart_id
    );

    if (
      !cart ||
      Number(cart.user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Cart.removeItem(itemId);

    const updatedCart = await Cart.findWithItems(
      cart.id
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
    });
  }
};


// ============================================================
// Clear cart
// DELETE /api/cart/clear
// ============================================================
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findActiveByUserId(userId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Active cart not found",
      });
    }

    await Cart.clear(cart.id);

    const updatedCart = await Cart.findWithItems(
      cart.id
    );

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};


// ============================================================
// Update cart status
// PUT /api/cart/:id/status
// ============================================================
export const updateCartStatus = async (req, res) => {
  try {
    const cartId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "active",
      "converted",
      "abandoned",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed: active, converted, abandoned",
      });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (
      Number(cart.user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const updatedCart = await Cart.updateStatus(
      cartId,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Cart status updated",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Update cart status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart status",
    });
  }
};


// ============================================================
// Delete cart
// DELETE /api/cart/:id
// ============================================================
export const deleteCart = async (req, res) => {
  try {
    const cartId = Number(req.params.id);

    if (!Number.isInteger(cartId) || cartId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart ID",
      });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (
      Number(cart.user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const deletedCart = await Cart.delete(cartId);

    return res.status(200).json({
      success: true,
      message: "Cart deleted successfully",
      cart: deletedCart,
    });
  } catch (error) {
    console.error("Delete cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete cart",
    });
  }
};