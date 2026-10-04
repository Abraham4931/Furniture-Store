// models/Payment.js

import pool from "../config/db.js";

const Payment = {

  // ==========================================
  // CREATE PAYMENT
  // ==========================================

  async create({
    orderId,
    paymentMethod,
    transactionId = null,
    amount,
    currency = "ETB",
    status = "pending",
    providerReference = null,
    failureReason = null,
    paidAt = null
  }) {
    const query = `
      INSERT INTO payments (
        order_id,
        payment_method,
        transaction_id,
        amount,
        currency,
        status,
        provider_reference,
        failure_reason,
        paid_at
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9
      )
      RETURNING *
    `;

    const values = [
      orderId,
      paymentMethod,
      transactionId,
      amount,
      currency,
      status,
      providerReference,
      failureReason,
      paidAt
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },


  // ==========================================
  // FIND PAYMENT BY ID
  // ==========================================

  async findById(id) {
    const query = `
      SELECT *
      FROM payments
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },


  // ==========================================
  // FIND PAYMENTS BY ORDER
  // ==========================================

  async findByOrderId(orderId) {
    const query = `
      SELECT *
      FROM payments
      WHERE order_id = $1
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query, [orderId]);

    return rows;
  },


  // ==========================================
  // FIND PAYMENT BY TRANSACTION ID
  // ==========================================

  async findByTransactionId(transactionId) {
    const query = `
      SELECT *
      FROM payments
      WHERE transaction_id = $1
      LIMIT 1
    `;

    const { rows } = await pool.query(
      query,
      [transactionId]
    );

    return rows[0] || null;
  },


  // ==========================================
  // UPDATE PAYMENT
  // ==========================================

  async update(id, {
    paymentMethod,
    transactionId,
    amount,
    currency,
    status,
    providerReference,
    failureReason,
    paidAt
  }) {
    const query = `
      UPDATE payments
      SET
        payment_method = COALESCE($1, payment_method),
        transaction_id = COALESCE($2, transaction_id),
        amount = COALESCE($3, amount),
        currency = COALESCE($4, currency),
        status = COALESCE($5, status),
        provider_reference = COALESCE($6, provider_reference),
        failure_reason = COALESCE($7, failure_reason),
        paid_at = COALESCE($8, paid_at),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      paymentMethod ?? null,
      transactionId ?? null,
      amount ?? null,
      currency ?? null,
      status ?? null,
      providerReference ?? null,
      failureReason ?? null,
      paidAt ?? null,
      id
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },


  // ==========================================
  // UPDATE PAYMENT STATUS
  // ==========================================

  async updateStatus(id, status) {
    const query = `
      UPDATE payments
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


  // ==========================================
  // MARK PAYMENT AS PAID
  // ==========================================

  async markAsPaid(id, transactionId = null) {
    const query = `
      UPDATE payments
      SET
        status = 'completed',
        transaction_id = COALESCE($1, transaction_id),
        paid_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [transactionId, id]
    );

    return rows[0] || null;
  },


  // ==========================================
  // MARK PAYMENT AS FAILED
  // ==========================================

  async markAsFailed(id, failureReason = null) {
    const query = `
      UPDATE payments
      SET
        status = 'failed',
        failure_reason = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const { rows } = await pool.query(
      query,
      [failureReason, id]
    );

    return rows[0] || null;
  },


  // ==========================================
  // DELETE PAYMENT
  // ==========================================

  async delete(id) {
    const query = `
      DELETE FROM payments
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

export default Payment;