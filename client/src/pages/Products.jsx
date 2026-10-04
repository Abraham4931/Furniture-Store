import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import Button from "../components/common/Button";

import {
  getProducts,
  getCategories,
} from "../services/productApi";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --------------------------------------------------
  // Data
  // --------------------------------------------------

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [productsError, setProductsError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [filters, setFilters] = useState({
    categories: searchParams.get("category")
      ? [searchParams.get("category")]
      : [],
    materials: searchParams.get("material")
      ? [searchParams.get("material")]
      : [],
    colors: searchParams.get("color")
      ? [searchParams.get("color")]
      : [],
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "featured"
  );

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  // --------------------------------------------------
  // Fetch products
  // --------------------------------------------------

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductsError("");

      const response = await getProducts();

      const data = response.data;

      /*
       * Supports common API response formats:
       *
       * [...]
       * { products: [...] }
       * { data: [...] }
       */
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
  // Initial loading
  // --------------------------------------------------

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Extract filter options from products
  // --------------------------------------------------

  const materials = useMemo(() => {
    const values = products
      .map((product) => {
        return (
          product.material ||
          product.material_name ||
          product.variant?.material ||
          ""
        );
      })
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  const colors = useMemo(() => {
    const values = products
      .map((product) => {
        return (
          product.color ||
          product.color_name ||
          product.variant?.color ||
          ""
        );
      })
      .filter(Boolean);

    return [...new Set(values)];
  }, [products]);

  // --------------------------------------------------
  // Category helper
  // --------------------------------------------------

  const getCategoryValue = (product) => {
    if (product.category?.slug) {
      return product.category.slug;
    }

    if (product.category?.id) {
      return String(product.category.id);
    }

    if (product.category_slug) {
      return product.category_slug;
    }

    if (product.category_id) {
      return String(product.category_id);
    }

    return "";
  };

  const getCategoryName = (product) => {
    return (
      product.category?.name ||
      product.category_name ||
      ""
    );
  };

  // --------------------------------------------------
  // Price helper
  // --------------------------------------------------

  const getProductPrice = (product) => {
    const price =
      product.discount_price ??
      product.price ??
      product.variant?.discount_price ??
      product.variant?.price ??
      0;

    return Number(price);
  };

  // --------------------------------------------------
  // Search helper
  // --------------------------------------------------

  const getSearchableText = (product) => {
    return [
      product.name,
      product.title,
      product.description,
      product.sku,
      product.material,
      product.material_name,
      product.color,
      product.color_name,
      product.category_name,
      product.category?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  // --------------------------------------------------
  // Apply filters
  // --------------------------------------------------

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();

      result = result.filter((product) =>
        getSearchableText(product).includes(searchTerm)
      );
    }

    // Category
    if (filters.categories.length > 0) {
      result = result.filter((product) => {
        const categoryValue =
          getCategoryValue(product);

        const categoryName =
          getCategoryName(product).toLowerCase();

        return filters.categories.some((category) => {
          const selected = String(category).toLowerCase();

          return (
            categoryValue.toLowerCase() === selected ||
            categoryName === selected
          );
        });
      });
    }

    // Material
    if (filters.materials.length > 0) {
      result = result.filter((product) => {
        const material = String(
          product.material ||
            product.material_name ||
            product.variant?.material ||
            ""
        ).toLowerCase();

        return filters.materials.some(
          (selectedMaterial) =>
            material ===
            String(selectedMaterial).toLowerCase()
        );
      });
    }

    // Color
    if (filters.colors.length > 0) {
      result = result.filter((product) => {
        const color = String(
          product.color ||
            product.color_name ||
            product.variant?.color ||
            ""
        ).toLowerCase();

        return filters.colors.some(
          (selectedColor) =>
            color ===
            String(selectedColor).toLowerCase()
        );
      });
    }

    // Minimum price
    if (filters.minPrice !== "") {
      const minPrice = Number(filters.minPrice);

      if (!Number.isNaN(minPrice)) {
        result = result.filter(
          (product) =>
            getProductPrice(product) >= minPrice
        );
      }
    }

    // Maximum price
    if (filters.maxPrice !== "") {
      const maxPrice = Number(filters.maxPrice);

      if (!Number.isNaN(maxPrice)) {
        result = result.filter(
          (product) =>
            getProductPrice(product) <= maxPrice
        );
      }
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            getProductPrice(a) -
            getProductPrice(b)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            getProductPrice(b) -
            getProductPrice(a)
        );
        break;

      case "name-asc":
        result.sort((a, b) =>
          String(
            a.name || a.title || ""
          ).localeCompare(
            String(b.name || b.title || "")
          )
        );
        break;

      case "name-desc":
        result.sort((a, b) =>
          String(
            b.name || b.title || ""
          ).localeCompare(
            String(a.name || a.title || "")
          )
        );
        break;

      case "newest":
        result.sort((a, b) => {
          const dateA = new Date(
            a.created_at ||
              a.createdAt ||
              0
          ).getTime();

          const dateB = new Date(
            b.created_at ||
              b.createdAt ||
              0
          ).getTime();

          return dateB - dateA;
        });
        break;

      default:
        // Featured/default order from API
        break;
    }

    return result;
  }, [products, search, filters, sortBy]);

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const totalProducts = filteredProducts.length;

  const totalPages = Math.ceil(
    totalProducts / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = useMemo(() => {
    const start =
      (currentPage - 1) * PRODUCTS_PER_PAGE;

    const end =
      start + PRODUCTS_PER_PAGE;

    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // --------------------------------------------------
  // Keep page valid after filtering
  // --------------------------------------------------

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // --------------------------------------------------
  // Update URL
  // --------------------------------------------------

  useEffect(() => {
    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (filters.categories.length > 0) {
      params.category =
        filters.categories.join(",");
    }

    if (filters.materials.length > 0) {
      params.material =
        filters.materials.join(",");
    }

    if (filters.colors.length > 0) {
      params.color =
        filters.colors.join(",");
    }

    if (filters.minPrice !== "") {
      params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== "") {
      params.maxPrice = filters.maxPrice;
    }

    if (sortBy !== "featured") {
      params.sort = sortBy;
    }

    if (currentPage > 1) {
      params.page = currentPage;
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [
    search,
    filters,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Filter changes
  // --------------------------------------------------

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Apply filters
  // --------------------------------------------------

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  // --------------------------------------------------
  // Clear filters
  // --------------------------------------------------

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      materials: [],
      colors: [],
      minPrice: "",
      maxPrice: "",
    });

    setSearch("");
    setSortBy("featured");
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // Generate pagination buttons
  // --------------------------------------------------

  const getPaginationPages = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  // --------------------------------------------------
  // Active filter count
  // --------------------------------------------------

  const activeFilterCount =
    filters.categories.length +
    filters.materials.length +
    filters.colors.length +
    (filters.minPrice !== "" ? 1 : 0) +
    (filters.maxPrice !== "" ? 1 : 0);

  // --------------------------------------------------
  // Product range
  // --------------------------------------------------

  const firstProduct =
    totalProducts === 0
      ? 0
      : (currentPage - 1) *
          PRODUCTS_PER_PAGE +
        1;

  const lastProduct = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    totalProducts
  );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8F5EF]">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}
      <section className="bg-[#031008]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8B89A]">
            Fernwood Furniture
          </p>

          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Furniture Collection
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">
            Explore our complete collection of furniture
            designed for comfort, functionality, and style.
          </p>
        </div>
      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12 lg:py-12">
        {/* Search and mobile filters */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.606 10.606Z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search furniture..."
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                py-3
                pl-11
                pr-4
                text-sm
                text-[#031008]
                outline-none
                transition
                focus:border-[#33473B]
                focus:ring-2
                focus:ring-[#33473B]/20
              "
            />
          </div>

          {/* Mobile filter button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              fullWidth
              onClick={() =>
                setMobileFiltersOpen(
                  !mobileFiltersOpen
                )
              }
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
                  d="M10.5 6h9.75M10.5 6a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0M3.75 6H4.5m9 12h6.75m0 0a3 3 0 1 0-6 0m6 0a3 3 0 1 1-6 0m-3 0H3.75m9-6h6.75m0 0a3 3 0 1 0-6 0m6 0a3 3 0 1 1-6 0m-3 0H3.75"
                />
              </svg>

              Filters

              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#031008] px-1.5 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* ==================================================
              SIDEBAR
          ================================================== */}
          <aside
            className={`
              ${
                mobileFiltersOpen
                  ? "block"
                  : "hidden"
              }
              lg:block
            `}
          >
            <div className="sticky top-6">
              {loadingCategories ? (
                <div className="rounded-xl bg-white p-6">
                  <Loader
                    text="Loading filters..."
                    showText
                  />
                </div>
              ) : categoriesError ? (
                <ErrorMessage
                  message={categoriesError}
                  onRetry={fetchCategories}
                />
              ) : (
                <Sidebar
                  categories={categories.map(
                    (category) => ({
                      value:
                        category.slug ||
                        category.id,
                      label:
                        category.name ||
                        category.title ||
                        "Category",
                    })
                  )}
                  materials={materials}
                  colors={colors}
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  selectedCategories={
                    filters.categories
                  }
                  selectedMaterials={
                    filters.materials
                  }
                  selectedColors={
                    filters.colors
                  }
                  onFilterChange={
                    handleFilterChange
                  }
                  onApply={handleApplyFilters}
                  onClear={handleClearFilters}
                />
              )}
            </div>
          </aside>

          {/* ==================================================
              PRODUCT AREA
          ================================================== */}
          <section className="min-w-0">
            {/* Top controls */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              {/* Result count */}
              <div>
                {loadingProducts ? (
                  <p className="text-sm text-gray-500">
                    Loading products...
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-[#031008]">
                      {firstProduct}
                    </span>
                    {" - "}
                    <span className="font-semibold text-[#031008]">
                      {lastProduct}
                    </span>
                    {" of "}
                    <span className="font-semibold text-[#031008]">
                      {totalProducts}
                    </span>{" "}
                    products
                  </p>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <label
                  htmlFor="sort"
                  className="whitespace-nowrap text-sm text-gray-600"
                >
                  Sort by
                </label>

                <select
                  id="sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className="
                    rounded-md
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2
                    text-sm
                    text-[#031008]
                    outline-none
                    focus:border-[#33473B]
                    focus:ring-2
                    focus:ring-[#33473B]/20
                  "
                >
                  <option value="featured">
                    Featured
                  </option>

                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="name-asc">
                    Name: A-Z
                  </option>

                  <option value="name-desc">
                    Name: Z-A
                  </option>
                </select>
              </div>
            </div>

            {/* ==================================================
                PRODUCTS
            ================================================== */}
            {loadingProducts ? (
              <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white">
                <Loader text="Loading furniture..." />
              </div>
            ) : productsError ? (
              <ErrorMessage
                message={productsError}
                onRetry={fetchProducts}
              />
            ) : (
              <>
                <ProductGrid
                  products={paginatedProducts}
                  emptyMessage={
                    search
                      ? `No furniture matches "${search}". Try a different search or clear your filters.`
                      : "No furniture matches your selected filters."
                  }
                />

                {/* ==================================================
                    PAGINATION
                ================================================== */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    {/* Previous */}
                    <button
                      type="button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        handlePageChange(
                          currentPage - 1
                        )
                      }
                      className="
                        rounded-md
                        border
                        border-gray-300
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-[#031008]
                        transition
                        hover:bg-[#F8F5EF]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      ← Previous
                    </button>

                    {/* Page numbers */}
                    {getPaginationPages().map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              page
                            )
                          }
                          className={`
                            h-10
                            min-w-10
                            rounded-md
                            border
                            px-3
                            text-sm
                            font-medium
                            transition
                            ${
                              currentPage ===
                              page
                                ? "border-[#031008] bg-[#031008] text-white"
                                : "border-gray-300 bg-white text-[#031008] hover:bg-[#F8F5EF]"
                            }
                          `}
                        >
                          {page}
                        </button>
                      )
                    )}

                    {/* Next */}
                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        handlePageChange(
                          currentPage + 1
                        )
                      }
                      className="
                        rounded-md
                        border
                        border-gray-300
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-[#031008]
                        transition
                        hover:bg-[#F8F5EF]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Products;