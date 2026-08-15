import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Review from "./models/Review.js";

dotenv.config();
await connectDB();

const toSlug = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const categoriesData = [
  { name: "Sofas & Couches", description: "Living room seating, from compact loveseats to modular sectionals." },
  { name: "Chairs", description: "Accent, dining and lounge chairs." },
  { name: "Tables", description: "Dining, coffee and side tables." },
  { name: "Beds", description: "Bed frames and headboards for every bedroom." },
  { name: "Storage", description: "Wardrobes, sideboards and shelving." },
  { name: "Lighting", description: "Floor, table and pendant lighting." },
];

const productNames = {
  "Sofas & Couches": [
    ["Harlow Three-Seat Sofa", "A deep-seated three-seat sofa in boucle upholstery over a solid oak frame."],
    ["Marrow Modular Sectional", "A configurable sectional sofa with reversible chaise, built for slow evenings."],
    ["Linden Leather Loveseat", "A two-seat leather sofa with a low, tapered walnut base."],
  ],
  Chairs: [
    ["Amble Lounge Chair", "A sculptural lounge chair in oiled ash with a wool-blend seat cushion."],
    ["Corbin Dining Chair", "A stackable dining chair with a steam-bent beechwood frame."],
    ["Reed Accent Chair", "A slim-arm accent chair upholstered in textured linen."],
  ],
  Tables: [
    ["Fenwick Dining Table", "An extendable dining table in solid walnut, seats six to eight."],
    ["Norrland Coffee Table", "A low coffee table with a smoked-glass top and blackened steel legs."],
    ["Almo Side Table", "A round side table in solid oak with a hand-finished top."],
  ],
  Beds: [
    ["Sable Upholstered Bed Frame", "A platform bed frame with a channel-tufted upholstered headboard."],
    ["Kade Oak Bed Frame", "A minimal solid-oak bed frame with exposed joinery."],
  ],
  Storage: [
    ["Elm Ridge Sideboard", "A three-door sideboard in rift-cut oak with brass hardware."],
    ["Birch Hollow Wardrobe", "A two-door wardrobe with an internal shelf and hanging rail."],
  ],
  Lighting: [
    ["Aster Floor Lamp", "A tripod floor lamp in blackened steel with a linen shade."],
    ["Hollow Pendant Light", "A hand-blown glass pendant light with a brass ceiling rose."],
  ],
};

const images = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: "Store Admin",
      email: "admin@furniture.com",
      password: "admin1234",
      isAdmin: true,
    });

    const demoUser = await User.create({
      name: "Demo Shopper",
      email: "shopper@example.com",
      password: "shopper1234",
    });

    const createdCategories = await Category.insertMany(
      categoriesData.map((c) => ({ ...c, slug: toSlug(c.name) }))
    );

    const products = [];
    let counter = 0;
    for (const cat of createdCategories) {
      const items = productNames[cat.name] || [];
      for (const [name, description] of items) {
        counter += 1;
        const price = 150 + ((counter * 73) % 950);
        const onSale = counter % 3 === 0;
        products.push({
          name,
          slug: toSlug(name),
          description,
          category: cat._id,
          brand: "Studio Oak",
          material: ["Oak", "Walnut", "Ash", "Linen", "Steel"][counter % 5],
          color: ["Natural", "Charcoal", "Sand", "Walnut", "Black"][counter % 5],
          dimensions: { width: 80 + (counter % 5) * 10, height: 70 + (counter % 4) * 5, depth: 60 + (counter % 3) * 8, unit: "cm" },
          images: [images[counter % images.length], images[(counter + 1) % images.length]],
          price,
          discountPrice: onSale ? Math.round(price * 0.85) : 0,
          countInStock: 5 + (counter % 20),
          isFeatured: counter % 4 === 0,
          tags: [cat.name.toLowerCase(), "furniture"],
        });
      }
    }

    await Product.insertMany(products);

    console.log("Data imported successfully");
    console.log(`Admin login -> email: ${admin.email} / password: admin1234`);
    console.log(`Shopper login -> email: ${demoUser.email} / password: shopper1234`);
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
