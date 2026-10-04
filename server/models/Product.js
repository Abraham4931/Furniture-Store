import pool from "../config/db.js";

const Product = {
  // ============================================================
  // Create product
  // ============================================================
  async create({
    name,
    slug,
    description,
    categoryId,
    brand = "",
    material = "",
    color = "",
    dimensions = {},
    images = [],
    price,
    discountPrice = 0,
    countInStock = 0,
    rating = 0,
    numReviews = 0,
    isFeatured = false,
    tags = [],
  }) {
    const query = `
      INSERT INTO products (
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
        tags
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19
      )
      RETURNING *
    `;

    const values = [
      name.trim(),
      slug.toLowerCase().trim(),
      description,
      categoryId,
      brand,
      material,
      color,
      dimensions.width ?? null,
      dimensions.height ?? null,
      dimensions.depth ?? null,
      dimensions.unit || "cm",
      images,
      price,
      discountPrice,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      tags,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // ============================================================
  // Get all products
  // ============================================================
  async findAll() {
    const query = `
      SELECT *
      FROM products
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // ============================================================
  // Find product by ID
  // ============================================================
  async findById(id) {
    const query = `
      SELECT *
      FROM products
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // Find product by slug
  // ============================================================
  async findBySlug(slug) {
    const query = `
      SELECT *
      FROM products
      WHERE slug = $1
    `;

    const { rows } = await pool.query(query, [
      slug.toLowerCase().trim(),
    ]);

    return rows[0] || null;
  },

  // ============================================================
  // Find products by category
  // ============================================================
  async findByCategory(categoryId) {
    const query = `
      SELECT *
      FROM products
      WHERE category_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [categoryId]);

    return rows;
  },

  // ============================================================
  // Featured products
  // ============================================================
  async findFeatured() {
    const query = `
      SELECT *
      FROM products
      WHERE is_featured = TRUE
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // ============================================================
  // Search
  // ============================================================
  async search(searchTerm) {
    const query = `
      SELECT *
      FROM products
      WHERE
        name ILIKE $1
        OR description ILIKE $1
        OR EXISTS (
          SELECT 1
          FROM unnest(tags) AS tag
          WHERE tag ILIKE $1
        )
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [
      `%${searchTerm}%`,
    ]);

    return rows;
  },

  // ============================================================
  // Update product
  // ============================================================
  async update(id, data) {
    const {
      name,
      slug,
      description,
      categoryId,
      brand,
      material,
      color,
      dimensions = {},
      images,
      price,
      discountPrice,
      countInStock,
      rating,
      numReviews,
      isFeatured,
      tags,
    } = data;

    const query = `
      UPDATE products
      SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        category_id = COALESCE($4, category_id),
        brand = COALESCE($5, brand),
        material = COALESCE($6, material),
        color = COALESCE($7, color),
        width = COALESCE($8, width),
        height = COALESCE($9, height),
        depth = COALESCE($10, depth),
        dimension_unit = COALESCE($11, dimension_unit),
        images = COALESCE($12, images),
        price = COALESCE($13, price),
        discount_price = COALESCE($14, discount_price),
        count_in_stock = COALESCE($15, count_in_stock),
        rating = COALESCE($16, rating),
        num_reviews = COALESCE($17, num_reviews),
        is_featured = COALESCE($18, is_featured),
        tags = COALESCE($19, tags),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $20
      RETURNING *
    `;

    const values = [
      name ?? null,
      slug?.toLowerCase().trim() ?? null,
      description ?? null,
      categoryId ?? null,
      brand ?? null,
      material ?? null,
      color ?? null,
      dimensions.width ?? null,
      dimensions.height ?? null,
      dimensions.depth ?? null,
      dimensions.unit ?? null,
      images ?? null,
      price ?? null,
      discountPrice ?? null,
      countInStock ?? null,
      rating ?? null,
      numReviews ?? null,
      isFeatured ?? null,
      tags ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // Delete product
  // ============================================================
  async delete(id) {
    const query = `
      DELETE FROM products
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default Product;