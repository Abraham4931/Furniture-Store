import pool from "../config/db.js";

const Color = {
  // ============================================================
  // Create color
  // ============================================================
  async create({
    name,
    slug,
    description = "",
    hexCode = null,
    isActive = true,
  }) {
    const query = `
      INSERT INTO colors (
        name,
        slug,
        description,
        hex_code,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      name?.trim(),
      slug?.toLowerCase().trim(),
      description,
      hexCode,
      isActive,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // ============================================================
  // Find color by ID
  // ============================================================
  async findById(id) {
    const query = `
      SELECT *
      FROM colors
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // Find color by slug
  // ============================================================
  async findBySlug(slug) {
    const query = `
      SELECT *
      FROM colors
      WHERE slug = $1
    `;

    const { rows } = await pool.query(query, [
      slug.toLowerCase().trim(),
    ]);

    return rows[0] || null;
  },

  // ============================================================
  // Get all colors
  // ============================================================
  async findAll() {
    const query = `
      SELECT *
      FROM colors
      ORDER BY name ASC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // ============================================================
  // Get active colors
  // ============================================================
  async findActive() {
    const query = `
      SELECT *
      FROM colors
      WHERE is_active = TRUE
      ORDER BY name ASC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // ============================================================
  // Update color
  // ============================================================
  async update(id, {
    name,
    slug,
    description,
    hexCode,
    isActive,
  }) {
    const query = `
      UPDATE colors
      SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        hex_code = COALESCE($4, hex_code),
        is_active = COALESCE($5, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const values = [
      name?.trim() || null,
      slug?.toLowerCase().trim() || null,
      description ?? null,
      hexCode ?? null,
      isActive ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // Delete color
  // ============================================================
  async delete(id) {
    const query = `
      DELETE FROM colors
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default Color;