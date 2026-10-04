import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import ProductCard from "../components/product/ProductCard";

import {
  getProducts,
  getCategories,
} from "../services/productApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [productsError, setProductsError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");

  // --------------------------------------------------
  // Fetch products
  // --------------------------------------------------
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductsError("");

      const response = await getProducts();

      /*
       * Depending on your backend response:
       *
       * { products: [...] }
       * or
       * [...]
       *
       * This supports both.
       */
      const data = response.data;

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load products:", error);

      setProductsError(
        error.response?.data?.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  // --------------------------------------------------
  // Fetch categories
  // --------------------------------------------------
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError("");

      const response = await getCategories();

      const data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);

      setCategoriesError(
        error.response?.data?.message ||
          "Unable to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // --------------------------------------------------
  // Initial data loading
  // --------------------------------------------------
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Product sections
  // --------------------------------------------------

  /*
   * Featured products:
   * First 8 products returned from the API.
   */
  const featuredProducts = products.slice(0, 8);

  /*
   * New arrivals:
   * Last 8 products from the returned list.
   *
   * If your backend later provides created_at,
   * you can sort products by created_at here.
   */
  const newArrivals = [...products]
    .reverse()
    .slice(0, 8);

  // --------------------------------------------------
  // Category helper
  // --------------------------------------------------
  const getCategoryName = (category) => {
    return (
      category.name ||
      category.title ||
      category.category_name ||
      "Category"
    );
  };

  const getCategorySlug = (category) => {
    return (
      category.slug ||
      category.id ||
      ""
    );
  };

  const getCategoryImage = (category) => {
    return (
      category.image_url ||
      category.image ||
      category.thumbnail ||
      "https://via.placeholder.com/800x600?text=Furniture"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      {/* ==================================================
          HERO SECTION
      ================================================== */}
      <section className="relative overflow-hidden bg-[#031008]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-28">
          {/* Hero content */}
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#C8B89A]">
              Fernwood Furniture
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Furniture that makes your space feel like home.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
              Discover carefully selected furniture designed to bring
              comfort, character, and timeless style into every room.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/products">
                <Button
                  variant="secondary"
                  size="large"
                >
                  Shop Furniture
                </Button>
              </Link>

              <Link to="/products?category=new-arrivals">
                <Button
                  variant="outline"
                  size="large"
                  className="border-white text-white hover:bg-white hover:text-[#031008]"
                >
                  Explore New Arrivals
                </Button>
              </Link>
            </div>

            {/* Small highlights */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-2xl font-bold text-white">
                  100+
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Furniture pieces
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  Premium
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Materials
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">
                  Easy
                </p>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Online shopping
                </p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85"
                alt="Modern Fernwood furniture"
                className="h-[420px] w-full object-cover sm:h-[500px]"
              />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 left-4 rounded-xl bg-white p-5 shadow-xl sm:left-8">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Designed for living
              </p>

              <p className="mt-1 text-lg font-semibold text-[#031008]">
                Comfort meets style
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CATEGORY SECTION
      ================================================== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#33473B]">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#031008] sm:text-4xl">
                Shop by category
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Find furniture that fits every room and every style.
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-[#33473B] hover:text-[#031008]"
            >
              View all products →
            </Link>
          </div>

          {loadingCategories ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <Loader text="Loading categories..." />
            </div>
          ) : categoriesError ? (
            <ErrorMessage
              message={categoriesError}
              onRetry={fetchCategories}
            />
          ) : categories.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-[#F8F5EF] p-8 text-center">
              <p className="text-gray-600">
                No categories available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id || category.slug}
                  to={`/products?category=${encodeURIComponent(
                    getCategorySlug(category)
                  )}`}
                  className="group relative overflow-hidden rounded-xl bg-gray-100"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={getCategoryImage(category)}
                      alt={getCategoryName(category)}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                    <h3 className="text-lg font-semibold text-white">
                      {getCategoryName(category)}
                    </h3>

                    <p className="mt-1 text-sm text-gray-200">
                      Explore collection →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          FEATURED PRODUCTS
      ================================================== */}
      <section className="bg-[#F8F5EF] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#33473B]">
                Our selection
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#031008] sm:text-4xl">
                Featured furniture
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Discover some of the furniture pieces available
                in the Fernwood collection.
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-[#33473B] hover:text-[#031008]"
            >
              View all →
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader text="Loading furniture..." />
            </div>
          ) : productsError ? (
            <ErrorMessage
              message={productsError}
              onRetry={fetchProducts}
            />
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <h3 className="text-lg font-semibold text-[#031008]">
                No furniture available
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Products will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          SPECIAL OFFER
      ================================================== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="overflow-hidden rounded-2xl bg-[#33473B]">
            <div className="grid items-center lg:grid-cols-2">
              {/* Offer content */}
              <div className="p-8 sm:p-12 lg:p-16">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D9CDBA]">
                  Special collection
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Refresh your home with furniture you'll love.
                </h2>

                <p className="mt-5 max-w-lg leading-7 text-gray-200">
                  Explore our collection of sofas, tables, chairs,
                  beds, storage solutions, and more.
                </p>

                <div className="mt-8">
                  <Link to="/products">
                    <Button
                      variant="secondary"
                      size="large"
                    >
                      Shop the collection
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Offer image */}
              <div className="h-full min-h-[320px]">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
                  alt="Elegant furniture interior"
                  className="h-full min-h-[320px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          NEW ARRIVALS
      ================================================== */}
      <section className="bg-[#F8F5EF] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#33473B]">
                Just added
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#031008] sm:text-4xl">
                New arrivals
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Take a look at the latest furniture added to
                our collection.
              </p>
            </div>

            <Link
              to="/products?sort=newest"
              className="text-sm font-semibold text-[#33473B] hover:text-[#031008]"
            >
              See all new arrivals →
            </Link>
          </div>

          {loadingProducts ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader text="Loading new arrivals..." />
            </div>
          ) : newArrivals.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-gray-500">
                No new arrivals available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          WHY FERNWOOD
      ================================================== */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#33473B]">
              Why Fernwood
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#031008] sm:text-4xl">
              Furniture made for everyday living
            </h2>

            <p className="mt-4 text-gray-600">
              We make it easier to find furniture that combines
              comfort, functionality, and style.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-gray-200 bg-[#F8F5EF] p-7 text-center">
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
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#031008]">
                Quality selection
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Explore furniture selected with comfort,
                functionality, and quality in mind.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-gray-200 bg-[#F8F5EF] p-7 text-center">
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
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h8.25m-11.25 0H3.75m12.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.5a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 17.25 4.5H5.25A2.25 2.25 0 0 0 3 6.75v9.75a2.25 2.25 0 0 0 2.25 2.25h.75m9-14.25h3.75l3 4.5v5.25h-1.5"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#031008]">
                Easy shopping
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Browse products, compare options, and place your
                order from the comfort of your home.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-gray-200 bg-[#F8F5EF] p-7 text-center">
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
                    d="M20.25 8.511c.884.284 1.5 1.126 1.5 2.056v5.868c0 .897-.534 1.707-1.36 2.06l-7.5 3.214a2.25 2.25 0 0 1-1.78 0l-7.5-3.214a2.25 2.25 0 0 1-1.36-2.06v-5.868c0-.93.616-1.772 1.5-2.056l7.5-2.411a2.25 2.25 0 0 1 1.5 0l7.5 2.411Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  />
                </svg>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#031008]">
                Made for your space
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Find different styles, materials, colors, and
                dimensions to match your space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          FINAL CTA
      ================================================== */}
      <section className="bg-[#031008] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C8B89A]">
            Your space. Your style.
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Find the furniture that belongs in your home.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-300">
            Browse the Fernwood Furniture collection and discover
            pieces designed to make your everyday spaces more
            comfortable and beautiful.
          </p>

          <div className="mt-8">
            <Link to="/products">
              <Button
                variant="secondary"
                size="large"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;