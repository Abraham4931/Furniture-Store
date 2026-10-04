import pool from "../config/db.js";

const ProductImage = {
  // ============================================================
  // Create image
  // ============================================================
  async create({
    productId,
    imageUrl,
    altText = null,
    imageType = "product",
    isPrimary = false,
    sortOrder = 0,
    width = null,
    height = null,
    fileSize = null,
    mimeType = null,
  }) {
    const query = `
      INSERT INTO product_images (
        product_id,
        image_url,
        alt_text,
        image_type,
        is_primary,
        sort_order,
        width,
        height,
        file_size,
        mime_type
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10
      )
      RETURNING *
    `;

    const values = [
      productId,
      imageUrl,
      altText,
      imageType,
      isPrimary,
      sortOrder,
      width,
      height,
      fileSize,
      mimeType,
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
      FROM product_images
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // Find images by product
  // ============================================================
  async findByProductId(productId) {
    const query = `
      SELECT *
      FROM product_images
      WHERE product_id = $1
      ORDER BY sort_order ASC, id ASC
    `;

    const { rows } = await pool.query(query, [productId]);

    return rows;
  },

  // ============================================================
  // Find primary image
  // ============================================================
  async findPrimary(productId) {
    const query = `
      SELECT *
      FROM product_images
      WHERE product_id = $1
        AND is_primary = TRUE
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [productId]);

    return rows[0] || null;
  },

  // ============================================================
  // Find images by type
  // ============================================================
  async findByType(productId, imageType) {
    const query = `
      SELECT *
      FROM product_images
      WHERE product_id = $1
        AND image_type = $2
      ORDER BY sort_order ASC
    `;

    const { rows } = await pool.query(query, [
      productId,
      imageType,
    ]);

    return rows;
  },

  // ============================================================
  // Update image
  // ============================================================
  async update(id, data) {
    const {
      imageUrl,
      altText,
      imageType,
      isPrimary,
      sortOrder,
      width,
      height,
      fileSize,
      mimeType,
    } = data;

    const query = `
      UPDATE product_images
      SET
        image_url = COALESCE($1, image_url),
        alt_text = COALESCE($2, alt_text),
        image_type = COALESCE($3, image_type),
        is_primary = COALESCE($4, is_primary),
        sort_order = COALESCE($5, sort_order),
        width = COALESCE($6, width),
        height = COALESCE($7, height),
        file_size = COALESCE($8, file_size),
        mime_type = COALESCE($9, mime_type),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;

    const values = [
      imageUrl ?? null,
      altText ?? null,
      imageType ?? null,
      isPrimary ?? null,
      sortOrder ?? null,
      width ?? null,
      height ?? null,
      fileSize ?? null,
      mimeType ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // Delete image
  // ============================================================
  async delete(id) {
    const query = `
      DELETE FROM product_images
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // Delete all images for product
  // ============================================================
  async deleteByProductId(productId) {
    await pool.query(
      `
        DELETE FROM product_images
        WHERE product_id = $1
      `,
      [productId]
    );

    return true;
  },
};

export default ProductImage;