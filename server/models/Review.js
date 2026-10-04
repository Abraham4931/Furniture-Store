import pool from "../config/db.js";

const Review = {
  // ============================================================
  // Create review
  // ============================================================
  async create({
    productId,
    userId,
    name,
    rating,
    comment,
  }) {
    const query = `
      INSERT INTO reviews (
        product_id,
        user_id,
        name,
        rating,
        comment
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        product_id,
        user_id,
        name,
        rating,
        comment,
        created_at,
        updated_at
    `;

    const values = [
      productId,
      userId,
      name,
      rating,
      comment,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // ============================================================
  // Get reviews for product
  // ============================================================
  async findByProductId(productId) {
    const query = `
      SELECT
        id,
        product_id,
        user_id,
        name,
        rating,
        comment,
        created_at,
        updated_at
      FROM reviews
      WHERE product_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [productId]);

    return rows;
  },

  // ============================================================
  // Find review by product and user
  // ============================================================
  async findByProductAndUser(productId, userId) {
    const query = `
      SELECT
        id,
        product_id,
        user_id,
        name,
        rating,
        comment,
        created_at,
        updated_at
      FROM reviews
      WHERE product_id = $1
        AND user_id = $2
    `;

    const { rows } = await pool.query(query, [
      productId,
      userId,
    ]);

    return rows[0] || null;
  },

  // ============================================================
  // Find review by ID
  // ============================================================
  async findById(id) {
    const query = `
      SELECT
        id,
        product_id,
        user_id,
        name,
        rating,
        comment,
        created_at,
        updated_at
      FROM reviews
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // Update review
  // ============================================================
  async update(id, {
    rating,
    comment,
  }) {
    const query = `
      UPDATE reviews
      SET
        rating = COALESCE($1, rating),
        comment = COALESCE($2, comment),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING
        id,
        product_id,
        user_id,
        name,
        rating,
        comment,
        created_at,
        updated_at
    `;

    const values = [
      rating ?? null,
      comment ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // Delete review
  // ============================================================
  async delete(id) {
    const query = `
      DELETE FROM reviews
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default Review;