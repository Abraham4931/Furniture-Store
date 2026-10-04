import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";

import authRoutes from "./routes/authRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import roomDesignRoutes from "./routes/roomDesignRoutes.js";

dotenv.config();

const app = express();

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

app.use("/api/auth", authRoutes);

app.use("/api/catalog", catalogRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/customer", customerRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/room-designs", roomDesignRoutes);

// ─────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();