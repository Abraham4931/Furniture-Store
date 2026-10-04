import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const CART_STORAGE_KEY = "fernwood_cart";

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 300;

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load cart
  // --------------------------------------------------

  const loadCart = () => {
    try {
      setLoading(true);
      setError("");

      const storedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      if (!storedCart) {
        setCartItems([]);
        return;
      }

      const parsedCart = JSON.parse(storedCart);

      if (Array.isArray(parsedCart)) {
        setCartItems(parsedCart);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error(
        "Failed to load cart:",
        err
      );

      setError(
        "Unable to load your cart. Please try again."
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial load
  // --------------------------------------------------

  useEffect(() => {
    loadCart();
  }, []);

  // --------------------------------------------------
  // Save cart
  // --------------------------------------------------

  const saveCart = (items) => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );

      setCartItems(items);

      /*
       * Notify other components such as Navbar
       * that the cart has changed.
       */
      window.dispatchEvent(
        new CustomEvent(
          "fernwood:cart-updated",
          {
            detail: items,
          }
        )
      );
    } catch (err) {
      console.error(
        "Failed to save cart:",
        err
      );

      setError(
        "Unable to update your cart."
      );
    }
  };

  // --------------------------------------------------
  // Get item ID
  // --------------------------------------------------

  const getItemId = (item) => {
    return (
      item.cartItemId ||
      item.variant?.id ||
      item.variant_id ||
      item.product?.id ||
      item.product_id ||
      item.id
    );
  };

  // --------------------------------------------------
  // Get product information
  // --------------------------------------------------

  const getProduct = (item) => {
    return item.product || item;
  };

  const getProductName = (item) => {
    const product = getProduct(item);

    return (
      product.name ||
      product.title ||
      "Furniture Product"
    );
  };

  const getProductImage = (item) => {
    const product = getProduct(item);

    return (
      item.variant?.image_url ||
      item.variant?.image ||
      item.image_url ||
      item.image ||
      product.image_url ||
      product.image ||
      product.thumbnail ||
      "https://via.placeholder.com/300x300?text=Furniture"
    );
  };

  // --------------------------------------------------
  // Get variant information
  // --------------------------------------------------

  const getVariant = (item) => {
    return item.variant || null;
  };

  const getVariantName = (item) => {
    const variant = getVariant(item);

    if (!variant) {
      return "";
    }

    if (variant.name) {
      return variant.name;
    }

    const details = [
      variant.color,
      variant.material,
      variant.size,
    ].filter(Boolean);

    return details.join(" / ");
  };

  // --------------------------------------------------
  // Get item price
  // --------------------------------------------------

  const getItemPrice = (item) => {
    const variant = getVariant(item);
    const product = getProduct(item);

    const price =
      item.discount_price ??
      item.price ??
      variant?.discount_price ??
      variant?.price ??
      product.discount_price ??
      product.price ??
      0;

    return Number(price) || 0;
  };

  // --------------------------------------------------
  // Get quantity
  // --------------------------------------------------

  const getItemQuantity = (item) => {
    const quantity =
      Number(item.quantity) || 1;

    return Math.max(1, quantity);
  };

  // --------------------------------------------------
  // Get stock
  // --------------------------------------------------

  const getItemStock = (item) => {
    const variant = getVariant(item);
    const product = getProduct(item);

    const stock =
      variant?.count_in_stock ??
      product.count_in_stock ??
      product.stock_quantity ??
      product.stock ??
      null;

    if (
      stock === null ||
      stock === undefined
    ) {
      return null;
    }

    return Number(stock);
  };

  // --------------------------------------------------
  // Update quantity
  // --------------------------------------------------

  const updateQuantity = (
    itemId,
    newQuantity
  ) => {
    const quantity = Number(newQuantity);

    if (quantity < 1) {
      return;
    }

    const updatedItems = cartItems.map(
      (item) => {
        if (
          String(getItemId(item)) !==
          String(itemId)
        ) {
          return item;
        }

        const stock =
          getItemStock(item);

        /*
         * Do not allow quantity to exceed
         * available stock when stock is known.
         */
        if (
          stock !== null &&
          quantity > stock
        ) {
          return {
            ...item,
            quantity: stock,
          };
        }

        return {
          ...item,
          quantity,
        };
      }
    );

    saveCart(updatedItems);
  };

  // --------------------------------------------------
  // Increase quantity
  // --------------------------------------------------

  const increaseQuantity = (item) => {
    const currentQuantity =
      getItemQuantity(item);

    const stock =
      getItemStock(item);

    if (
      stock !== null &&
      currentQuantity >= stock
    ) {
      return;
    }

    updateQuantity(
      getItemId(item),
      currentQuantity + 1
    );
  };

  // --------------------------------------------------
  // Decrease quantity
  // --------------------------------------------------

  const decreaseQuantity = (item) => {
    const currentQuantity =
      getItemQuantity(item);

    if (currentQuantity <= 1) {
      return;
    }

    updateQuantity(
      getItemId(item),
      currentQuantity - 1
    );
  };

  // --------------------------------------------------
  // Remove item
  // --------------------------------------------------

  const removeItem = (itemId) => {
    const updatedItems =
      cartItems.filter(
        (item) =>
          String(getItemId(item)) !==
          String(itemId)
      );

    saveCart(updatedItems);
  };

  // --------------------------------------------------
  // Clear cart
  // --------------------------------------------------

  const clearCart = () => {
    saveCart([]);
  };

  // --------------------------------------------------
  // Calculate subtotal
  // --------------------------------------------------

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        return (
          total +
          getItemPrice(item) *
            getItemQuantity(item)
        );
      },
      0
    );
  }, [cartItems]);

  // --------------------------------------------------
  // Calculate shipping
  // --------------------------------------------------

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_COST;

  // --------------------------------------------------
  // Calculate total
  // --------------------------------------------------

  const total = subtotal + shipping;

  // --------------------------------------------------
  // Total item count
  // --------------------------------------------------

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + getItemQuantity(item),
      0
    );
  }, [cartItems]);

  // --------------------------------------------------
  // Format price
  // --------------------------------------------------

  const formatPrice = (price) => {
    return Number(price).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // --------------------------------------------------
  // Checkout
  // --------------------------------------------------

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader
            size="large"
            text="Loading your cart..."
          />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6">
          <div className="w-full">
            <ErrorMessage
              message={error}
              onRetry={loadCart}
            />

            <div className="mt-6 text-center">
              <Link to="/products">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Empty cart
  // --------------------------------------------------

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        {/* Header */}
        <section className="bg-[#031008]">
          <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B89A]">
              Fernwood Furniture
            </p>

            <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              Your Cart
            </h1>

            <p className="mt-4 text-gray-300">
              Review your selected furniture before
              checkout.
            </p>
          </div>
        </section>

        {/* Empty state */}
        <main className="mx-auto flex min-h-[55vh] max-w-7xl items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-10 w-10 text-[#33473B]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835L5.5 6.75m0 0h13.125c.698 0 1.25.63 1.156 1.321l-1.125 8.25a1.125 1.125 0 0 1-1.113.974H8.457a1.125 1.125 0 0 1-1.113-.974L5.5 6.75Zm3.75 13.5a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 0 0-3 0m12 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 0 0-3 0"
                />
              </svg>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#031008]">
              Your cart is empty
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              You haven't added any furniture to your
              cart yet. Explore our collection and find
              something for your space.
            </p>

            <div className="mt-7">
              <Link to="/products">
                <Button size="large">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // Cart
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      {/* ==================================================
          HEADER
      ================================================== */}
      <section className="bg-[#031008]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B89A]">
            Fernwood Furniture
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Your Cart
          </h1>

          <p className="mt-4 text-gray-300">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            ready for checkout.
          </p>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* ==================================================
              CART ITEMS
          ================================================== */}
          <section>
            {/* Section header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#031008]">
                  Cart items
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review your furniture before checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="
                  text-sm
                  font-medium
                  text-red-600
                  transition
                  hover:text-red-800
                "
              >
                Clear cart
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemId =
                  getItemId(item);

                const productName =
                  getProductName(item);

                const image =
                  getProductImage(item);

                const variantName =
                  getVariantName(item);

                const price =
                  getItemPrice(item);

                const quantity =
                  getItemQuantity(item);

                const stock =
                  getItemStock(item);

                const itemTotal =
                  price * quantity;

                return (
                  <article
                    key={String(itemId)}
                    className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product image */}
                      <Link
                        to={`/products/${
                          getProduct(item).slug ||
                          getProduct(item).id ||
                          ""
                        }`}
                        className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-[#F8F5EF] sm:h-36 sm:w-36"
                      >
                        <img
                          src={image}
                          alt={productName}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://via.placeholder.com/300x300?text=Furniture";
                          }}
                        />
                      </Link>

                      {/* Product content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              to={`/products/${
                                getProduct(item).slug ||
                                getProduct(item).id ||
                                ""
                              }`}
                              className="text-base font-semibold text-[#031008] hover:text-[#33473B] sm:text-lg"
                            >
                              {productName}
                            </Link>

                            {variantName && (
                              <p className="mt-1 text-sm text-gray-500">
                                {variantName}
                              </p>
                            )}

                            {item.sku && (
                              <p className="mt-1 text-xs text-gray-400">
                                SKU: {item.sku}
                              </p>
                            )}
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(itemId)
                            }
                            className="
                              rounded-md
                              p-1.5
                              text-gray-400
                              transition
                              hover:bg-red-50
                              hover:text-red-600
                            "
                            aria-label={`Remove ${productName} from cart`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="mt-3">
                          <p className="font-semibold text-[#031008]">
                            {formatPrice(
                              price
                            )}
                          </p>
                        </div>

                        {/* Bottom row */}
                        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          {/* Quantity */}
                          <div>
                            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                              Quantity
                            </p>

                            <div className="flex w-fit items-center overflow-hidden rounded-md border border-gray-300">
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    item
                                  )
                                }
                                disabled={
                                  quantity <=
                                  1
                                }
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  text-[#031008]
                                  transition
                                  hover:bg-[#F8F5EF]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>

                              <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 px-2 text-sm font-medium text-[#031008]">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    item
                                  )
                                }
                                disabled={
                                  stock !==
                                    null &&
                                  quantity >=
                                    stock
                                }
                                className="
                                  flex
                                  h-9
                                  w-9
                                  items-center
                                  justify-center
                                  text-[#031008]
                                  transition
                                  hover:bg-[#F8F5EF]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            {stock !== null &&
                              quantity >=
                                stock && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Maximum available
                                  quantity reached.
                                </p>
                              )}
                          </div>

                          {/* Item total */}
                          <div className="text-left sm:text-right">
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              Item total
                            </p>

                            <p className="mt-1 text-lg font-bold text-[#031008]">
                              {formatPrice(
                                itemTotal
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Continue shopping */}
            <div className="mt-6">
              <Link to="/products">
                <Button variant="outline">
                  ← Continue Shopping
                </Button>
              </Link>
            </div>
          </section>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}
          <aside>
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-[#031008]">
                Order Summary
              </h2>

              {/* Subtotal */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#031008]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping
                  </span>

                  <span className="font-medium text-[#031008]">
                    {shipping === 0
                      ? "Free"
                      : formatPrice(
                          shipping
                        )}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#031008]">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-[#031008]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Free shipping message */}
              {subtotal <
                FREE_SHIPPING_THRESHOLD && (
                <div className="mt-5 rounded-lg bg-[#F8F5EF] p-4">
                  <p className="text-sm leading-5 text-[#33473B]">
                    Add{" "}
                    <span className="font-semibold">
                      {formatPrice(
                        FREE_SHIPPING_THRESHOLD -
                          subtotal
                      )}
                    </span>{" "}
                    more to qualify for free shipping.
                  </p>
                </div>
              )}

              {subtotal >=
                FREE_SHIPPING_THRESHOLD && (
                <div className="mt-5 rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-700">
                    ✓ You qualify for free shipping.
                  </p>
                </div>
              )}

              {/* Checkout button */}
              <div className="mt-6">
                <Button
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>

              {/* Secure checkout */}
              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5Z"
                  />
                </svg>

                Secure checkout
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;