import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Get logged-in user
  const storedUser = localStorage.getItem("fernwood_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Example cart count.
  // Later this will come from CartContext.
  const cartCount = 0;

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/products?search=${encodeURIComponent(value)}`);
    setSearch("");
  };

  const handleLogout = () => {
    localStorage.removeItem("fernwood_user");

    navigate("/login");

    window.location.reload();
  };

  const navLinkClass = ({ isActive }) =>
    `
      text-sm
      font-medium
      transition-colors
      duration-200
      ${
        isActive
          ? "text-[#33473B]"
          : "text-[#031008] hover:text-[#33473B]"
      }
    `;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* =========================
              LOGO
          ========================== */}
          <Link
            to="/"
            className="shrink-0 text-xl font-bold tracking-wide text-[#031008]"
          >
            Fernwood
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}
          <nav className="hidden items-center gap-6 lg:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>

            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
          </nav>

          {/* =========================
              SEARCH
          ========================== */}
          <form
            onSubmit={handleSearch}
            className="hidden flex-1 max-w-md md:block"
          >
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search furniture..."
                className="
                  w-full
                  rounded-full
                  border
                  border-gray-300
                  bg-gray-50
                  py-2
                  pl-4
                  pr-10
                  text-sm
                  text-[#031008]
                  outline-none
                  transition
                  focus:border-[#33473B]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#33473B]/20
                "
              />

              <button
                type="submit"
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  rounded-full
                  p-1.5
                  text-gray-500
                  hover:text-[#031008]
                "
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* =========================
              RIGHT SIDE
          ========================== */}
          <div className="hidden items-center gap-4 sm:flex">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-[#031008] hover:text-[#33473B]"
              aria-label="Wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-[#031008] hover:text-[#33473B]"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6"
                />
                <circle cx="10" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
              </svg>

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-[#031008]
                    px-1
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* =========================
                AUTHENTICATION
            ========================== */}
            {user ? (
              <div className="group relative">
                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-md
                    px-2
                    py-1.5
                    text-sm
                    font-medium
                    text-[#031008]
                    hover:bg-gray-100
                  "
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#031008] text-sm text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>

                  <span className="hidden xl:block">
                    {user.name || "Account"}
                  </span>

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
                      d="m6 9 6 6 6-6"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  className="
                    invisible
                    absolute
                    right-0
                    top-full
                    mt-2
                    w-48
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    p-2
                    opacity-0
                    shadow-lg
                    transition-all
                    group-hover:visible
                    group-hover:opacity-100
                  "
                >
                  <Link
                    to="/profile"
                    className="
                      block
                      rounded-md
                      px-3
                      py-2
                      text-sm
                      text-gray-700
                      hover:bg-gray-100
                    "
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="
                      block
                      rounded-md
                      px-3
                      py-2
                      text-sm
                      text-gray-700
                      hover:bg-gray-100
                    "
                  >
                    My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      block
                      w-full
                      rounded-md
                      px-3
                      py-2
                      text-left
                      text-sm
                      text-red-600
                      hover:bg-red-50
                    "
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="
                    text-sm
                    font-medium
                    text-[#031008]
                    hover:text-[#33473B]
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    rounded-md
                    bg-[#031008]
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-[#33473B]
                  "
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================== */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="
              rounded-md
              p-2
              text-[#031008]
              hover:bg-gray-100
              sm:hidden
            "
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* =========================
            MOBILE MENU
        ========================== */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 sm:hidden">

            {/* Mobile search */}
            <form
              onSubmit={handleSearch}
              className="mb-4"
            >
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search furniture..."
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-4
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-[#33473B]
                  focus:ring-2
                  focus:ring-[#33473B]/20
                "
              />
            </form>

            {/* Mobile navigation */}
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
              >
                Products
              </Link>

              <Link
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
              >
                Categories
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
              >
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
                  >
                    My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      rounded-md
                      px-3
                      py-2.5
                      text-left
                      text-sm
                      font-medium
                      text-red-600
                      hover:bg-red-50
                    "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-[#031008] hover:bg-gray-100"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md bg-[#031008] px-3 py-2.5 text-sm font-medium text-white hover:bg-[#33473B]"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;