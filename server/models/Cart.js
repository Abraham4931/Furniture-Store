// models/Cart.js

import pool from "../config/db.js";

const Cart = {

  // ==========================================
  // CREATE CART
  // ==========================================

  async create(userId) {
    const query = `
      INSERT INTO carts (
        user_id
      )
      VALUES ($1)
      RETURNING *
    `;

    const { rows } = await pool.query(query, [userId]);

    return rows[0];
  },


  // ==========================================
  // FIND CART BY ID
  // ==========================================

  async findById(id) {
    const query = `
      SELECT *
      FROM carts
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },


  // ==========================================
  // FIND ACTIVE CART FOR USER
  // ==========================================

  async findActiveByUserId(userId) {
    const query = `
      SELECT *
      FROM carts
      WHERE user_id = $1
        AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [userId]);

    return rows[0] || null;
  },


  // ==========================================
  // FIND ALL CARTS FOR USER
  // ==========================================

  async findByUserId(userId) {
    const query = `
      SELECT *
      FROM carts
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },


  // ==========================================
  // GET CART WITH ITEMS
  // ==========================================

  async findWithItems(cartId) {
    const cartQuery = `
      SELECT *
      FROM carts
      WHERE id = $1
    `;

    const { rows: cartRows } = await pool.query(
      cartQuery,
      [cartId]
    );

    if (cartRows.length === 0) {
      return null;
    }

    const itemsQuery = `
      SELECT
        ci.*,

        pv.name AS variant_name,
        pv.sku,
        pv.color,
        pv.material,
        pv.size,

        p.id AS product_id,
        p.name AS product_name,
        p.slug AS product_slug

      FROM cart_items ci

      JOIN product_variants pv
        ON pv.id = ci.product_variant_id

      JOIN products p
        ON p.id = pv.product_id

      WHERE ci.cart_id = $1

      ORDER BY ci.created_at ASC
    `;

    const { rows: itemRows } = await pool.query(
      itemsQuery,
      [cartId]
    );

    return {
      ...cartRows[0],
      items: itemRows
    };
  },


  // ==========================================
  // ADD ITEM TO CART
  // ==========================================

  async addItem({
    cartId,
    productVariantId,
    quantity = 1,
    unitPrice
  }) {

    const query = `
      INSERT INTO cart_items (
        cart_id,
        product_variant_id,
        quantity,
        unit_price
      )
      VALUES ($1, $2, $3, $4)

      ON CONFLICT (
        cart_id,
        product_variant_id
      )

      DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity,
        updated_at = CURRENT_TIMESTAMP

      RETURNING *
    `;

    const values = [
      cartId,
      productVariantId,
      quantity,
      unitPrice
    ];

    const { rows } = await pool.query(
      query,
      values
    );

    return rows[0];
  },


  // ==========================================
  // FIND CART ITEM
  // ==========================================

  async findItem(cartItemId) {
    const query = `
      SELECT *
      FROM cart_items
      WHERE id = $1
    `;

    const { rows } = await pool.query(
      query,
      [cartItemId]
    );

    return rows[0] || null;
  },


  // ==========================================
  // UPDATE ITEM QUANTITY
  // ==========================================

  async updateItemQuantity(cartItemId, quantity) {

    const query = `
      UPDATE cart_items

      SET
        quantity = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2

      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [quantity, cartItemId]
    );

    return rows[0] || null;
  },


  // ==========================================
  // REMOVE ITEM
  // ==========================================

  async removeItem(cartItemId) {

    const query = `
      DELETE FROM cart_items
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [cartItemId]
    );

    return rows[0] || null;
  },


  // ==========================================
  // CLEAR CART
  // ==========================================

  async clear(cartId) {

    const query = `
      DELETE FROM cart_items
      WHERE cart_id = $1
    `;

    await pool.query(query, [cartId]);

    return true;
  },


  // ==========================================
  // UPDATE CART STATUS
  // ==========================================

  async updateStatus(cartId, status) {

    const query = `
      UPDATE carts

      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2

      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [status, cartId]
    );

    return rows[0] || null;
  },


  // ==========================================
  // DELETE CART
  // ==========================================

  async delete(cartId) {

    const query = `
      DELETE FROM carts
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(
      query,
      [cartId]
    );

    return rows[0] || null;
  }

};

export default Cart;