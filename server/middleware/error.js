// ============================================================
// 404 - Route not found
// ============================================================
export const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found - ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};

// ============================================================
// Global error handler
// ============================================================
export const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  let message = err.message || "Internal server error";

  // ==========================================================
  // PostgreSQL errors
  // ==========================================================

  // Unique constraint violation
  // Example:
  // email already exists
  // SKU already exists
  // category slug already exists
  if (err.code === "23505") {
    statusCode = 400;

    const field =
      err.constraint || "unique field";

    message = `Duplicate value: ${field}`;
  }

  // Foreign key violation
  // Example:
  // product references a category that doesn't exist
  if (err.code === "23503") {
    statusCode = 400;

    message =
      "Cannot complete this operation because the related resource does not exist or is still being used.";
  }

  // Check constraint violation
  // Example:
  // price < 0
  // quantity < 0
  if (err.code === "23514") {
    statusCode = 400;

    message =
      "The provided data violates a database constraint.";
  }

  // Not-null violation
  // Example:
  // required field was not provided
  if (err.code === "23502") {
    statusCode = 400;

    message =
      `Required field is missing: ${err.column || "unknown field"}`;
  }

  // Invalid PostgreSQL data type
  // Example:
  // invalid integer value
  if (err.code === "22P02") {
    statusCode = 400;

    message =
      "Invalid data format provided.";
  }

  // ==========================================================
  // Response
  // ==========================================================

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};