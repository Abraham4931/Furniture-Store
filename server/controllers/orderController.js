// controllers/orderController.js

import asyncHandler from "express-async-handler";

import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Shipment from "../models/Shipment.js";

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
// ORDERS
// ─────────────────────────────────────────────

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);

    res.status(200).json(orders);
  } catch (error) {
    handleError(res, error, "Failed to fetch orders");
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findWithItems(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Admin can access any order
    if (!req.user.is_admin && order.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    handleError(res, error, "Failed to fetch order");
  }
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingPrice = 0,
    taxPrice = 0,
    totalPrice,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Order must contain at least one item",
    });
  }

  if (!shippingAddress) {
    return res.status(400).json({
      message: "Shipping address is required",
    });
  }

  try {
    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    handleError(res, error, "Failed to create order");
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  if (!status) {
    return res.status(400).json({
      message: "Order status is required",
    });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const updatedOrder = await Order.updateStatus(id, status);

    res.status(200).json(updatedOrder);
  } catch (error) {
    handleError(res, error, "Failed to update order status");
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const id = getId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!req.user.is_admin && order.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to cancel this order",
      });
    }

    const updatedOrder = await Order.updateStatus(id, "cancelled");

    res.status(200).json(updatedOrder);
  } catch (error) {
    handleError(res, error, "Failed to cancel order");
  }
});

// ─────────────────────────────────────────────
// ORDER ITEMS
// ─────────────────────────────────────────────

// @desc    Get order items
// @route   GET /api/orders/:orderId/items
// @access  Private
export const getOrderItems = asyncHandler(async (req, res) => {
  const orderId = getId(req.params.orderId);

  if (!orderId) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!req.user.is_admin && order.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this order",
      });
    }

    const items = await Order.findItems(orderId);

    res.status(200).json(items);
  } catch (error) {
    handleError(res, error, "Failed to fetch order items");
  }
});

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────

// @desc    Get payment for order
// @route   GET /api/orders/:orderId/payment
// @access  Private
export const getPayment = asyncHandler(async (req, res) => {
  const orderId = getId(req.params.orderId);

  if (!orderId) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!req.user.is_admin && order.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this payment",
      });
    }

    const payment = await Payment.findByOrderId(orderId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json(payment);
  } catch (error) {
    handleError(res, error, "Failed to fetch payment");
  }
});

// @desc    Create payment
// @route   POST /api/orders/:orderId/payment
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  const orderId = getId(req.params.orderId);

  if (!orderId) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  const {
    paymentMethod,
    amount,
    transactionId,
  } = req.body;

  if (!paymentMethod) {
    return res.status(400).json({
      message: "Payment method is required",
    });
  }

  if (amount === undefined || amount === null) {
    return res.status(400).json({
      message: "Payment amount is required",
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!req.user.is_admin && order.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to make payment for this order",
      });
    }

    const existingPayment = await Payment.findByOrderId(orderId);

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already exists for this order",
      });
    }

    const payment = await Payment.create({
      orderId,
      paymentMethod,
      amount,
      transactionId,
    });

    res.status(201).json(payment);
  } catch (error) {
    handleError(res, error, "Failed to create payment");
  }
});

// @desc    Update payment status
// @route   PUT /api/orders/:orderId/payment
// @access  Private/Admin
export const updatePayment = asyncHandler(async (req, res) => {
  const orderId = getId(req.params.orderId);

  if (!orderId) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  const {
    status,
    transactionId,
  } = req.body;

  try {
    const payment = await Payment.findByOrderId(orderId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const updatedPayment = await Payment.update(payment.id, {
      status,
      transactionId,
    });

    res.status(200).json(updatedPayment);
  } catch (error) {
    handleError(res, error, "Failed to update payment");
  }
});

// ─────────────────────────────────────────────
// SHIPMENTS
// ─────────────────────────────────────────────

// @desc    Get shipment for order
// @route   GET /api/orders/:orderId/shipment
// @access  Private
export const getShipment = asyncHandler(async (req, res) => {
  const orderId = getId(req.params.orderId);

  if (!orderId) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!req.user.is_admin && order.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to access this shipment",
      });
    }

    const shipment = await Shipment.findByOrderId(orderId);

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    res.status(200).json(shipment);
  } catch (error) {
    handleError(res, error, "Failed to fetch shipment");
  }
});

// @desc    Create shipment
// @route   POST /api/orders/:orderId/shipment
// @access  Private/Admin
export const createShipment = asyncHandler(async (req, res) => {
  const orderId = getId(req.params.orderId);

  if (!orderId) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  const {
    carrier,
    trackingNumber,
    shippingAddress,
    estimatedDelivery,
  } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const existingShipment = await Shipment.findByOrderId(orderId);

    if (existingShipment) {
      return res.status(400).json({
        message: "Shipment already exists for this order",
      });
    }

    const shipment = await Shipment.create({
      orderId,
      carrier,
      trackingNumber,
      shippingAddress,
      estimatedDelivery,
    });

    res.status(201).json(shipment);
  } catch (error) {
    handleError(res, error, "Failed to create shipment");
  }
});

// @desc    Update shipment
// @route   PUT /api/orders/:orderId/shipment
// @access  Private/Admin
export const updateShipment = asyncHandler(async (req, res) => {
  const orderId = getId(req.params.orderId);

  if (!orderId) {
    return res.status(400).json({
      message: "Invalid order ID",
    });
  }

  try {
    const shipment = await Shipment.findByOrderId(orderId);

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    const updatedShipment = await Shipment.update(
      shipment.id,
      req.body
    );

    res.status(200).json(updatedShipment);
  } catch (error) {
    handleError(res, error, "Failed to update shipment");
  }
});