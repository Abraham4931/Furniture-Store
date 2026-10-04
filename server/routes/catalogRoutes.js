import express from "express";

import {
  // Products
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,

  // Categories
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,

  // Variants
  getProductVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,

  // Product images
  getProductImages,
  createProductImage,
  updateProductImage,
  deleteProductImage,

  // Materials
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,

  // Colors
  getColors,
  createColor,
  updateColor,
  deleteColor,

  // 3D models
  getProduct3DModels,
  createProduct3DModel,
  updateProduct3DModel,
  deleteProduct3DModel,

  // Reviews
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/catalogController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

/* ============================================================
   PRODUCTS
   ============================================================ */

router.get("/products", getProducts);

router.get(
  "/products/slug/:slug",
  getProductBySlug
);

router.get(
  "/products/:id",
  getProductById
);

router.post(
  "/products",
  protect,
  admin,
  createProduct
);

router.put(
  "/products/:id",
  protect,
  admin,
  updateProduct
);

router.delete(
  "/products/:id",
  protect,
  admin,
  deleteProduct
);


/* ============================================================
   CATEGORIES
   ============================================================ */

router.get(
  "/categories",
  getCategories
);

router.get(
  "/categories/slug/:slug",
  getCategoryBySlug
);

router.get(
  "/categories/:id",
  getCategoryById
);

router.post(
  "/categories",
  protect,
  admin,
  createCategory
);

router.put(
  "/categories/:id",
  protect,
  admin,
  updateCategory
);

router.delete(
  "/categories/:id",
  protect,
  admin,
  deleteCategory
);


/* ============================================================
   PRODUCT VARIANTS
   ============================================================ */

router.get(
  "/products/:productId/variants",
  getProductVariants
);

router.get(
  "/variants/:id",
  getVariantById
);

router.post(
  "/products/:productId/variants",
  protect,
  admin,
  createVariant
);

router.put(
  "/variants/:id",
  protect,
  admin,
  updateVariant
);

router.delete(
  "/variants/:id",
  protect,
  admin,
  deleteVariant
);


/* ============================================================
   PRODUCT IMAGES
   ============================================================ */

router.get(
  "/products/:productId/images",
  getProductImages
);

router.post(
  "/products/:productId/images",
  protect,
  admin,
  createProductImage
);

router.put(
  "/images/:id",
  protect,
  admin,
  updateProductImage
);

router.delete(
  "/images/:id",
  protect,
  admin,
  deleteProductImage
);


/* ============================================================
   MATERIALS
   ============================================================ */

router.get(
  "/materials",
  getMaterials
);

router.post(
  "/materials",
  protect,
  admin,
  createMaterial
);

router.put(
  "/materials/:id",
  protect,
  admin,
  updateMaterial
);

router.delete(
  "/materials/:id",
  protect,
  admin,
  deleteMaterial
);


/* ============================================================
   COLORS
   ============================================================ */

router.get(
  "/colors",
  getColors
);

router.post(
  "/colors",
  protect,
  admin,
  createColor
);

router.put(
  "/colors/:id",
  protect,
  admin,
  updateColor
);

router.delete(
  "/colors/:id",
  protect,
  admin,
  deleteColor
);


/* ============================================================
   3D MODELS
   ============================================================ */

router.get(
  "/products/:productId/3d-models",
  getProduct3DModels
);

router.post(
  "/products/:productId/3d-models",
  protect,
  admin,
  createProduct3DModel
);

router.put(
  "/3d-models/:id",
  protect,
  admin,
  updateProduct3DModel
);

router.delete(
  "/3d-models/:id",
  protect,
  admin,
  deleteProduct3DModel
);


/* ============================================================
   REVIEWS
   ============================================================ */

router.get(
  "/products/:productId/reviews",
  getProductReviews
);

router.post(
  "/products/:productId/reviews",
  protect,
  createReview
);

router.put(
  "/reviews/:id",
  protect,
  updateReview
);

router.delete(
  "/reviews/:id",
  protect,
  deleteReview
);

export default router;