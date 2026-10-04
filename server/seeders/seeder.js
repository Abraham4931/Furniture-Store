import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

dotenv.config();

const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const importData = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Starting database seed...");

    // ============================================================
    // 1. CLEAR EXISTING DATA
    // ============================================================
    //
    // Development seeder only.
    // CASCADE removes dependent records in the correct order.
    //
    await client.query(`
      TRUNCATE TABLE
        room_design_items,
        room_designs,
        product_3d_models,
        inventory,
        shipments,
        payments,
        order_items,
        orders,
        addresses,
        wishlist_items,
        wishlists,
        cart_items,
        carts,
        reviews,
        product_images,
        product_variants,
        products,
        materials,
        colors,
        categories,
        users
      RESTART IDENTITY CASCADE
    `);

    console.log("Existing data cleared.");

    // ============================================================
    // 2. USERS
    // ============================================================

    const adminPassword = await bcrypt.hash("admin1234", 10);
    const shopperPassword = await bcrypt.hash("shopper1234", 10);

    const adminResult = await client.query(
      `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [
        "Store Admin",
        "admin@furniture.com",
        adminPassword,
        true
      ]
    );

    const admin = adminResult.rows[0];

    const shopperResult = await client.query(
      `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [
        "Demo Shopper",
        "shopper@example.com",
        shopperPassword,
        false
      ]
    );

    const shopper = shopperResult.rows[0];

    console.log("Users seeded.");

    // ============================================================
    // 3. CATEGORIES
    // ============================================================

    const categoriesData = [
      {
        name: "Sofas & Couches",
        description:
          "Living room seating, from compact loveseats to modular sectionals."
      },
      {
        name: "Chairs",
        description:
          "Accent, dining and lounge chairs."
      },
      {
        name: "Tables",
        description:
          "Dining, coffee and side tables."
      },
      {
        name: "Beds",
        description:
          "Bed frames and headboards for every bedroom."
      },
      {
        name: "Storage",
        description:
          "Wardrobes, sideboards and shelving."
      },
      {
        name: "Lighting",
        description:
          "Floor, table and pendant lighting."
      },
      {
        name: "Desks",
        description:
          "Desks for home offices, study rooms and professional workspaces."
      },
      {
        name: "Outdoor Furniture",
        description:
          "Furniture designed for gardens, patios and outdoor spaces."
      }
    ];

    const categories = {};

    for (const category of categoriesData) {
      const result = await client.query(
        `
          INSERT INTO categories (
            name,
            slug,
            description,
            image
          )
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        [
          category.name,
          toSlug(category.name),
          category.description,
          ""
        ]
      );

      categories[category.name] = result.rows[0];
    }

    console.log("Categories seeded.");

    // ============================================================
    // 4. MATERIALS
    // ============================================================

    const materialsData = [
      ["Wood", "wood", "Natural and engineered wood"],
      ["Leather", "leather", "Genuine or synthetic leather"],
      ["Metal", "metal", "Steel, aluminum, and other metals"],
      ["Glass", "glass", "Tempered or regular glass"],
      ["Fabric", "fabric", "Upholstery and textile materials"],
      ["Rattan", "rattan", "Natural woven rattan material"],
      ["Velvet", "velvet", "Soft velvet upholstery material"]
    ];

    const materials = {};

    for (const [name, slug, description] of materialsData) {
      const result = await client.query(
        `
          INSERT INTO materials (
            name,
            slug,
            description
          )
          VALUES ($1, $2, $3)
          RETURNING *
        `,
        [name, slug, description]
      );

      materials[name] = result.rows[0];
    }

    console.log("Materials seeded.");

    // ============================================================
    // 5. COLORS
    // ============================================================

    const colorsData = [
      ["Black", "black", "#000000"],
      ["Brown", "brown", "#8B4513"],
      ["White", "white", "#FFFFFF"],
      ["Gray", "gray", "#808080"],
      ["Beige", "beige", "#F5F5DC"],
      ["Blue", "blue", "#0000FF"],
      ["Green", "green", "#008000"],
      ["Red", "red", "#FF0000"],
      ["Natural", "natural", "#D2B48C"],
      ["Walnut", "walnut", "#5C4033"]
    ];

    const colors = {};

    for (const [name, slug, hexCode] of colorsData) {
      const result = await client.query(
        `
          INSERT INTO colors (
            name,
            slug,
            hex_code
          )
          VALUES ($1, $2, $3)
          RETURNING *
        `,
        [name, slug, hexCode]
      );

      colors[name] = result.rows[0];
    }

    console.log("Colors seeded.");

    // ============================================================
    // 6. PRODUCTS
    // ============================================================

    const productsData = [
      {
        name: "Harlow Three-Seat Sofa",
        description:
          "A deep-seated three-seat sofa in boucle upholstery over a solid oak frame.",
        category: "Sofas & Couches",
        brand: "Studio Oak",
        material: "Fabric",
        color: "Beige",
        width: 220,
        height: 85,
        depth: 95,
        price: 65000,
        discountPrice: 60000,
        stock: 10,
        featured: true,
        tags: ["sofa", "living-room", "modern"],
        image: "/images/products/harlow-sofa.jpg"
      },

      {
        name: "Marrow Modular Sectional",
        description:
          "A configurable sectional sofa with reversible chaise, built for comfortable evenings.",
        category: "Sofas & Couches",
        brand: "Studio Oak",
        material: "Fabric",
        color: "Gray",
        width: 280,
        height: 85,
        depth: 180,
        price: 85000,
        discountPrice: 79000,
        stock: 8,
        featured: true,
        tags: ["sofa", "sectional", "living-room"],
        image: "/images/products/marrow-sectional.jpg"
      },

      {
        name: "Linden Leather Loveseat",
        description:
          "A two-seat leather sofa with a low, tapered walnut base.",
        category: "Sofas & Couches",
        brand: "Studio Oak",
        material: "Leather",
        color: "Brown",
        width: 180,
        height: 85,
        depth: 90,
        price: 72000,
        discountPrice: 0,
        stock: 6,
        featured: false,
        tags: ["sofa", "leather", "loveseat"],
        image: "/images/products/linden-loveseat.jpg"
      },

      {
        name: "Amble Lounge Chair",
        description:
          "A sculptural lounge chair in oiled ash with a wool-blend seat cushion.",
        category: "Chairs",
        brand: "Studio Oak",
        material: "Wood",
        color: "Natural",
        width: 75,
        height: 85,
        depth: 80,
        price: 18000,
        discountPrice: 16000,
        stock: 15,
        featured: true,
        tags: ["chair", "lounge", "wood"],
        image: "/images/products/amble-chair.jpg"
      },

      {
        name: "Corbin Dining Chair",
        description:
          "A stackable dining chair with a steam-bent beechwood frame.",
        category: "Chairs",
        brand: "Studio Oak",
        material: "Wood",
        color: "Brown",
        width: 50,
        height: 85,
        depth: 55,
        price: 7500,
        discountPrice: 6500,
        stock: 25,
        featured: false,
        tags: ["chair", "dining", "wood"],
        image: "/images/products/corbin-chair.jpg"
      },

      {
        name: "Reed Accent Chair",
        description:
          "A slim-arm accent chair upholstered in textured linen.",
        category: "Chairs",
        brand: "Studio Oak",
        material: "Fabric",
        color: "Beige",
        width: 70,
        height: 82,
        depth: 75,
        price: 14000,
        discountPrice: 0,
        stock: 12,
        featured: false,
        tags: ["chair", "accent", "linen"],
        image: "/images/products/reed-chair.jpg"
      },

      {
        name: "Fenwick Dining Table",
        description:
          "An extendable dining table in solid walnut, seating six to eight.",
        category: "Tables",
        brand: "Studio Oak",
        material: "Wood",
        color: "Walnut",
        width: 180,
        height: 75,
        depth: 90,
        price: 45000,
        discountPrice: 42000,
        stock: 8,
        featured: true,
        tags: ["table", "dining", "walnut"],
        image: "/images/products/fenwick-table.jpg"
      },

      {
        name: "Norrland Coffee Table",
        description:
          "A low coffee table with a smoked-glass top and blackened steel legs.",
        category: "Tables",
        brand: "Studio Oak",
        material: "Glass",
        color: "Black",
        width: 120,
        height: 45,
        depth: 65,
        price: 22000,
        discountPrice: 19500,
        stock: 10,
        featured: false,
        tags: ["table", "coffee-table", "glass"],
        image: "/images/products/norrland-table.jpg"
      },

      {
        name: "Almo Side Table",
        description:
          "A round side table in solid oak with a hand-finished top.",
        category: "Tables",
        brand: "Studio Oak",
        material: "Wood",
        color: "Natural",
        width: 50,
        height: 55,
        depth: 50,
        price: 9500,
        discountPrice: 0,
        stock: 20,
        featured: false,
        tags: ["table", "side-table", "oak"],
        image: "/images/products/almo-table.jpg"
      },

      {
        name: "Sable Upholstered Bed Frame",
        description:
          "A platform bed frame with a channel-tufted upholstered headboard.",
        category: "Beds",
        brand: "Studio Oak",
        material: "Fabric",
        color: "Gray",
        width: 180,
        height: 110,
        depth: 210,
        price: 55000,
        discountPrice: 50000,
        stock: 7,
        featured: true,
        tags: ["bed", "king", "bedroom"],
        image: "/images/products/sable-bed.jpg"
      },

      {
        name: "Kade Oak Bed Frame",
        description:
          "A minimal solid-oak bed frame with exposed joinery.",
        category: "Beds",
        brand: "Studio Oak",
        material: "Wood",
        color: "Natural",
        width: 160,
        height: 100,
        depth: 200,
        price: 48000,
        discountPrice: 0,
        stock: 6,
        featured: false,
        tags: ["bed", "oak", "bedroom"],
        image: "/images/products/kade-bed.jpg"
      },

      {
        name: "Elm Ridge Sideboard",
        description:
          "A three-door sideboard in rift-cut oak with brass hardware.",
        category: "Storage",
        brand: "Studio Oak",
        material: "Wood",
        color: "Natural",
        width: 160,
        height: 80,
        depth: 45,
        price: 38000,
        discountPrice: 35000,
        stock: 9,
        featured: true,
        tags: ["storage", "sideboard", "oak"],
        image: "/images/products/elm-sideboard.jpg"
      },

      {
        name: "Birch Hollow Wardrobe",
        description:
          "A two-door wardrobe with an internal shelf and hanging rail.",
        category: "Storage",
        brand: "Studio Oak",
        material: "Wood",
        color: "White",
        width: 120,
        height: 200,
        depth: 60,
        price: 52000,
        discountPrice: 48000,
        stock: 5,
        featured: false,
        tags: ["wardrobe", "storage", "bedroom"],
        image: "/images/products/birch-wardrobe.jpg"
      },

      {
        name: "Aster Floor Lamp",
        description:
          "A tripod floor lamp in blackened steel with a linen shade.",
        category: "Lighting",
        brand: "Studio Oak",
        material: "Metal",
        color: "Black",
        width: 45,
        height: 160,
        depth: 45,
        price: 12000,
        discountPrice: 10000,
        stock: 18,
        featured: false,
        tags: ["lighting", "floor-lamp", "modern"],
        image: "/images/products/aster-lamp.jpg"
      },

      {
        name: "Hollow Pendant Light",
        description:
          "A hand-blown glass pendant light with a brass ceiling rose.",
        category: "Lighting",
        brand: "Studio Oak",
        material: "Glass",
        color: "White",
        width: 35,
        height: 40,
        depth: 35,
        price: 15000,
        discountPrice: 0,
        stock: 14,
        featured: true,
        tags: ["lighting", "pendant", "glass"],
        image: "/images/products/hollow-pendant.jpg"
      },

      {
        name: "Oak Executive Desk",
        description:
          "A spacious solid-oak desk designed for professional home offices.",
        category: "Desks",
        brand: "Studio Oak",
        material: "Wood",
        color: "Natural",
        width: 160,
        height: 75,
        depth: 80,
        price: 32000,
        discountPrice: 29000,
        stock: 10,
        featured: true,
        tags: ["desk", "office", "oak"],
        image: "/images/products/oak-desk.jpg"
      },

      {
        name: "Modern Outdoor Lounge Set",
        description:
          "A weather-resistant outdoor lounge set for patios and gardens.",
        category: "Outdoor Furniture",
        brand: "Studio Oak",
        material: "Rattan",
        color: "Brown",
        width: 220,
        height: 75,
        depth: 160,
        price: 68000,
        discountPrice: 62000,
        stock: 5,
        featured: true,
        tags: ["outdoor", "patio", "lounge"],
        image: "/images/products/outdoor-lounge.jpg"
      }
    ];

    const products = [];

    for (const product of productsData) {
      const category = categories[product.category];

      const result = await client.query(
        `
          INSERT INTO products (
            name,
            slug,
            description,
            category_id,
            brand,
            material,
            color,
            width,
            height,
            depth,
            dimension_unit,
            images,
            price,
            discount_price,
            count_in_stock,
            rating,
            num_reviews,
            is_featured,
            tags
          )
          VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, $18, $19
          )
          RETURNING *
        `,
        [
          product.name,
          toSlug(product.name),
          product.description,
          category.id,
          product.brand,
          product.material,
          product.color,
          product.width,
          product.height,
          product.depth,
          "cm",
          [product.image],
          product.price,
          product.discountPrice,
          product.stock,
          0,
          0,
          product.featured,
          product.tags
        ]
      );

      products.push({
        ...result.rows[0],
        seedData: product
      });
    }

    console.log(`${products.length} products seeded.`);

    // ============================================================
    // 7. PRODUCT IMAGES
    // ============================================================

    for (const product of products) {
      await client.query(
        `
          INSERT INTO product_images (
            product_id,
            image_url,
            alt_text,
            image_type,
            is_primary,
            sort_order,
            width,
            height,
            mime_type
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          product.id,
          product.seedData.image,
          product.name,
          "product",
          true,
          0,
          1200,
          900,
          "image/jpeg"
        ]
      );

      await client.query(
        `
          INSERT INTO product_images (
            product_id,
            image_url,
            alt_text,
            image_type,
            is_primary,
            sort_order,
            width,
            height,
            mime_type
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          product.id,
          `${product.seedData.image}?view=detail`,
          `${product.name} detail`,
          "detail",
          false,
          1,
          1200,
          900,
          "image/jpeg"
        ]
      );
    }

    console.log("Product images seeded.");

    // ============================================================
    // 8. PRODUCT VARIANTS
    // ============================================================

    const variants = [];

    for (const product of products) {
      const data = product.seedData;

      const variantDefinitions = [
        {
          suffix: "NAT",
          color: data.color,
          material: data.material,
          stock: data.stock,
          image: data.image
        },
        {
          suffix: "BLK",
          color: "Black",
          material: data.material,
          stock: Math.max(2, Math.floor(data.stock / 2)),
          image: data.image
        }
      ];

      for (const variant of variantDefinitions) {
        const sku =
          `${toSlug(product.name).toUpperCase().slice(0, 12)}-${variant.suffix}`;

        const result = await client.query(
          `
            INSERT INTO product_variants (
              product_id,
              sku,
              name,
              color,
              material,
              size,
              width,
              height,
              depth,
              dimension_unit,
              price,
              discount_price,
              count_in_stock,
              image_url,
              is_active
            )
            VALUES (
              $1, $2, $3, $4, $5,
              $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15
            )
            RETURNING *
          `,
          [
            product.id,
            sku,
            `${product.name} - ${variant.color}`,
            variant.color,
            variant.material,
            "Standard",
            data.width,
            data.height,
            data.depth,
            "cm",
            data.price,
            data.discountPrice || null,
            variant.stock,
            variant.image,
            true
          ]
        );

        variants.push(result.rows[0]);
      }
    }

    console.log(`${variants.length} product variants seeded.`);

    // ============================================================
    // 9. INVENTORY
    // ============================================================

    for (const variant of variants) {
      const quantity = variant.count_in_stock;
      const reserved = quantity > 5 ? 1 : 0;

      await client.query(
        `
          INSERT INTO inventory (
            product_variant_id,
            quantity,
            reserved_quantity,
            reorder_level,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5)
        `,
        [
          variant.id,
          quantity,
          reserved,
          3,
          true
        ]
      );
    }

    console.log("Inventory seeded.");

    // ============================================================
    // 10. REVIEWS
    // ============================================================

    const reviewProducts = products.slice(0, 6);

    for (let i = 0; i < reviewProducts.length; i++) {
      const product = reviewProducts[i];

      await client.query(
        `
          INSERT INTO reviews (
            product_id,
            user_id,
            name,
            rating,
            comment
          )
          VALUES ($1, $2, $3, $4, $5)
        `,
        [
          product.id,
          shopper.id,
          shopper.name,
          i % 2 === 0 ? 5 : 4,
          i % 2 === 0
            ? "Excellent furniture. The quality and design are very good."
            : "Good quality and comfortable. I am happy with the purchase."
        ]
      );
    }

    console.log("Reviews seeded.");

    // ============================================================
    // 11. CART
    // ============================================================

    const cartResult = await client.query(
      `
        INSERT INTO carts (
          user_id,
          status
        )
        VALUES ($1, $2)
        RETURNING *
      `,
      [shopper.id, "active"]
    );

    const cart = cartResult.rows[0];

    const cartVariant1 = variants[0];
    const cartVariant2 = variants[4];

    await client.query(
      `
        INSERT INTO cart_items (
          cart_id,
          product_variant_id,
          quantity,
          unit_price
        )
        VALUES
          ($1, $2, $3, $4),
          ($1, $5, $6, $7)
      `,
      [
        cart.id,
        cartVariant1.id,
        1,
        cartVariant1.discount_price || cartVariant1.price,
        cartVariant2.id,
        2,
        cartVariant2.discount_price || cartVariant2.price
      ]
    );

    console.log("Cart seeded.");

    // ============================================================
    // 12. WISHLIST
    // ============================================================

    const wishlistResult = await client.query(
      `
        INSERT INTO wishlists (
          user_id,
          name,
          is_default
        )
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [
        shopper.id,
        "My Wishlist",
        true
      ]
    );

    const wishlist = wishlistResult.rows[0];

    await client.query(
      `
        INSERT INTO wishlist_items (
          wishlist_id,
          product_variant_id
        )
        VALUES
          ($1, $2),
          ($1, $3)
      `,
      [
        wishlist.id,
        variants[2].id,
        variants[6].id
      ]
    );

    console.log("Wishlist seeded.");

    // ============================================================
    // 13. ADDRESSES
    // ============================================================

    const addressResult = await client.query(
      `
        INSERT INTO addresses (
          user_id,
          label,
          full_name,
          phone,
          line1,
          line2,
          city,
          region,
          postal_code,
          country,
          is_default,
          is_active
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12
        )
        RETURNING *
      `,
      [
        shopper.id,
        "Home",
        shopper.name,
        "+251911000000",
        "Bole Main Street",
        null,
        "Addis Ababa",
        "Addis Ababa",
        null,
        "Ethiopia",
        true,
        true
      ]
    );

    const address = addressResult.rows[0];

    await client.query(
      `
        INSERT INTO addresses (
          user_id,
          label,
          full_name,
          phone,
          line1,
          line2,
          city,
          region,
          postal_code,
          country,
          is_default,
          is_active
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12
        )
      `,
      [
        shopper.id,
        "Office",
        shopper.name,
        "+251911000000",
        "Office Building",
        "2nd Floor",
        "Addis Ababa",
        "Addis Ababa",
        null,
        "Ethiopia",
        false,
        true
      ]
    );

    console.log("Addresses seeded.");

    // ============================================================
    // 14. ORDER
    // ============================================================

    const orderVariant1 = variants[0];
    const orderVariant2 = variants[4];

    const price1 =
      Number(orderVariant1.discount_price || orderVariant1.price);

    const price2 =
      Number(orderVariant2.discount_price || orderVariant2.price);

    const qty1 = 1;
    const qty2 = 2;

    const itemsPrice =
      price1 * qty1 +
      price2 * qty2;

    const shippingPrice = 1500;
    const taxPrice = 0;
    const totalPrice =
      itemsPrice +
      shippingPrice +
      taxPrice;

    const orderResult = await client.query(
      `
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
          total_price,
          is_paid,
          paid_at,
          status
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15,
          $16, $17
        )
        RETURNING *
      `,
      [
        shopper.id,
        address.full_name,
        address.line1,
        address.line2,
        address.city,
        address.region,
        address.postal_code,
        address.country,
        address.phone,
        "Cash on Delivery",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        false,
        null,
        "Processing"
      ]
    );

    const order = orderResult.rows[0];

    // ============================================================
    // 15. ORDER ITEMS
    // ============================================================

    await client.query(
      `
        INSERT INTO order_items (
          order_id,
          product_id,
          name,
          image,
          price,
          qty
        )
        VALUES
          ($1, $2, $3, $4, $5, $6),
          ($1, $7, $8, $9, $10, $11)
      `,
      [
        order.id,
        orderVariant1.product_id,
        orderVariant1.name,
        orderVariant1.image_url,
        price1,
        qty1,

        orderVariant2.product_id,
        orderVariant2.name,
        orderVariant2.image_url,
        price2,
        qty2
      ]
    );

    console.log(`Order ${order.id} seeded.`);

    // ============================================================
    // 16. PAYMENT
    // ============================================================

    await client.query(
      `
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
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9
        )
      `,
      [
        order.id,
        "Cash on Delivery",
        null,
        totalPrice,
        "ETB",
        "pending",
        null,
        null,
        null
      ]
    );

    console.log("Payment seeded.");

    // ============================================================
    // 17. SHIPMENT
    // ============================================================

    await client.query(
      `
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
      `,
      [
        order.id,
        `SHIP-${String(order.id).padStart(6, "0")}`,
        "Local Delivery",
        "processing",
        "Standard Delivery",
        "2026-10-07",
        null,
        null,
        address.full_name,
        address.phone,
        address.line1,
        address.line2,
        address.city,
        address.region,
        address.postal_code,
        address.country,
        "Furniture delivery shipment"
      ]
    );

    console.log("Shipment seeded.");

    // ============================================================
    // 18. 3D MODELS
    // ============================================================

    const threeDProducts = products.slice(0, 6);

    for (const product of threeDProducts) {
      await client.query(
        `
          INSERT INTO product_3d_models (
            product_id,
            model_url,
            model_format,
            model_name,
            thumbnail_url,
            file_size,
            is_primary,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          product.id,
          `/models/products/${toSlug(product.name)}.glb`,
          "glb",
          `${product.name} 3D Model`,
          product.seedData.image,
          null,
          true,
          true
        ]
      );
    }

    console.log("3D models seeded.");

    // ============================================================
    // 19. ROOM DESIGN
    // ============================================================

    const roomResult = await client.query(
      `
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
      `,
      [
        shopper.id,
        "My Modern Living Room",
        "living_room",
        500,
        600,
        280,
        "cm",
        "/images/room-designs/living-room.jpg",
        JSON.stringify({
          background: "#f5f5f5",
          floor: "wood",
          wallColor: "#ffffff"
        }),
        false
      ]
    );

    const roomDesign = roomResult.rows[0];

    console.log(`Room design ${roomDesign.id} seeded.`);

    // ============================================================
    // 20. ROOM DESIGN ITEMS
    // ============================================================

    await client.query(
      `
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
          $1, $2,
          $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17
        )
      `,
      [
        roomDesign.id,
        variants[0].id,

        0,
        0,
        0,

        0,
        0,
        0,

        1,
        1,
        1,

        products[0].seedData.width,
        products[0].seedData.height,
        products[0].seedData.depth,

        "cm",
        1,
        false
      ]
    );

    await client.query(
      `
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
          $1, $2,
          $3, $4, $5,
          $6, $7, $8,
          $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17
        )
      `,
      [
        roomDesign.id,
        variants[6].id,

        150,
        0,
        100,

        0,
        45,
        0,

        1,
        1,
        1,

        products[3].seedData.width,
        products[3].seedData.height,
        products[3].seedData.depth,

        "cm",
        1,
        false
      ]
    );

    console.log("Room design items seeded.");

    // ============================================================
    // 21. UPDATE PRODUCT RATINGS
    // ============================================================

    await client.query(`
      UPDATE products p
      SET
        rating = COALESCE(
          (
            SELECT ROUND(AVG(r.rating)::numeric, 2)
            FROM reviews r
            WHERE r.product_id = p.id
          ),
          0
        ),
        num_reviews = (
          SELECT COUNT(*)
          FROM reviews r
          WHERE r.product_id = p.id
        ),
        updated_at = CURRENT_TIMESTAMP
    `);

    // ============================================================
    // COMMIT
    // ============================================================

    await client.query("COMMIT");

    console.log("");
    console.log("========================================");
    console.log("DATABASE SEED COMPLETED SUCCESSFULLY");
    console.log("========================================");
    console.log("");
    console.log(`Admin ID: ${admin.id}`);
    console.log(`Admin email: ${admin.email}`);
    console.log("Admin password: admin1234");
    console.log("");
    console.log(`Shopper ID: ${shopper.id}`);
    console.log(`Shopper email: ${shopper.email}`);
    console.log("Shopper password: shopper1234");
    console.log("");
    console.log(`Order ID: ${order.id}`);
    console.log(`Room Design ID: ${roomDesign.id}`);
    console.log("");
    console.log("All related records were created using real IDs.");
    console.log("");

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("");
    console.error("========================================");
    console.error("DATABASE SEED FAILED");
    console.error("========================================");
    console.error(error);
    console.error("");

    process.exitCode = 1;

  } finally {
    client.release();
    await pool.end();
  }
};

// ================================================================
// DESTROY DATA
// ================================================================

const destroyData = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      TRUNCATE TABLE
        room_design_items,
        room_designs,
        product_3d_models,
        inventory,
        shipments,
        payments,
        order_items,
        orders,
        addresses,
        wishlist_items,
        wishlists,
        cart_items,
        carts,
        reviews,
        product_images,
        product_variants,
        products,
        materials,
        colors,
        categories,
        users
      RESTART IDENTITY CASCADE
    `);

    await client.query("COMMIT");

    console.log("All seed data destroyed.");

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      `Error destroying data: ${error.message}`
    );

    process.exitCode = 1;

  } finally {
    client.release();
    await pool.end();
  }
};

// ================================================================
// RUN
// ================================================================

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}