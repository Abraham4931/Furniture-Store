import { Routes, Route } from "react-router-dom";

// Layouts
import StoreLayout from "./layouts/StoreLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

// Store pages
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Profile from "./pages/Profile.jsx";

// Route protection
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

const App = () => {
  return (
    <Routes>
      {/* ================================================================
          STORE
          ================================================================= */}

      <Route element={<StoreLayout />}>
        {/* Public pages */}
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/products/slug/:slug"
          element={<ProductDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Public shopping pages */}
        <Route path="/cart" element={<Cart />} />

        <Route path="/wishlist" element={<Wishlist />} />

        {/* ============================================================
            AUTHENTICATED CUSTOMER PAGES
            ============================================================= */}

        <Route element={<PrivateRoute />}>
          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/orders/:id"
            element={<OrderDetails />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>

        {/* ============================================================
            404
            ============================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>

      {/* ================================================================
          ADMIN PANEL
          ================================================================= */}

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={
              <div>
                <h1 className="text-2xl font-semibold">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-[#66736B]">
                  Manage your Fernwood Furniture store.
                </p>
              </div>
            }
          />

          <Route
            path="/admin/products"
            element={
              <div>
                <h1 className="text-2xl font-semibold">
                  Products
                </h1>
                <p className="mt-2 text-[#66736B]">
                  Manage your products.
                </p>
              </div>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <div>
                <h1 className="text-2xl font-semibold">
                  Orders
                </h1>
                <p className="mt-2 text-[#66736B]">
                  Manage customer orders.
                </p>
              </div>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;