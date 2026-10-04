import pool from "../config/db.js";

const RoomDesign = {
  // Create a room design
  async create({
    userId,
    name,
    roomType = "living_room",
    width = null,
    length = null,
    height = null,
    dimensionUnit = "cm",
    thumbnailUrl = null,
    designData = {},
    isPublic = false
  }) {
    const query = `
      INSERT INTO room_designs (
        user_id,
        name,
        room_type,
        width,
        length,
        height,
        dimension_unit,
        thumbnail_url,
        design_data,
        is_public
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10
      )
      RETURNING *
    `;

    const values = [
      userId,
      name,
      roomType,
      width,
      length,
      height,
      dimensionUnit,
      thumbnailUrl,
      designData,
      isPublic
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // Find design by ID
  async findById(id) {
    const query = `
      SELECT *
      FROM room_designs
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  },

  // Find all designs belonging to a user
  async findByUserId(userId) {
    const query = `
      SELECT *
      FROM room_designs
      WHERE user_id = $1
      ORDER BY updated_at DESC
    `;

    const { rows } = await pool.query(query, [userId]);

    return rows;
  },

  // Find public designs
  async findPublic() {
    const query = `
      SELECT *
      FROM room_designs
      WHERE is_public = TRUE
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return rows;
  },

  // Add furniture to a room design
  async addItem({
    roomDesignId,
    productVariantId,
    positionX = 0,
    positionY = 0,
    positionZ = 0,
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
    scaleX = 1,
    scaleY = 1,
    scaleZ = 1,
    width = null,
    height = null,
    depth = null,
    dimensionUnit = "cm",
    quantity = 1,
    isLocked = false
  }) {
    const query = `
      INSERT INTO room_design_items (
        room_design_id,
        product_variant_id,
        position_x,
        position_y,
        position_z,
        rotation_x,
        rotation_y,
        rotation_z,
        scale_x,
        scale_y,
        scale_z,
        width,
        height,
        depth,
        dimension_unit,
        quantity,
        is_locked
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
      roomDesignId,
      productVariantId,
      positionX,
      positionY,
      positionZ,
      rotationX,
      rotationY,
      rotationZ,
      scaleX,
      scaleY,
      scaleZ,
      width,
      height,
      depth,
      dimensionUnit,
      quantity,
      isLocked
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  // Get furniture inside a design
  async findItems(roomDesignId) {
    const query = `
      SELECT
        rdi.*,

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

      FROM room_design_items rdi

      JOIN product_variants pv
        ON pv.id = rdi.product_variant_id

      JOIN products p
        ON p.id = pv.product_id

      WHERE rdi.room_design_id = $1

      ORDER BY rdi.created_at ASC
    `;

    const { rows } = await pool.query(
      query,
      [roomDesignId]
    );

    return rows;
  },

  // Get design together with its furniture
  async findWithItems(roomDesignId) {
    const design = await this.findById(roomDesignId);

    if (!design) {
      return null;
    }

    const items = await this.findItems(roomDesignId);

    return {
      ...design,
      items
    };
  },

  // Update room design
  async update(id, {
    name,
    roomType,
    width,
    length,
    height,
    dimensionUnit,
    thumbnailUrl,
    designData,
    isPublic
  }) {
    const query = `
      UPDATE room_designs
      SET
        name = COALESCE($1, name),
        room_type = COALESCE($2, room_type),
        width = COALESCE($3, width),
        length = COALESCE($4, length),
        height = COALESCE($5, height),
        dimension_unit = COALESCE($6, dimension_unit),
        thumbnail_url = COALESCE($7, thumbnail_url),
        design_data = COALESCE($8, design_data),
        is_public = COALESCE($9, is_public),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;

    const values = [
      name ?? null,
      roomType ?? null,
      width ?? null,
      length ?? null,
      height ?? null,
      dimensionUnit ?? null,
      thumbnailUrl ?? null,
      designData ?? null,
      isPublic ?? null,
      id
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // Update furniture position/rotation/scale
  async updateItem(itemId, {
    positionX,
    positionY,
    positionZ,
    rotationX,
    rotationY,
    rotationZ,
    scaleX,
    scaleY,
    scaleZ,
    width,
    height,
    depth,
    quantity,
    isLocked
  }) {
    const query = `
      UPDATE room_design_items
      SET
        position_x = COALESCE($1, position_x),
        position_y = COALESCE($2, position_y),
        position_z = COALESCE($3, position_z),
        rotation_x = COALESCE($4, rotation_x),
        rotation_y = COALESCE($5, rotation_y),
        rotation_z = COALESCE($6, rotation_z),
        scale_x = COALESCE($7, scale_x),
        scale_y = COALESCE($8, scale_y),
        scale_z = COALESCE($9, scale_z),
        width = COALESCE($10, width),
        height = COALESCE($11, height),
        depth = COALESCE($12, depth),
        quantity = COALESCE($13, quantity),
        is_locked = COALESCE($14, is_locked),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *
    `;

    const values = [
      positionX ?? null,
      positionY ?? null,
      positionZ ?? null,
      rotationX ?? null,
      rotationY ?? null,
      rotationZ ?? null,
      scaleX ?? null,
      scaleY ?? null,
      scaleZ ?? null,
      width ?? null,
      height ?? null,
      depth ?? null,
      quantity ?? null,
      isLocked ?? null,
      itemId
    ];

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
  },

  // Remove furniture from design
  async removeItem(itemId) {
    const query = `
      DELETE FROM room_design_items
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [itemId]);

    return rows[0] || null;
  },

  // Delete complete design
  async delete(id) {
    const query = `
      DELETE FROM room_designs
      WHERE id = $1
      RETURNING id
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
  }
};

export default RoomDesign;