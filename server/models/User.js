import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const User = {
  // Create a new user
  async create({
    name,
    email,
    password,
    isAdmin = false,
    address = {},
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12
      )
      RETURNING
        id,
        name,
        email,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone,
        created_at,
        updated_at
    `;

    const values = [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      isAdmin,
      address.fullName || null,
      address.line1 || null,
      address.line2 || null,
      address.city || null,
      address.region || null,
      address.postalCode || null,
      address.country || null,
      address.phone || null,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // Find user by ID
  async findById(id) {
    const query = `
      SELECT
        id,
        name,
        email,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // Find user by email
  // Includes password because login needs it
  async findByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = $1
    `;

    const { rows } = await pool.query(query, [
      email.toLowerCase().trim(),
    ]);

    return rows[0] || null;
  },

  // Check password
  async matchPassword(user, enteredPassword) {
    return bcrypt.compare(enteredPassword, user.password);
  },

  // Update user
  async update(id, data) {
    const {
      name,
      email,
      address = {},
    } = data;

    const query = `
      UPDATE users
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        address_full_name = $3,
        address_line1 = $4,
        address_line2 = $5,
        address_city = $6,
        address_region = $7,
        address_postal_code = $8,
        address_country = $9,
        address_phone = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING
        id,
        name,
        email,
        is_admin,
        address_full_name,
        address_line1,
        address_line2,
        address_city,
        address_region,
        address_postal_code,
        address_country,
        address_phone,
        created_at,
        updated_at
    `;

    const values = [
      name?.trim() || null,
      email?.toLowerCase().trim() || null,
      address.fullName || null,
      address.line1 || null,
      address.line2 || null,
      address.city || null,
      address.region || null,
      address.postalCode || null,
      address.country || null,
      address.phone || null,
      id,
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },
};

export default User;