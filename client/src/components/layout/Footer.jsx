import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#031008] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* =========================
            MAIN FOOTER
        ========================== */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* =========================
              COMPANY
          ========================== */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold tracking-wide"
            >
              Fernwood
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-300">
              Quality furniture designed to make your
              home comfortable, beautiful, and unique.
            </p>

            {/* Social Media */}
            <div className="mt-6 flex items-center gap-3">

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-600
                  text-gray-300
                  transition
                  hover:border-white
                  hover:text-white
                "
              >
                f
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-600
                  text-gray-300
                  transition
                  hover:border-white
                  hover:text-white
                "
              >
                ◎
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-600
                  text-gray-300
                  transition
                  hover:border-white
                  hover:text-white
                "
              >
                𝕏
              </a>
            </div>
          </div>

          {/* =========================
              USEFUL LINKS
          ========================== */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================
              CATEGORIES
          ========================== */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Categories
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/products?category=sofas"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Sofas
                </Link>
              </li>

              <li>
                <Link
                  to="/products?category=chairs"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Chairs
                </Link>
              </li>

              <li>
                <Link
                  to="/products?category=tables"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Tables
                </Link>
              </li>

              <li>
                <Link
                  to="/products?category=beds"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Beds
                </Link>
              </li>

              <li>
                <Link
                  to="/products?category=storage"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* =========================
              CONTACT
          ========================== */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>

            <ul className="mt-5 space-y-4">

              {/* Email */}
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75"
                  />
                </svg>

                <a
                  href="mailto:info@fernwood.com"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  info@fernwood.com
                </a>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372a1.5 1.5 0 0 0-1.064-1.436l-4.426-1.36a1.5 1.5 0 0 0-1.5.357l-.97.97a12.035 12.035 0 0 1-5.249-5.249l.97-.97a1.5 1.5 0 0 0 .357-1.5l-1.36-4.426A1.5 1.5 0 0 0 7.07 3.75H5.75A2.25 2.25 0 0 0 3.5 6v.75"
                  />
                </svg>

                <a
                  href="tel:+251900000000"
                  className="text-sm text-gray-300 transition hover:text-white"
                >
                  +251 900 000 000
                </a>
              </li>

              {/* Address */}
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>

                <span className="text-sm leading-6 text-gray-300">
                  Addis Ababa, Ethiopia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================
            DIVIDER
        ========================== */}
        <div className="my-10 border-t border-gray-700" />

        {/* =========================
            BOTTOM
        ========================== */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          <p className="text-sm text-gray-400">
            © {currentYear} Fernwood Furniture. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/privacy"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;