import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import ProductImages from "../components/product/ProductImages";
import ProductInfo from "../components/product/ProductInfo";
import ProductReviews from "../components/product/ProductReview";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";

import {
  getProductById,
  getProductBySlug,
  getProductVariants,
  getProductImages,
  getProduct3DModels,
} from "../services/productApi";

const ProductDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();

  // --------------------------------------------------
  // Product state
  // --------------------------------------------------

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [models3D, setModels3D] = useState([]);

  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  const [loadingProduct, setLoadingProduct] =
    useState(true);

  const [loadingVariants, setLoadingVariants] =
    useState(false);

  const [loadingImages, setLoadingImages] =
    useState(false);

  const [loading3D, setLoading3D] =
    useState(false);

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  const [productError, setProductError] =
    useState("");

  const [variantsError, setVariantsError] =
    useState("");

  const [imagesError, setImagesError] =
    useState("");

  const [models3DError, setModels3DError] =
    useState("");

  // --------------------------------------------------
  // Authentication
  // --------------------------------------------------

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("fernwood_user");

      if (!storedUser) {
        setIsAuthenticated(false);
        return;
      }

      const user = JSON.parse(storedUser);

      setIsAuthenticated(Boolean(user?.token));
    } catch (error) {
      console.error(
        "Failed to read authentication:",
        error
      );

      setIsAuthenticated(false);
    }
  }, []);

  // --------------------------------------------------
  // Get product identifier
  // --------------------------------------------------

  const productIdentifier = id || slug;

  // --------------------------------------------------
  // Fetch product
  // --------------------------------------------------

  const fetchProduct = async () => {
    if (!productIdentifier) {
      setProductError(
        "No product identifier was provided."
      );

      setLoadingProduct(false);

      return;
    }

    try {
      setLoadingProduct(true);
      setProductError("");

      let response;

      /*
       * If the route is /products/:id,
       * use getProductById().
       *
       * If the route is /products/:slug,
       * use getProductBySlug().
       */
      if (id) {
        response =
          await getProductById(id);
      } else {
        response =
          await getProductBySlug(slug);
      }

      const data = response.data;

      /*
       * Supports:
       *
       * { product: {...} }
       * { data: {...} }
       * {...}
       */
      const productData =
        data?.product ||
        data?.data ||
        data;

      setProduct(productData);

      /*
       * If the product response already contains
       * images or variants, use them immediately.
       */
      if (
        Array.isArray(productData?.images)
      ) {
        setImages(productData.images);
      }

      if (
        Array.isArray(productData?.variants)
      ) {
        setVariants(productData.variants);

        if (productData.variants.length > 0) {
          setSelectedVariant(
            productData.variants[0]
          );
        }
      }
    } catch (error) {
      console.error(
        "Failed to load product:",
        error
      );

      if (
        error.response?.status === 404
      ) {
        setProductError(
          "The furniture product you are looking for could not be found."
        );
      } else {
        setProductError(
          error.response?.data?.message ||
            "Unable to load this product. Please try again."
        );
      }
    } finally {
      setLoadingProduct(false);
    }
  };

  // --------------------------------------------------
  // Fetch variants
  // --------------------------------------------------

  const fetchVariants = async (
    productId
  ) => {
    if (!productId) return;

    try {
      setLoadingVariants(true);
      setVariantsError("");

      const response =
        await getProductVariants(productId);

      const data = response.data;

      const variantData =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.variants)
          ? data.variants
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setVariants(variantData);

      if (
        variantData.length > 0 &&
        !selectedVariant
      ) {
        setSelectedVariant(
          variantData[0]
        );
      }
    } catch (error) {
      console.error(
        "Failed to load product variants:",
        error
      );

      setVariantsError(
        error.response?.data?.message ||
          "Unable to load product variants."
      );
    } finally {
      setLoadingVariants(false);
    }
  };

  // --------------------------------------------------
  // Fetch images
  // --------------------------------------------------

  const fetchImages = async (
    productId
  ) => {
    if (!productId) return;

    try {
      setLoadingImages(true);
      setImagesError("");

      const response =
        await getProductImages(productId);

      const data = response.data;

      const imageData =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.images)
          ? data.images
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setImages(imageData);
    } catch (error) {
      console.error(
        "Failed to load product images:",
        error
      );

      setImagesError(
        error.response?.data?.message ||
          "Unable to load product images."
      );
    } finally {
      setLoadingImages(false);
    }
  };

  // --------------------------------------------------
  // Fetch 3D models
  // --------------------------------------------------

  const fetch3DModels = async (
    productId
  ) => {
    if (!productId) return;

    /*
     * The 3D model API is prepared now,
     * but the actual 3D viewer can be added later.
     */

    try {
      setLoading3D(true);
      setModels3DError("");

      const response =
        await getProduct3DModels(productId);

      const data = response.data;

      const modelData =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.models)
          ? data.models
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setModels3D(modelData);
    } catch (error) {
      console.error(
        "Failed to load 3D models:",
        error
      );

      /*
       * A missing 3D model should not make
       * the entire product page fail.
       */
      setModels3DError(
        error.response?.data?.message ||
          "No 3D model is currently available."
      );
    } finally {
      setLoading3D(false);
    }
  };

  // --------------------------------------------------
  // Initial product loading
  // --------------------------------------------------

  useEffect(() => {
    fetchProduct();
  }, [productIdentifier]);

  // --------------------------------------------------
  // Load related product data
  // --------------------------------------------------

  useEffect(() => {
    if (!product?.id) return;

    /*
     * Only fetch variants if they were not
     * already included in the product response.
     */
    if (
      !Array.isArray(product?.variants)
    ) {
      fetchVariants(product.id);
    }

    /*
     * Only fetch images if they were not
     * already included in the product response.
     */
    if (
      !Array.isArray(product?.images)
    ) {
      fetchImages(product.id);
    }

    /*
     * Load 3D models separately.
     */
    fetch3DModels(product.id);
  }, [product?.id]);

  // --------------------------------------------------
  // Select default image
  // --------------------------------------------------

  useEffect(() => {
    if (selectedImage) return;

    if (!images.length) {
      if (product?.image_url) {
        setSelectedImage(
          product.image_url
        );
      }

      return;
    }

    const firstImage = images[0];

    const imageUrl =
      typeof firstImage === "string"
        ? firstImage
        : firstImage?.image_url ||
          firstImage?.url ||
          firstImage?.image ||
          "";

    if (imageUrl) {
      setSelectedImage(imageUrl);
    }
  }, [
    images,
    product?.image_url,
    selectedImage,
  ]);

  // --------------------------------------------------
  // Normalize images
  // --------------------------------------------------

  const normalizedImages = useMemo(() => {
    const result = [];

    /*
     * Product main image
     */
    if (product?.image_url) {
      result.push({
        id: "product-main",
        image_url: product.image_url,
      });
    }

    /*
     * Product gallery
     */
    images.forEach((image, index) => {
      if (typeof image === "string") {
        result.push({
          id: `image-${index}`,
          image_url: image,
        });

        return;
      }

      result.push({
        ...image,
        id:
          image.id ||
          `image-${index}`,
        image_url:
          image.image_url ||
          image.url ||
          image.image ||
          "",
      });
    });

    /*
     * Remove duplicate URLs.
     */
    const uniqueImages = [];

    const seen = new Set();

    result.forEach((image) => {
      if (
        image.image_url &&
        !seen.has(image.image_url)
      ) {
        seen.add(image.image_url);
        uniqueImages.push(image);
      }
    });

    return uniqueImages;
  }, [
    product?.image_url,
    images,
  ]);

  // --------------------------------------------------
  // Handle variant selection
  // --------------------------------------------------

  const handleVariantChange = (
    variant
  ) => {
    setSelectedVariant(variant);

    /*
     * If a variant has its own image,
     * display that image.
     */
    const variantImage =
      variant?.image_url ||
      variant?.image ||
      "";

    if (variantImage) {
      setSelectedImage(
        variantImage
      );
    }
  };

  // --------------------------------------------------
  // Add to cart
  // --------------------------------------------------

  const handleAddToCart = (
    productData,
    quantity = 1
  ) => {
    /*
     * Cart functionality will be connected
     * to CartContext/cartApi.
     *
     * For now we dispatch a browser event so
     * the cart system can listen to it later.
     */
    window.dispatchEvent(
      new CustomEvent(
        "fernwood:add-to-cart",
        {
          detail: {
            product: productData,
            variant: selectedVariant,
            quantity,
          },
        }
      )
    );
  };

  // --------------------------------------------------
  // Buy now
  // --------------------------------------------------

  const handleBuyNow = (
    productData,
    quantity = 1
  ) => {
    /*
     * Save temporary checkout information.
     *
     * Checkout.jsx can later read this data
     * or this can be replaced by CartContext.
     */
    const checkoutItem = {
      product: productData,
      variant: selectedVariant,
      quantity,
    };

    sessionStorage.setItem(
      "fernwood_buy_now",
      JSON.stringify(checkoutItem)
    );

    navigate("/checkout");
  };

  // --------------------------------------------------
  // Review submitted
  // --------------------------------------------------

  const handleReviewSubmitted = (
    updatedReviews
  ) => {
    /*
     * ProductReviews can return the updated
     * review list after submission.
     *
     * The product itself remains unchanged.
     */
    setProduct((currentProduct) => {
      if (!currentProduct) {
        return currentProduct;
      }

      return {
        ...currentProduct,
        reviews: updatedReviews,
      };
    });
  };

  // --------------------------------------------------
  // Loading product
  // --------------------------------------------------

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader
            size="large"
            text="Loading product..."
          />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Product error
  // --------------------------------------------------

  if (productError || !product) {
    return (
      <div className="min-h-screen bg-[#F8F5EF]">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6">
          <div className="w-full">
            <ErrorMessage
              title="Product unavailable"
              message={
                productError ||
                "This product could not be found."
              }
              onRetry={fetchProduct}
            />

            <div className="mt-6 text-center">
              <Link to="/products">
                <Button variant="outline">
                  ← Back to products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Render product page
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      {/* ==================================================
          BREADCRUMB
      ================================================== */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
          <nav
            className="flex flex-wrap items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="text-gray-500 transition hover:text-[#031008]"
            >
              Home
            </Link>

            <span className="text-gray-400">
              /
            </span>

            <Link
              to="/products"
              className="text-gray-500 transition hover:text-[#031008]"
            >
              Products
            </Link>

            <span className="text-gray-400">
              /
            </span>

            <span className="font-medium text-[#031008]">
              {product.name ||
                product.title ||
                "Product"}
            </span>
          </nav>
        </div>
      </div>

      {/* ==================================================
          PRODUCT DETAILS
      ================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ==================================================
              PRODUCT IMAGES
          ================================================== */}
          <div>
            {loadingImages ? (
              <div className="flex min-h-[500px] items-center justify-center rounded-xl bg-white">
                <Loader text="Loading images..." />
              </div>
            ) : imagesError &&
              normalizedImages.length === 0 ? (
              <ErrorMessage
                message={imagesError}
                onRetry={() =>
                  fetchImages(product.id)
                }
              />
            ) : (
              <ProductImages
                images={normalizedImages}
                mainImage={selectedImage}
                onImageChange={
                  setSelectedImage
                }
              />
            )}

            {/* ==================================================
                3D MODEL PLACEHOLDER
            ================================================== */}
            <div className="mt-6">
              {loading3D ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <Loader
                    size="small"
                    text="Checking for 3D model..."
                  />
                </div>
              ) : models3D.length > 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-[#33473B]">
                        3D Preview
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-[#031008]">
                        View this furniture in 3D
                      </h3>
                    </div>

                    <span className="rounded-full bg-[#F8F5EF] px-3 py-1 text-xs font-medium text-[#33473B]">
                      Available
                    </span>
                  </div>

                  <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-lg bg-[#F8F5EF]">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#031008] text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-7 w-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9L12 22m0-9.25L3 7.5m9 5.25V22m-9-5.5 9 5.25"
                          />
                        </svg>
                      </div>

                      <p className="mt-3 text-sm font-medium text-[#031008]">
                        3D viewer coming soon
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Your 3D model data is ready to
                        be connected.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {models3DError &&
                models3D.length === 0 && (
                  <div className="hidden">
                    {models3DError}
                  </div>
                )}
            </div>
          </div>

          {/* ==================================================
              PRODUCT INFORMATION
          ================================================== */}
          <div>
            <ProductInfo
              product={product}
              variant={selectedVariant}
              onAddToCart={
                handleAddToCart
              }
              onBuyNow={handleBuyNow}
            />

            {/* ==================================================
                VARIANTS
            ================================================== */}
            {loadingVariants ? (
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
                <Loader
                  size="small"
                  text="Loading variants..."
                />
              </div>
            ) : variantsError ? (
              <div className="mt-8">
                <ErrorMessage
                  message={variantsError}
                  onRetry={() =>
                    fetchVariants(
                      product.id
                    )
                  }
                />
              </div>
            ) : variants.length > 0 ? (
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-[#031008]">
                  Product options
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Choose an available variant.
                </p>

                <div className="mt-5 space-y-3">
                  {variants.map(
                    (variant) => {
                      const isSelected =
                        selectedVariant?.id ===
                        variant.id;

                      const variantName =
                        variant.name ||
                        [
                          variant.color,
                          variant.material,
                          variant.size,
                        ]
                          .filter(Boolean)
                          .join(" / ") ||
                        variant.sku ||
                        `Variant ${variant.id}`;

                      const variantPrice =
                        variant.discount_price ??
                        variant.price ??
                        0;

                      const stock =
                        Number(
                          variant.count_in_stock ??
                            0
                        );

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() =>
                            handleVariantChange(
                              variant
                            )
                          }
                          disabled={
                            stock <= 0
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-lg
                            border
                            p-4
                            text-left
                            transition
                            ${
                              isSelected
                                ? "border-[#031008] bg-[#F8F5EF]"
                                : "border-gray-200 bg-white hover:border-[#33473B]"
                            }
                            ${
                              stock <= 0
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }
                          `}
                        >
                          <div>
                            <p className="font-medium text-[#031008]">
                              {variantName}
                            </p>

                            <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                              {variant.color && (
                                <span>
                                  Color:{" "}
                                  {variant.color}
                                </span>
                              )}

                              {variant.material && (
                                <span>
                                  Material:{" "}
                                  {
                                    variant.material
                                  }
                                </span>
                              )}

                              {variant.size && (
                                <span>
                                  Size:{" "}
                                  {variant.size}
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-sm font-semibold text-[#33473B]">
                              {Number(
                                variantPrice
                              ).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`
                                text-xs
                                font-medium
                                ${
                                  stock > 0
                                    ? "text-green-700"
                                    : "text-red-600"
                                }
                              `}
                            >
                              {stock > 0
                                ? `${stock} available`
                                : "Out of stock"}
                            </span>

                            {isSelected && (
                              <div className="mt-2 flex justify-end">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#031008] text-white">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m5 12 4 4L19 7"
                                    />
                                  </svg>
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ==================================================
            REVIEWS
        ================================================== */}
        <section className="mt-16 border-t border-gray-200 pt-12">
          <ProductReviews
            productId={product.id}
            reviews={product.reviews || []}
            isAuthenticated={
              isAuthenticated
            }
            onReviewSubmitted={
              handleReviewSubmitted
            }
          />
        </section>
      </main>

      {/* ==================================================
          BOTTOM CTA
      ================================================== */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-10 sm:px-8 md:flex-row lg:px-12">
          <div>
            <h2 className="text-xl font-semibold text-[#031008]">
              Looking for something else?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore the complete Fernwood furniture
              collection.
            </p>
          </div>

          <Link to="/products">
            <Button variant="outline">
              Browse all furniture
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;