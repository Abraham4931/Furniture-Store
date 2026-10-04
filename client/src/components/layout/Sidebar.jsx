import { useState } from "react";

const Sidebar = ({
  categories = [],
  materials = [],
  colors = [],
  onFilterChange,
  onApply,
  onClear,
  className = "",
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleCheckboxChange = (
    value,
    selectedValues,
    setSelectedValues
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(
        selectedValues.filter((item) => item !== value)
      );
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleApply = () => {
    const filters = {
      categories: selectedCategories,
      materials: selectedMaterials,
      colors: selectedColors,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    };

    if (onFilterChange) {
      onFilterChange(filters);
    }

    if (onApply) {
      onApply(filters);
    }
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");

    const filters = {
      categories: [],
      materials: [],
      colors: [],
      minPrice: null,
      maxPrice: null,
    };

    if (onClear) {
      onClear(filters);
    }

    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const renderCheckboxGroup = (
    title,
    items,
    selectedValues,
    setSelectedValues
  ) => {
    if (!items.length) return null;

    return (
      <div className="border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#031008]">
          {title}
        </h3>

        <div className="space-y-3">
          {items.map((item) => {
            const value =
              typeof item === "object"
                ? item.value
                : item;

            const label =
              typeof item === "object"
                ? item.label
                : item;

            return (
              <label
                key={value}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  text-sm
                  text-gray-700
                  transition-colors
                  hover:text-[#031008]
                "
              >
                <input
                  type="checkbox"
                  value={value}
                  checked={selectedValues.includes(value)}
                  onChange={() =>
                    handleCheckboxChange(
                      value,
                      selectedValues,
                      setSelectedValues
                    )
                  }
                  className="
                    h-4
                    w-4
                    rounded
                    border-gray-300
                    text-[#031008]
                    focus:ring-[#33473B]
                  "
                />

                <span>{label}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`
        w-full
        rounded-xl
        border
        border-gray-200
        bg-white
        p-5
        ${className}
      `}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#031008]">
          Filters
        </h2>

        <button
          type="button"
          onClick={handleClear}
          className="
            text-sm
            font-medium
            text-[#33473B]
            transition-colors
            hover:text-[#031008]
          "
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">

        {/* Categories */}
        {renderCheckboxGroup(
          "Category",
          categories,
          selectedCategories,
          setSelectedCategories
        )}

        {/* Price */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#031008]">
            Price
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="min-price"
                className="mb-1.5 block text-xs text-gray-500"
              >
                Min
              </label>

              <input
                id="min-price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(event.target.value)
                }
                placeholder="0"
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-3
                  py-2
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

            <div>
              <label
                htmlFor="max-price"
                className="mb-1.5 block text-xs text-gray-500"
              >
                Max
              </label>

              <input
                id="max-price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
                placeholder="10000"
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-3
                  py-2
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
          </div>
        </div>

        {/* Materials */}
        {renderCheckboxGroup(
          "Material",
          materials,
          selectedMaterials,
          setSelectedMaterials
        )}

        {/* Colors */}
        {renderCheckboxGroup(
          "Color",
          colors,
          selectedColors,
          setSelectedColors
        )}

        {/* Apply */}
        <button
          type="button"
          onClick={handleApply}
          className="
            w-full
            rounded-md
            bg-[#031008]
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-[#33473B]
            focus:outline-none
            focus:ring-2
            focus:ring-[#33473B]
            focus:ring-offset-2
          "
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;