import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

const recalcProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating = numReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews : 0;
  await Product.findByIdAndUpdate(productId, { numReviews, rating });
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Create a review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  await recalcProductRating(productId);

  res.status(201).json(review);
});
