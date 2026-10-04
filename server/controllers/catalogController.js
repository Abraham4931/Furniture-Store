import Product from "../models/Product.js";
import Category from "../models/Category.js";
import ProductVariant from "../models/ProductVariant.js";
import ProductImage from "../models/ProductImage.js";
import Material from "../models/Material.js";
import Color from "../models/Color.js";
import Product3DModel from "../models/Product3DModel.js";
import Review from "../models/Review.js";

// ============================================================
// Helpers
// ============================================================

const getId = (value) => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
};

const handleError = (res, error, message = "Server error") => {
  console.error(message, error);

  // PostgreSQL unique violation
  if (error.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
  }

  // PostgreSQL foreign key violation
  if (error.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Referenced record does not exist",
    });
  }

  return res.status(500).json({
    success: false,
    message,
  });
};


// ============================================================
// PRODUCTS
// ============================================================

// GET /api/catalog/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch products"
    );
  }
};


// GET /api/catalog/products/:id
export const getProductById = async (req, res) => {
  try {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch product"
    );
  }
};


// GET /api/catalog/products/slug/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Product slug is required",
      });
    }

    const product = await Product.findBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch product"
    );
  }
};


// POST /api/catalog/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      category_id,
      brand,
      material,
      color,
      width,
      height,
      depth,
      dimension_unit,
      images,
      price,
      discount_price,
      count_in_stock,
      rating,
      num_reviews,
      is_featured,
      tags,
    } = req.body;

    if (
      !name ||
      !slug ||
      !description ||
      !category_id ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, slug, description, category and price are required",
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category_id,
      brand,
      material,
      color,
      width,
      height,
      depth,
      dimension_unit,
      images,
      price,
      discount_price,
      count_in_stock,
      rating,
      num_reviews,
      is_featured,
      tags,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create product"
    );
  }
};


// PUT /api/catalog/products/:id
export const updateProduct = async (req, res) => {
  try {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.update(
      id,
      req.body
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update product"
    );
  }
};


// DELETE /api/catalog/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const deletedProduct = await Product.delete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete product"
    );
  }
};


// ============================================================
// CATEGORIES
// ============================================================

// GET /api/catalog/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch categories"
    );
  }
};


// GET /api/catalog/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch category"
    );
  }
};


// GET /api/catalog/categories/slug/:slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findBySlug(slug);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch category"
    );
  }
};


// POST /api/catalog/categories
export const createCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create category"
    );
  }
};


// PUT /api/catalog/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.update(
      id,
      req.body
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update category"
    );
  }
};


// DELETE /api/catalog/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const id = getId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.delete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete category"
    );
  }
};


// ============================================================
// PRODUCT VARIANTS
// ============================================================

// GET /api/catalog/products/:productId/variants
export const getProductVariants = async (req, res) => {
  try {
    const productId = getId(req.params.productId);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const variants =
      await ProductVariant.findByProductId(productId);

    return res.status(200).json({
      success: true,
      count: variants.length,
      variants,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch product variants"
    );
  }
};


// GET /api/catalog/variants/:id
export const getVariantById = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const variant =
      await ProductVariant.findById(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    return res.status(200).json({
      success: true,
      variant,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch variant"
    );
  }
};


// POST /api/catalog/products/:productId/variants
export const createVariant = async (req, res) => {
  try {
    const productId =
      getId(req.params.productId);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const variant =
      await ProductVariant.create({
        ...req.body,
        product_id: productId,
      });

    return res.status(201).json({
      success: true,
      message: "Variant created successfully",
      variant,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create variant"
    );
  }
};


// PUT /api/catalog/variants/:id
export const updateVariant = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const variant =
      await ProductVariant.update(
        id,
        req.body
      );

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Variant updated successfully",
      variant,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update variant"
    );
  }
};


// DELETE /api/catalog/variants/:id
export const deleteVariant = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const variant =
      await ProductVariant.delete(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
      variant,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete variant"
    );
  }
};


// ============================================================
// PRODUCT IMAGES
// ============================================================

// GET /api/catalog/products/:productId/images
export const getProductImages = async (req, res) => {
  try {
    const productId =
      getId(req.params.productId);

    const images =
      await ProductImage.findByProductId(productId);

    return res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch product images"
    );
  }
};


