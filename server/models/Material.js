import pool from "../config/db.js";

const Material = {
  // ============================================================
  // Create material
  // ============================================================
  async create({
    name,
    slug,
    description = "",
    imageUrl = null,
    isActive = true,
  }) {
    const query = `
      INSERT INTO materials (
        name,
        slug,
        description,
        image_url,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      name?.trim(),
      slug?.toLowerCase().trim(),
      description,
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
      FROM materials
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // ============================================================
  // Find by slug
  // ============================================================
  async findBySlug(slug) {
    const query = `
      SELECT *
      FROM materials
      WHERE slug = $1
    `;

    const { rows } = await pool.query(query, [
      slug.toLowerCase().trim(),
    ]);

    return rows[0] || null;
  },

  // ============================================================
  // Get all materials
  // ============================================================
  async findAll() {
    const query = `
      SELECT *
      FROM materials
      ORDER BY name ASC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // ============================================================
  // Get active materials
  // ============================================================
  async findActive() {
    const query = `
      SELECT *
      FROM materials
      WHERE is_active = TRUE
      ORDER BY name ASC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // ============================================================
  // Update material
  // ============================================================
  async update(
    id,
    {
      name,
      slug,
      description,
      imageUrl,
      isActive,
    }
  ) {
    const query = `
      UPDATE materials
      SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        image_url = COALESCE($4, image_url),
        is_active = COALESCE($5, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const values = [
      name?.trim() || null,
      slug?.toLowerCase().trim() || null,
      description ?? null,
      imageUrl ?? null,
      isActive ?? null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // ============================================================
  // Delete material
  // ============================================================
  async delete(id) {
    const query = `
      DELETE FROM materials
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default Material;