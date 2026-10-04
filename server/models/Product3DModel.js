import pool from "../config/db.js";

const Product3DModel = {
  async create({
    productId,
    modelUrl,
    modelFormat = "glb",
    modelName = null,
    thumbnailUrl = null,
    fileSize = null,
    isPrimary = true,
    isActive = true
  }) {
    const query = `
      INSERT INTO product_3d_models (
        product_id,
        model_url,
        model_format,
        model_name,
        thumbnail_url,
        file_size,
        is_primary,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      productId,
      modelUrl,
      modelFormat,
      modelName,
      thumbnailUrl,
      fileSize,
      isPrimary,
      isActive
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  async findById(id) {
    const query = `
      SELECT *
      FROM product_3d_models
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  async findByProductId(productId) {
    const query = `
      SELECT *
      FROM product_3d_models
      WHERE product_id = $1
        AND is_active = TRUE
      ORDER BY is_primary DESC, created_at DESC
    `;

    const { rows } = await pool.query(
      query,
      [productId]
    );

    return rows;
  },

  async findPrimaryByProductId(productId) {
    const query = `
      SELECT *
      FROM product_3d_models
      WHERE product_id = $1
        AND is_primary = TRUE
        AND is_active = TRUE
      LIMIT 1
    `;

    const { rows } = await pool.query(
      query,
      [productId]
    );

    return rows[0] || null;
  },

  async findAll() {
    const query = `
      SELECT *
      FROM product_3d_models
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  async update(id, {
    modelUrl,
    modelFormat,
    modelName,
    thumbnailUrl,
    fileSize,
    isPrimary,
    isActive
  }) {
    const query = `
      UPDATE product_3d_models
      SET
        model_url = COALESCE($1, model_url),
        model_format = COALESCE($2, model_format),
        model_name = COALESCE($3, model_name),
        thumbnail_url = COALESCE($4, thumbnail_url),
        file_size = COALESCE($5, file_size),
        is_primary = COALESCE($6, is_primary),
        is_active = COALESCE($7, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      modelUrl ?? null,
      modelFormat ?? null,
      modelName ?? null,
      thumbnailUrl ?? null,
      fileSize ?? null,
      isPrimary ?? null,
      isActive ?? null,
      id
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  async setPrimary(id, productId) {
    await pool.query(
      `
        UPDATE product_3d_models
        SET
          is_primary = FALSE,
          updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $1
      `,
      [productId]
    );

    const query = `
      UPDATE product_3d_models
      SET
        is_primary = TRUE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
        AND product_id = $2
        AND is_active = TRUE
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [id, productId]
    );

    return rows[0] || null;
  },

  async delete(id) {
    const query = `
      DELETE FROM product_3d_models
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  }
};

export default Product3DModel;