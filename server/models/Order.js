import pool from "../config/db.js";

const Order = {
  // Create an order
  async create({
    userId,
    items,
    shippingAddress,
    paymentMethod = "Cash on Delivery",
    itemsPrice = 0,
    shippingPrice = 0,
    taxPrice = 0,
    totalPrice = 0,
  }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Create order
      const orderQuery = `
        INSERT INTO orders (
          user_id,
          shipping_full_name,
          shipping_line1,
          shipping_line2,
          shipping_city,
          shipping_region,
          shipping_postal_code,
          shipping_country,
          shipping_phone,
          payment_method,
          items_price,
          shipping_price,
          tax_price,
          total_price
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14
        )
        RETURNING *
      `;

      const orderValues = [
        userId,
        shippingAddress.fullName,
        shippingAddress.line1,
        shippingAddress.line2 || null,
        shippingAddress.city,
        shippingAddress.region || null,
        shippingAddress.postalCode || null,
        shippingAddress.country,
        shippingAddress.phone,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      ];

      const orderResult = await client.query(
        orderQuery,
        orderValues
      );

      const order = orderResult.rows[0];

      // Insert order items
      for (const item of items) {
        const itemQuery = `
          INSERT INTO order_items (
            order_id,
            product_id,
            name,
            image,
            price,
            qty
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await client.query(itemQuery, [
          order.id,
          item.productId,
          item.name,
          item.image || null,
          item.price,
          item.qty,
        ]);
      }

      await client.query("COMMIT");

      return await this.findById(order.id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Get order by ID
  async findById(id) {
    const orderQuery = `
      SELECT *
      FROM orders
      WHERE id = $1
    `;

    const orderResult = await pool.query(
      orderQuery,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];

    const itemsQuery = `
      SELECT
        oi.id,
        oi.product_id,
        oi.name,
        oi.image,
        oi.price,
        oi.qty
      FROM order_items oi
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `;

    const itemsResult = await pool.query(
      itemsQuery,
      [id]
    );

    return {
      ...order,
      items: itemsResult.rows,
    };
  },

  // Get orders for a user
  async findByUser(userId) {
    const query = `
      SELECT *
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [
      userId,
    ]);

    return rows;
  },

  // Get all orders
  async findAll() {
    const query = `
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // Mark order as paid
  async markAsPaid(id) {
    const query = `
      UPDATE orders
      SET
        is_paid = TRUE,
        paid_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // Update order status
  async updateStatus(id, status) {
    const deliveredAt =
      status === "Delivered"
        ? new Date()
        : null;

    const query = `
      UPDATE orders
      SET
        status = $1,
        delivered_at = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      status,
      deliveredAt,
      id,
    ]);

    return rows[0] || null;
  },

  // Delete order
  async delete(id) {
    const query = `
      DELETE FROM orders
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },
};

export default Order;