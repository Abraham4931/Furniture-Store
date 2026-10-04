import pool from "../config/db.js";

const ProductVariant = {
  // ============================================================
  // Create variant
  // ============================================================
  async create({
    productId,
    sku,
    name = null,
    color = null,
    material = null,
    size = null,
    width = null,
    height = null,
    depth = null,
    dimensionUnit = "cm",
    price,
    discountPrice = null,
    countInStock = 0,
    imageUrl = null,
    isActive = true,
  }) {
    const query = `
      INSERT INTO product_variants (
        product_id,
        sku,
        name,
        color,
        material,
        size,
        width,
        height,
        depth,
        dimension_unit,
        price,
        discount_price,
        count_in_stock,
        image_url,
        is_active
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15
      )
      RETURNING *
    `;

    const values = [
      productId,
      sku,
      name,
      color,
      material,
      size,
      width,
      height,
      depth,
      dimensionUnit,
      price,
      discountPrice,
      countInStock,
      imageUrl,
      isActive,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // ============================================================
  // Find by ID
  // ============================================================
  async findById(id) {
    const query = `
      SELECT *
      FROM product_variants
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // Find variants by product
  // ============================================================
  async findByProductId(productId) {
    const query = `
      SELECT *
      FROM product_variants
      WHERE product_id = $1
      ORDER BY id ASC
    `;

    const { rows } = await pool.query(query, [productId]);

    return rows;
  },

  // ============================================================
  // Find by SKU
  // ============================================================
  async findBySku(sku) {
    const query = `
      SELECT *
      FROM product_variants
      WHERE sku = $1
    `;

    const { rows } = await pool.query(query, [sku]);

    return rows[0] || null;
  },

  // ============================================================
  // Active variants
  // ============================================================
  async findActive() {
    const query = `
      SELECT *
      FROM product_variants
      WHERE is_active = TRUE
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // ============================================================
  // Update variant
  // ============================================================
  async update(id, data) {
    const {
      sku,
      name,
      color,
      material,
      size,
      width,
      height,
      depth,
      dimensionUnit,
      price,
      discountPrice,
      countInStock,
      imageUrl,
      isActive,
    } = data;

    const query = `
      UPDATE product_variants
      SET
        sku = COALESCE($1, sku),
        name = COALESCE($2, name),
        color = COALESCE($3, color),
        material = COALESCE($4, material),
        size = COALESCE($5, size),
        width = COALESCE($6, width),
        height = COALESCE($7, height),
        depth = COALESCE($8, depth),
        dimension_unit = COALESCE($9, dimension_unit),
        price = COALESCE($10, price),
        discount_price = COALESCE($11, discount_price),
        count_in_stock = COALESCE($12, count_in_stock),
        image_url = COALESCE($13, image_url),
        is_active = COALESCE($14, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      sku ?? null,
      name ?? null,
      color ?? null,
      material ?? null,
      size ?? null,
      width ?? null,
      height ?? null,
      depth ?? null,
      dimensionUnit ?? null,
      price ?? null,
      discountPrice ?? null,
      countInStock ?? null,
      imageUrl ?? null,
      isActive ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // Delete variant
  // ============================================================
  async delete(id) {
    const query = `
      DELETE FROM product_variants
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default ProductVariant;