import { useEffect, useMemo, useState } from "react";
import Button from "../common/Button";

const ProductInfo = ({
  product,
  variant = null,
  onAddToCart,
  onBuyNow,
  className = "",
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return null;
  }

  /*
   * Use variant data when available.
   * Fall back to the product data when the product itself
   * contains the required information.
   */
  const name = product.name || "Unnamed Product";

  const price = Number(
    variant?.price ?? product.price ?? 0
  );

  const discountPrice = variant?.discount_price ??
    product.discount_price;

  const hasDiscount =
    discountPrice !== null &&
    discountPrice !== undefined &&
    Number(discountPrice) < price;

  const currentPrice = hasDiscount
    ? Number(discountPrice)
    : price;

  const material =
    variant?.material ??
    product.material ??
    product.material_name;

  const color =
    variant?.color ??
    product.color ??
    product.color_name;

  const width =
    variant?.width ??
    product.width;

  const height =
    variant?.height ??
    product.height;

  const depth =
    variant?.depth ??
    product.depth;

  const dimensionUnit =
    variant?.dimension_unit ??
    product.dimension_unit ??
    "cm";

  const stock = Number(
    variant?.count_in_stock ??
    product.count_in_stock ??
    product.stock ??
    0
  );

  const sku =
    variant?.sku ??
    product.sku;

  const isOutOfStock = stock <= 0;

  /*
   * Maximum quantity is limited by inventory.
   */
  const maxQuantity = Math.max(stock, 1);

  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }
  }, [quantity, maxQuantity]);

  /*
   * Format prices.
   */
  const formattedPrice = useMemo(() => {
    return currentPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [currentPrice]);

  const formattedOriginalPrice = useMemo(() => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [price]);

  /*
   * Increase quantity.
   */
  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(current + 1, maxQuantity)
    );
  };

  /*
   * Decrease quantity.
   */
  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
  };

  /*
   * Add product to cart.
   */
  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (onAddToCart) {
      onAddToCart({
        product,
        variant,
        quantity,
      });
    }
  };

  /*
   * Buy product immediately.
   */
  const handleBuyNow = () => {
    if (isOutOfStock) return;

    if (onBuyNow) {
      onBuyNow({
        product,
        variant,
        quantity,
      });
    }
  };

  /*
   * Build dimensions only when at least one
   * dimension value exists.
   */
  const hasDimensions =
    width !== undefined &&
    width !== null ||
    height !== undefined &&
    height !== null ||
    depth !== undefined &&
    depth !== null;

  return (
    <div className={`w-full ${className}`}>

      {/* Product Name */}
      <h1 className="text-2xl font-bold leading-tight text-[#031008] sm:text-3xl">
        {name}
      </h1>

      {/* Rating */}
      {(product.rating !== undefined ||
        product.review_count !== undefined) && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">
              ★
            </span>

            <span className="text-sm font-medium text-[#031008]">
              {product.rating !== undefined
                ? Number(product.rating).toFixed(1)
                : "0.0"}
            </span>
          </div>

          {product.review_count !== undefined && (
            <span className="text-sm text-gray-500">
              ({product.review_count} reviews)
            </span>
          )}
        </div>
      )}

      {/* Price */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-2xl font-bold text-[#031008]">
          ${formattedPrice}
        </span>

        {hasDiscount && (
          <span className="text-lg text-gray-400 line-through">
            ${formattedOriginalPrice}
          </span>
        )}

        {hasDiscount && (
          <span className="rounded-full bg-[#F8F5EF] px-3 py-1 text-xs font-semibold text-[#33473B]">
            Sale
          </span>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-6 border-b border-gray-200 pb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#031008]">
            Description
          </h2>

          <p className="text-sm leading-6 text-gray-600">
            {product.description}
          </p>
        </div>
      )}

      {/* Product Details */}
      <div className="mt-6 border-b border-gray-200 pb-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#031008]">
          Product Details
        </h2>

        <div className="space-y-3">

          {/* Material */}
          {material && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Material
              </span>

              <span className="text-sm font-medium text-[#031008]">
                {material}
              </span>
            </div>
          )}

          {/* Color */}
          {color && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Color
              </span>

              <span className="text-sm font-medium capitalize text-[#031008]">
                {color}
              </span>
            </div>
          )}

          {/* Dimensions */}
          {hasDimensions && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Dimensions
              </span>

              <span className="text-right text-sm font-medium text-[#031008]">
                {width ?? "—"} × {depth ?? "—"} ×{" "}
                {height ?? "—"} {dimensionUnit}
              </span>
            </div>
          )}

          {/* SKU */}
          {sku && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                SKU
              </span>

              <span className="text-sm font-medium text-[#031008]">
                {sku}
              </span>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Availability
            </span>

            {isOutOfStock ? (
              <span className="text-sm font-semibold text-red-600">
                Out of stock
              </span>
            ) : (
              <span className="text-sm font-semibold text-green-700">
                In stock: {stock}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity */}
      {!isOutOfStock && (
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-[#031008]">
            Quantity
          </label>

          <div className="flex w-fit items-center overflow-hidden rounded-md border border-gray-300">

            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-lg
                text-[#031008]
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:text-gray-300
              "
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span
              className="
                flex
                h-10
                min-w-12
                items-center
                justify-center
                border-x
                border-gray-300
                px-3
                text-sm
                font-semibold
                text-[#031008]
              "
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                text-lg
                text-[#031008]
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:text-gray-300
              "
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {stock > 0 && stock <= 5 && (
            <p className="mt-2 text-xs text-orange-600">
              Only {stock} left in stock.
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">

        <Button
          fullWidth
          disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock
            ? "Out of Stock"
            : "Add to Cart"}
        </Button>

        {!isOutOfStock && (
          <Button
            fullWidth
            variant="secondary"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;