import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import User from "../models/User.js";

// ============================================================
// Protect routes
// ============================================================
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Get token
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Get user from PostgreSQL
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // Attach authenticated user to request
      req.user = user;

      next();
    } catch (error) {
      console.error("Authentication error:", error.message);

      res.status(401);

      throw new Error(
        "Not authorized, token invalid or expired"
      );
    }
  } else {
    res.status(401);

    throw new Error(
      "Not authorized, no token provided"
    );
  }
});

// ============================================================
// Admin middleware
// ============================================================
export const admin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    return next();
  }

  res.status(403);

  throw new Error(
    "Not authorized as an admin"
  );
};