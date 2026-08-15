import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import OrdersAdmin from "./pages/admin/OrdersAdmin.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-body">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order/:id" element={<OrderDetail />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductsAdmin />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id/edit" element={<ProductForm />} />
            <Route path="/admin/orders" element={<OrdersAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
