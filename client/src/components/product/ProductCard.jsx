import { Link } from "react-router-dom";
import Button from "../common/Button";

const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;

  const {
    id,
    name,
    slug,
    price,
    discount_price,
    image_url,
    rating,
    review_count,
    count_in_stock,
    category,
  } = product;

  const productImage =
    image_url || "https://via.placeholder.com/600x600?text=Fernwood";

  const hasDiscount =
    discount_price !== null &&
    discount_price !== undefined &&
    Number(discount_price) < Number(price);

  const displayPrice = hasDiscount
    ? discount_price
    : price;

  const formattedPrice = Number(displayPrice || 0).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  const formattedOriginalPrice = Number(price || 0).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  const productLink = slug
    ? `/products/${slug}`
    : `/products/${id}`;

  const isOutOfStock =
    count_in_stock !== undefined &&
    Number(count_in_stock) <= 0;

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Product Image */}
      <Link
        to={productLink}
        className="
          relative
          block
          aspect-square
          overflow-hidden
          bg-[#F8F5EF]
        "
      >
        <img
          src={productImage}
          alt={name || "Furniture product"}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              bg-[#031008]
              px-3
              py-1
              text-xs
              font-semibold
              text-white
            "
          >
            Sale
          </span>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <span
            className="
              absolute
              right-3
              top-3
              rounded-full
              bg-red-600
              px-3
              py-1
              text-xs
              font-semibold
              text-white
            "
          >
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-4">

        {/* Category */}
        {category && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            {typeof category === "object"
              ? category.name
              : category}
          </p>
        )}

        {/* Product Name */}
        <Link to={productLink}>
          <h3
            className="
              line-clamp-2
              min-h-[3rem]
              text-base
              font-semibold
              text-[#031008]
              transition-colors
              hover:text-[#33473B]
            "
          >
            {name || "Unnamed Product"}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-yellow-500">
              ★
            </span>

            <span className="text-sm font-medium text-[#031008]">
              {rating !== undefined && rating !== null
                ? Number(rating).toFixed(1)
                : "0.0"}
            </span>
          </div>

          {review_count !== undefined && (
            <span className="text-xs text-gray-500">
              ({review_count} reviews)
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-[#031008]">
            ${formattedPrice}
          </span>

          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* Add To Cart */}
        <div className="mt-4">
          <Button
            fullWidth
            disabled={isOutOfStock}
            onClick={() => {
              if (onAddToCart) {
                onAddToCart(product);
              }
            }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;