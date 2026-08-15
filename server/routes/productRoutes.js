import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from "../controllers/productController.js";
import { getProductReviews, createProductReview } from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/featured/list", getFeaturedProducts);
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.route("/:id/reviews").get(getProductReviews).post(protect, createProductReview);

export default router;
