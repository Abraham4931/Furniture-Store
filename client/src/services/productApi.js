import api from "./api";

/*
|--------------------------------------------------------------------------
| Product & Catalog API
|--------------------------------------------------------------------------
| Handles all product and catalog-related API requests.
|
| Backend route:
|   /api/catalog
|
| Used by:
|   Home.jsx
|   Products.jsx
|   ProductDetails.jsx
|   ProductReviews.jsx
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

/**
 * Get all products
 *
 * GET /api/catalog/products
 */
export const getProducts = () => {
  return api.get("/catalog/products");
};

/**
 * Get a single product by ID
 *
 * GET /api/catalog/products/:id
 */
export const getProductById = (id) => {
  return api.get(`/catalog/products/${id}`);
};

/**
 * Get a single product by slug
 *
 * GET /api/catalog/products/slug/:slug
 */
export const getProductBySlug = (slug) => {
  return api.get(`/catalog/products/slug/${slug}`);
};

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

/**
 * Get all product categories
 *
 * GET /api/catalog/categories
 */
export const getCategories = () => {
  return api.get("/catalog/categories");
};

/**
 * Get a category by ID
 *
 * GET /api/catalog/categories/:id
 */
export const getCategoryById = (id) => {
  return api.get(`/catalog/categories/${id}`);
};

/**
 * Get a category by slug
 *
 * GET /api/catalog/categories/slug/:slug
 */
export const getCategoryBySlug = (slug) => {
  return api.get(`/catalog/categories/slug/${slug}`);
};

/*
|--------------------------------------------------------------------------
| Product Variants
|--------------------------------------------------------------------------
*/

/**
 * Get all variants for a product
 *
 * GET /api/catalog/products/:productId/variants
 */
export const getProductVariants = (productId) => {
  return api.get(`/catalog/products/${productId}/variants`);
};

/**
 * Get a specific product variant
 *
 * GET /api/catalog/variants/:variantId
 */
export const getVariantById = (variantId) => {
  return api.get(`/catalog/variants/${variantId}`);
};

/*
|--------------------------------------------------------------------------
| Product Images
|--------------------------------------------------------------------------
*/

/**
 * Get all images for a product
 *
 * GET /api/catalog/products/:productId/images
 */
export const getProductImages = (productId) => {
  return api.get(`/catalog/products/${productId}/images`);
};

/*
|--------------------------------------------------------------------------
| Materials
|--------------------------------------------------------------------------
*/

/**
 * Get all available materials
 *
 * GET /api/catalog/materials
 */
export const getMaterials = () => {
  return api.get("/catalog/materials");
};

/*
|--------------------------------------------------------------------------
| Colors
|--------------------------------------------------------------------------
*/

/**
 * Get all available colors
 *
 * GET /api/catalog/colors
 */
export const getColors = () => {
  return api.get("/catalog/colors");
};

/*
|--------------------------------------------------------------------------
| 3D Models
|--------------------------------------------------------------------------
*/

/**
 * Get 3D models for a product
 *
 * GET /api/catalog/products/:productId/3d-models
 */
export const getProduct3DModels = (productId) => {
  return api.get(`/catalog/products/${productId}/3d-models`);
};

/*
|--------------------------------------------------------------------------
| Product Reviews
|--------------------------------------------------------------------------
*/

/**
 * Get reviews for a product
 *
 * GET /api/catalog/products/:productId/reviews
 */
export const getProductReviews = (productId) => {
  return api.get(`/catalog/products/${productId}/reviews`);
};

/**
 * Create a review for a product
 *
 * POST /api/catalog/products/:productId/reviews
 */
export const createReview = (productId, data) => {
  return api.post(`/catalog/products/${productId}/reviews`, data);
};

/**
 * Update a product review
 *
 * PUT /api/catalog/reviews/:reviewId
 */
export const updateReview = (reviewId, data) => {
  return api.put(`/catalog/reviews/${reviewId}`, data);
};

/**
 * Delete a product review
 *
 * DELETE /api/catalog/reviews/:reviewId
 */
export const deleteReview = (reviewId) => {
  return api.delete(`/catalog/reviews/${reviewId}`);
};