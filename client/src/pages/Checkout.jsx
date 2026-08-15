import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Checkout() {
  const { items, itemsPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    line1: "",
    line2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const shippingPrice = itemsPrice > 500 ? 0 : 25;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({ product: i.product, qty: i.qty })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center text-inkmuted">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-10">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-12">
        <form onSubmit={placeOrder} className="md:col-span-2 space-y-4">
          {error && <p className="text-rust text-sm">{error}</p>}
          <p className="font-mono text-xs uppercase tracking-widest2 mb-2">Shipping address</p>
          <input required placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="input-field" />
          <input required placeholder="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="input-field" />
          <input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="input-field" />
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
            <input placeholder="Region/State" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="input-field" />
            <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" />
          </div>
          <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />

          <p className="font-mono text-xs uppercase tracking-widest2 mb-2 pt-4">Payment method</p>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
            <option>Cash on Delivery</option>
            <option>Bank Transfer</option>
            <option>Card on Delivery</option>
          </select>

          <button type="submit" disabled={placing} className="btn-primary w-full mt-6 disabled:opacity-50">
            {placing ? "Placing order…" : `Place order — $${totalPrice}`}
          </button>
        </form>

        <div className="bg-surface border border-line p-6 h-fit">
          <p className="font-mono text-xs uppercase tracking-widest2 mb-4">Order summary</p>
          <div className="space-y-2 mb-4">
            {items.map((i) => (
              <div key={i.product} className="flex justify-between text-sm">
                <span className="text-inkmuted">{i.name} × {i.qty}</span>
                <span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="grain-rule mb-3" />
          <div className="flex justify-between text-sm mb-1"><span className="text-inkmuted">Subtotal</span><span>${itemsPrice.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mb-1"><span className="text-inkmuted">Shipping</span><span>{shippingPrice === 0 ? "Free" : `$${shippingPrice}`}</span></div>
          <div className="flex justify-between text-sm mb-3"><span className="text-inkmuted">Tax</span><span>${taxPrice}</span></div>
          <div className="grain-rule mb-3" />
          <div className="flex justify-between font-medium"><span>Total</span><span>${totalPrice}</span></div>
        </div>
      </div>
    </div>
  );
}
