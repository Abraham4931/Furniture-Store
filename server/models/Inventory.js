import pool from "../config/db.js";

const Inventory = {
  async create({
    productVariantId,
    quantity = 0,
    reservedQuantity = 0,
    reorderLevel = 0,
    isActive = true
  }) {
    const query = `
      INSERT INTO inventory (
        product_variant_id,
        quantity,
        reserved_quantity,
        reorder_level,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      productVariantId,
      quantity,
      reservedQuantity,
      reorderLevel,
      isActive
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  async findById(id) {
    const query = `
      SELECT *
      FROM inventory
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  async findByProductVariantId(productVariantId) {
    const query = `
      SELECT *
      FROM inventory
      WHERE product_variant_id = $1
    `;

    const { rows } = await pool.query(
      query,
      [productVariantId]
    );

    return rows[0] || null;
  },

  async findAll() {
    const query = `
      SELECT *
      FROM inventory
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  async findLowStock() {
    const query = `
      SELECT *
      FROM inventory
      WHERE is_active = TRUE
        AND quantity <= reorder_level
      ORDER BY quantity ASC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  async update(id, {
    quantity,
    reservedQuantity,
    reorderLevel,
    isActive
  }) {
    const query = `
      UPDATE inventory
      SET
        quantity = COALESCE($1, quantity),
        reserved_quantity = COALESCE($2, reserved_quantity),
        reorder_level = COALESCE($3, reorder_level),
        is_active = COALESCE($4, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const values = [
      quantity ?? null,
      reservedQuantity ?? null,
      reorderLevel ?? null,
      isActive ?? null,
      id
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  async addStock(productVariantId, quantity) {
    const query = `
      UPDATE inventory
      SET
        quantity = quantity + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_variant_id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [quantity, productVariantId]
    );

    return rows[0] || null;
  },

  async removeStock(productVariantId, quantity) {
    const query = `
      UPDATE inventory
      SET
        quantity = quantity - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_variant_id = $2
        AND quantity - reserved_quantity >= $1
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [quantity, productVariantId]
    );

    return rows[0] || null;
  },

  async reserveStock(productVariantId, quantity) {
    const query = `
      UPDATE inventory
      SET
        reserved_quantity = reserved_quantity + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_variant_id = $2
        AND quantity - reserved_quantity >= $1
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [quantity, productVariantId]
    );

    return rows[0] || null;
  },

  async releaseStock(productVariantId, quantity) {
    const query = `
      UPDATE inventory
      SET
        reserved_quantity = reserved_quantity - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_variant_id = $2
        AND reserved_quantity >= $1
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [quantity, productVariantId]
    );

    return rows[0] || null;
  },

  async delete(id) {
    const query = `
      DELETE FROM inventory
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  }
};

export default Inventory;