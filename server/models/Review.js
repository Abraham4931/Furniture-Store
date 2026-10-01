import pool from "../config/db.js";

const Review = {
  // Create a review
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

  // Get all reviews for a product
  async findByProduct(productId) {
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

  // Find a user's review for a product
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

  // Delete a review
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