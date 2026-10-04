import pool from "../config/db.js";

const Shipment = {
  async create({
    orderId,
    trackingNumber = null,
    carrier = null,
    status = "pending",
    shippingMethod = null,
    estimatedDeliveryDate = null,
    shippedAt = null,
    deliveredAt = null,
    recipientName = null,
    recipientPhone = null,
    shippingAddressLine1 = null,
    shippingAddressLine2 = null,
    shippingCity = null,
    shippingRegion = null,
    shippingPostalCode = null,
    shippingCountry = null,
    notes = null
  }) {
    const query = `
      INSERT INTO shipments (
        order_id,
        tracking_number,
        carrier,
        status,
        shipping_method,
        estimated_delivery_date,
        shipped_at,
        delivered_at,
        recipient_name,
        recipient_phone,
        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_region,
        shipping_postal_code,
        shipping_country,
        notes
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17
      )
      RETURNING *
    `;

    const values = [
      orderId,
      trackingNumber,
      carrier,
      status,
      shippingMethod,
      estimatedDeliveryDate,
      shippedAt,
      deliveredAt,
      recipientName,
      recipientPhone,
      shippingAddressLine1,
      shippingAddressLine2,
      shippingCity,
      shippingRegion,
      shippingPostalCode,
      shippingCountry,
      notes
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  async findById(id) {
    const query = `
      SELECT *
      FROM shipments
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  async findByOrderId(orderId) {
    const query = `
      SELECT *
      FROM shipments
      WHERE order_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [orderId]);

    return rows;
  },

  async findByTrackingNumber(trackingNumber) {
    const query = `
      SELECT *
      FROM shipments
      WHERE tracking_number = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(
      query,
      [trackingNumber]
    );

    return rows[0] || null;
  },

  async findAll() {
    const query = `
      SELECT *
      FROM shipments
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  async update(id, {
    trackingNumber,
    carrier,
    status,
    shippingMethod,
    estimatedDeliveryDate,
    shippedAt,
    deliveredAt,
    recipientName,
    recipientPhone,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingRegion,
    shippingPostalCode,
    shippingCountry,
    notes
  }) {
    const query = `
      UPDATE shipments
      SET
        tracking_number = COALESCE($1, tracking_number),
        carrier = COALESCE($2, carrier),
        status = COALESCE($3, status),
        shipping_method = COALESCE($4, shipping_method),
        estimated_delivery_date = COALESCE($5, estimated_delivery_date),
        shipped_at = COALESCE($6, shipped_at),
        delivered_at = COALESCE($7, delivered_at),
        recipient_name = COALESCE($8, recipient_name),
        recipient_phone = COALESCE($9, recipient_phone),
        shipping_address_line1 = COALESCE($10, shipping_address_line1),
        shipping_address_line2 = COALESCE($11, shipping_address_line2),
        shipping_city = COALESCE($12, shipping_city),
        shipping_region = COALESCE($13, shipping_region),
        shipping_postal_code = COALESCE($14, shipping_postal_code),
        shipping_country = COALESCE($15, shipping_country),
        notes = COALESCE($16, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *
    `;

    const values = [
      trackingNumber ?? null,
      carrier ?? null,
      status ?? null,
      shippingMethod ?? null,
      estimatedDeliveryDate ?? null,
      shippedAt ?? null,
      deliveredAt ?? null,
      recipientName ?? null,
      recipientPhone ?? null,
      shippingAddressLine1 ?? null,
      shippingAddressLine2 ?? null,
      shippingCity ?? null,
      shippingRegion ?? null,
      shippingPostalCode ?? null,
      shippingCountry ?? null,
      notes ?? null,
      id
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  async updateStatus(id, status) {
    const query = `
      UPDATE shipments
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [status, id]
    );

    return rows[0] || null;
  },

  async markAsShipped(id) {
    const query = `
      UPDATE shipments
      SET
        status = 'shipped',
        shipped_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  async markAsDelivered(id) {
    const query = `
      UPDATE shipments
      SET
        status = 'delivered',
        delivered_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  async delete(id) {
    const query = `
      DELETE FROM shipments
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  }
};

export default Shipment;