// POST /api/catalog/products/:productId/images
export const createProductImage = async (req, res) => {
  try {
    const productId =
      getId(req.params.productId);

    const image =
      await ProductImage.create({
        ...req.body,
        product_id: productId,
      });

    return res.status(201).json({
      success: true,
      message: "Product image added successfully",
      image,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create product image"
    );
  }
};


// PUT /api/catalog/images/:id
export const updateProductImage = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const image =
      await ProductImage.update(
        id,
        req.body
      );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Product image not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully",
      image,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update product image"
    );
  }
};


// DELETE /api/catalog/images/:id
export const deleteProductImage = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const image =
      await ProductImage.delete(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Product image not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
      image,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete product image"
    );
  }
};


// ============================================================
// MATERIALS
// ============================================================

// GET /api/catalog/materials
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll();

    return res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch materials"
    );
  }
};


// POST /api/catalog/materials
export const createMaterial = async (req, res) => {
  try {
    const material =
      await Material.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Material created successfully",
      material,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create material"
    );
  }
};


// PUT /api/catalog/materials/:id
export const updateMaterial = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const material =
      await Material.update(
        id,
        req.body
      );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Material updated successfully",
      material,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update material"
    );
  }
};


// DELETE /api/catalog/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const material =
      await Material.delete(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
      material,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete material"
    );
  }
};


// ============================================================
// COLORS
// ============================================================

// GET /api/catalog/colors
export const getColors = async (req, res) => {
  try {
    const colors = await Color.findAll();

    return res.status(200).json({
      success: true,
      count: colors.length,
      colors,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch colors"
    );
  }
};


// POST /api/catalog/colors
export const createColor = async (req, res) => {
  try {
    const color =
      await Color.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Color created successfully",
      color,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create color"
    );
  }
};


// PUT /api/catalog/colors/:id
export const updateColor = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const color =
      await Color.update(
        id,
        req.body
      );

    if (!color) {
      return res.status(404).json({
        success: false,
        message: "Color not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Color updated successfully",
      color,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update color"
    );
  }
};


// DELETE /api/catalog/colors/:id
export const deleteColor = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const color =
      await Color.delete(id);

    if (!color) {
      return res.status(404).json({
        success: false,
        message: "Color not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Color deleted successfully",
      color,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete color"
    );
  }
};


// ============================================================
// PRODUCT 3D MODELS
// ============================================================

// GET /api/catalog/products/:productId/3d-models
export const getProduct3DModels = async (req, res) => {
  try {
    const productId =
      getId(req.params.productId);

    const models =
      await Product3DModel.findByProductId(
        productId
      );

    return res.status(200).json({
      success: true,
      count: models.length,
      models,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch 3D models"
    );
  }
};


// POST /api/catalog/products/:productId/3d-models
export const createProduct3DModel = async (req, res) => {
  try {
    const productId =
      getId(req.params.productId);

    const model =
      await Product3DModel.create({
        ...req.body,
        product_id: productId,
      });

    return res.status(201).json({
      success: true,
      message: "3D model created successfully",
      model,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create 3D model"
    );
  }
};


// PUT /api/catalog/3d-models/:id
export const updateProduct3DModel = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const model =
      await Product3DModel.update(
        id,
        req.body
      );

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "3D model not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "3D model updated successfully",
      model,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update 3D model"
    );
  }
};


// DELETE /api/catalog/3d-models/:id
export const deleteProduct3DModel = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const model =
      await Product3DModel.delete(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "3D model not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "3D model deleted successfully",
      model,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete 3D model"
    );
  }
};


// ============================================================
// REVIEWS
// ============================================================

// GET /api/catalog/products/:productId/reviews
export const getProductReviews = async (req, res) => {
  try {
    const productId =
      getId(req.params.productId);

    const reviews =
      await Review.findByProductId(productId);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to fetch reviews"
    );
  }
};


// POST /api/catalog/products/:productId/reviews
export const createReview = async (req, res) => {
  try {
    const productId =
      getId(req.params.productId);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      rating,
      comment,
    } = req.body;

    if (
      rating === undefined ||
      !comment
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating and comment are required",
      });
    }

    if (
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5",
      });
    }

    const review =
      await Review.create({
        product_id: productId,
        user_id: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment.trim(),
      });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to create review"
    );
  }
};


// PUT /api/catalog/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const review =
      await Review.update(
        id,
        req.body
      );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to update review"
    );
  }
};


// DELETE /api/catalog/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const id = getId(req.params.id);

    const review =
      await Review.delete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      review,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Failed to delete review"
    );
  }
};