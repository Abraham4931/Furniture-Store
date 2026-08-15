import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: [true, "Description is required"] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, default: "" },
    material: { type: String, default: "" },
    color: { type: String, default: "" },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: { type: String, default: "cm" },
    },
    images: {
      type: [String],
      validate: [(arr) => arr.length > 0, "At least one image is required"],
    },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    countInStock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.model("Product", productSchema);
