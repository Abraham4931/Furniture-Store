import { useState } from "react";

const ProductImages = ({
  images = [],
  productName = "Product",
  mainImage = "",
  onImageChange,
  className = "",
}) => {
  /*
   * Normalize images so the component can work with:
   *
   * [
   *   "/images/sofa-1.jpg",
   *   "/images/sofa-2.jpg"
   * ]
   *
   * or:
   *
   * [
   *   { id: 1, image_url: "/images/sofa-1.jpg" },
   *   { id: 2, image_url: "/images/sofa-2.jpg" }
   * ]
   */

  const normalizedImages = images
    .map((image, index) => {
      if (typeof image === "string") {
        return {
          id: index,
          url: image,
        };
      }

      return {
        id: image.id ?? index,
        url:
          image.image_url ||
          image.url ||
          image.image ||
          "",
      };
    })
    .filter((image) => image.url);

  /*
   * If a main image is provided separately, make sure
   * it appears in the gallery.
   */
  const allImages = mainImage
    ? [
        {
          id: "main",
          url: mainImage,
        },
        ...normalizedImages.filter(
          (image) => image.url !== mainImage
        ),
      ]
    : normalizedImages;

  const [selectedImage, setSelectedImage] = useState(
    allImages[0]?.url || ""
  );

  const handleImageSelect = (image) => {
    setSelectedImage(image.url);

    if (onImageChange) {
      onImageChange(image);
    }
  };

  /*
   * Empty state
   */
  if (!allImages.length) {
    return (
      <div
        className={`
          w-full
          ${className}
        `}
      >
        <div
          className="
            flex
            aspect-square
            w-full
            items-center
            justify-center
            rounded-xl
            bg-[#F8F5EF]
            text-gray-400
          "
        >
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mx-auto h-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 3.75-3.75 3 3 4.5-4.5 8.25 8.25"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4.5h18v15H3z"
              />
            </svg>

            <p className="mt-3 text-sm">
              No product images available
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>

      {/* Main Image */}
      <div
        className="
          relative
          overflow-hidden
          rounded-xl
          bg-[#F8F5EF]
        "
      >
        <div className="aspect-square w-full">
          <img
            src={selectedImage}
            alt={productName}
            className="
              h-full
              w-full
              object-cover
              transition-opacity
              duration-300
            "
          />
        </div>

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div
            className="
              absolute
              bottom-3
              right-3
              rounded-full
              bg-black/60
              px-3
              py-1
              text-xs
              font-medium
              text-white
            "
          >
            {Math.max(
              1,
              allImages.findIndex(
                (image) => image.url === selectedImage
              ) + 1
            )}{" "}
            / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="mt-4">
          <div
            className="
              flex
              gap-3
              overflow-x-auto
              pb-2
            "
          >
            {allImages.map((image, index) => {
              const isSelected =
                image.url === selectedImage;

              return (
                <button
                  key={image.id ?? index}
                  type="button"
                  onClick={() =>
                    handleImageSelect(image)
                  }
                  className={`
                    relative
                    h-20
                    w-20
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    border-2
                    bg-[#F8F5EF]
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "border-[#031008] ring-2 ring-[#33473B]/20"
                        : "border-transparent hover:border-gray-300"
                    }
                  `}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={isSelected}
                >
                  <img
                    src={image.url}
                    alt={`${productName} ${index + 1}`}
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;