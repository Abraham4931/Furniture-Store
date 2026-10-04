import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistApi";

const Wishlist = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const isAuthenticated = Boolean(
    localStorage.getItem("fernwood_user")
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/wishlist",
        },
      });
      return;
    }

    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getWishlist();

      /*
       * Depending on your backend response,
       * wishlist data may be directly in response.data
       * or inside response.data.wishlist.
       */
      const data = response.data;

      if (Array.isArray(data)) {
        setWishlist(data);
      } else if (Array.isArray(data.wishlist)) {
        setWishlist(data.wishlist);
      } else if (Array.isArray(data.products)) {
        setWishlist(data.products);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your wishlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");

      await removeFromWishlist(productId);

      setWishlist((currentWishlist) =>
        currentWishlist.filter((item) => {
          const itemProductId =
            item.product_id ||
            item.product?.id ||
            item.id;

          return String(itemProductId) !== String(productId);
        })
      );
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);

      setError(
        err.response?.data?.message ||
          "Failed to remove the product from your wishlist."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const getProduct = (item) => {
    return item.product || item;
  };

  const getProductId = (item) => {
    const product = getProduct(item);

    return product.id || item.product_id;
  };

  const handleAddToCart = (product) => {
    window.dispatchEvent(
      new CustomEvent("fernwood:add-to-cart", {
        detail: {
          product,
          quantity: 1,
        },
      })
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader text="Loading your wishlist..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#33473B]">
                Your collection
              </p>

              <h1 className="text-3xl font-bold text-[#031008] sm:text-4xl">
                Wishlist
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                Products you've saved for later.
              </p>
            </div>

            {wishlist.length > 0 && (
              <span className="text-sm text-gray-500">
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage
              message={error}
              onRetry={fetchWishlist}
            />
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="flex min-h-[45vh] flex-col items-center justify-center rounded-lg bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F5EF]">
              <svg
                className="h-8 w-8 text-[#33473B]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-[#031008]">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Save products you love and come back to them whenever
              you're ready.
            </p>

            <Link to="/products" className="mt-6">
              <Button size="large">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((item) => {
                const product = getProduct(item);
                const productId = getProductId(item);

                return (
                  <div
                    key={productId}
                    className="relative"
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(productId)}
                      disabled={removingId === productId}
                      aria-label={`Remove ${
                        product.name || "product"
                      } from wishlist`}
                      className="
                        absolute
                        right-3
                        top-3
                        z-10
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-gray-500
                        shadow-md
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {removingId === productId ? (
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-gray-300
                            border-t-[#031008]
                          "
                        />
                      ) : (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6l12 12M6 18L18 6"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Continue shopping */}
            <div className="mt-10 flex justify-center">
              <Link to="/products">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Wishlist;