import ProductCard from "./ProductCard";

const ProductGrid = ({
  products = [],
  onAddToCart,
  emptyMessage = "No products found.",
  className = "",
}) => {
  if (!products.length) {
    return (
      <div
        className={`
          flex
          min-h-[300px]
          items-center
          justify-center
          rounded-xl
          border
          border-gray-200
          bg-white
          p-8
          ${className}
        `}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F5EF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-[#33473B]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.197 5.197a7.5 7.5 0 0 0 10.606 10.606Z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-[#031008]">
            No products found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        ${className}
      `}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;