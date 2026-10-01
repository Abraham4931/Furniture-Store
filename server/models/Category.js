import pool from "../config/db.js";

const Category = {
  // Create category
  async create({ name, slug, description = "", image = "" }) {
    const query = `
      INSERT INTO categories (
        name,
        slug,
        description,
        image
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      name.trim(),
      slug.toLowerCase().trim(),
      description,
      image,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // Get all categories
  async findAll() {
    const query = `
      SELECT *
      FROM categories
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // Find category by ID
  async findById(id) {
    const query = `
      SELECT *
      FROM categories
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // Find category by slug
  async findBySlug(slug) {
    const query = `
      SELECT *
      FROM categories
      WHERE slug = $1
    `;

    const { rows } = await pool.query(query, [
      slug.toLowerCase(),
    ]);

    return rows[0] || null;
  },

  // Update category
  async update(id, { name, slug, description, image }) {
    const query = `
      UPDATE categories
      SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        image = COALESCE($4, image),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const values = [
      name?.trim() || null,
      slug?.toLowerCase().trim() || null,
      description ?? null,
      image ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // Delete category
  async delete(id) {
    const query = `
      DELETE FROM categories
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default Category;