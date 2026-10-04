// models/Wishlist.js

import pool from "../config/db.js";

const Wishlist = {

  // ==========================================
  // CREATE WISHLIST
  // ==========================================

  async create({
    userId,
    name = "My Wishlist",
    isDefault = true
  }) {
    const query = `
      INSERT INTO wishlists (
        user_id,
        name,
        is_default
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [
      userId,
      name,
      isDefault
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },


  // ==========================================
  // FIND WISHLIST BY ID
  // ==========================================

  async findById(id) {
    const query = `
      SELECT *
      FROM wishlists
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },


  // ==========================================
  // FIND WISHLISTS BY USER
  // ==========================================

  async findByUserId(userId) {
    const query = `
      SELECT *
      FROM wishlists
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);

    return rows;
  },


  // ==========================================
  // FIND DEFAULT WISHLIST
  // ==========================================

  async findDefaultByUserId(userId) {
    const query = `
      SELECT *
      FROM wishlists
      WHERE user_id = $1
        AND is_default = TRUE
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [userId]);

    return rows[0] || null;
  },


  // ==========================================
  // ADD ITEM TO WISHLIST
  // ==========================================

  async addItem(wishlistId, productVariantId) {
    const query = `
      INSERT INTO wishlist_items (
        wishlist_id,
        product_variant_id
      )
      VALUES ($1, $2)

      ON CONFLICT (
        wishlist_id,
        product_variant_id
      )

      DO NOTHING

      RETURNING *
    `;

    const values = [
      wishlistId,
      productVariantId
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },


  // ==========================================
  // FIND WISHLIST ITEM
  // ==========================================

  async findItem(wishlistItemId) {
    const query = `
      SELECT *
      FROM wishlist_items
      WHERE id = $1
    `;

    const { rows } = await pool.query(
      query,
      [wishlistItemId]
    );

    return rows[0] || null;
  },


  // ==========================================
  // GET WISHLIST ITEMS
  // ==========================================

  async findItems(wishlistId) {
    const query = `
      SELECT
        wi.id,
        wi.wishlist_id,
        wi.product_variant_id,
        wi.created_at,
        wi.updated_at,

        pv.sku,
        pv.name AS variant_name,
        pv.color,
        pv.material,
        pv.size,
        pv.price,
        pv.discount_price,
        pv.image_url,

        p.id AS product_id,
        p.name AS product_name,
        p.slug AS product_slug

      FROM wishlist_items wi

      JOIN product_variants pv
        ON pv.id = wi.product_variant_id

      JOIN products p
        ON p.id = pv.product_id

      WHERE wi.wishlist_id = $1

      ORDER BY wi.created_at DESC
    `;

    const { rows } = await pool.query(
      query,
      [wishlistId]
    );

    return rows;
  },


  // ==========================================
  // GET WISHLIST WITH ITEMS
  // ==========================================

  async findWithItems(wishlistId) {
    const wishlist = await this.findById(wishlistId);

    if (!wishlist) {
      return null;
    }

    const items = await this.findItems(wishlistId);

    return {
      ...wishlist,
      items
    };
  },


  // ==========================================
  // REMOVE ITEM
  // ==========================================

  async removeItem(wishlistItemId) {
    const query = `
      DELETE FROM wishlist_items
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [wishlistItemId]
    );

    return rows[0] || null;
  },


  // ==========================================
  // REMOVE PRODUCT VARIANT
  // ==========================================

  async removeProductVariant(
    wishlistId,
    productVariantId
  ) {
    const query = `
      DELETE FROM wishlist_items
      WHERE wishlist_id = $1
        AND product_variant_id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [
        wishlistId,
        productVariantId
      ]
    );

    return rows[0] || null;
  },


  // ==========================================
  // CHECK IF ITEM EXISTS
  // ==========================================

  async hasItem(
    wishlistId,
    productVariantId
  ) {
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM wishlist_items
        WHERE wishlist_id = $1
          AND product_variant_id = $2
      ) AS exists
    `;

    const { rows } = await pool.query(
      query,
      [
        wishlistId,
        productVariantId
      ]
    );

    return rows[0].exists;
  },


  // ==========================================
  // CLEAR WISHLIST
  // ==========================================

  async clear(wishlistId) {
    const query = `
      DELETE FROM wishlist_items
      WHERE wishlist_id = $1
    `;

    await pool.query(query, [wishlistId]);

    return true;
  },


  // ==========================================
  // UPDATE WISHLIST
  // ==========================================

  async update(id, {
    name,
    isDefault
  }) {
    const query = `
      UPDATE wishlists
      SET
        name = COALESCE($1, name),
        is_default = COALESCE($2, is_default),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const values = [
      name ?? null,
      isDefault ?? null,
      id
    ];

    const { rows } = await pool.query(
      query,
      values
    );

    return rows[0] || null;
  },


  // ==========================================
  // DELETE WISHLIST
  // ==========================================

  async delete(id) {
    const query = `
      DELETE FROM wishlists
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(
      query,
      [id]
    );

    return rows[0] || null;
  }

};

export default Wishlist;