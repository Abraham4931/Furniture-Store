import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Cart() {
  const { items, updateQty, removeItem, itemsPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-10">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-inkmuted mb-6">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary">Browse the catalog</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 divide-y divide-line">
            {items.map((item) => (
              <div key={item.product} className="flex gap-4 py-6">
                <img src={item.image} alt={item.name} className="w-24 h-28 object-cover border border-line" />
                <div className="flex-1">
                  <p className="font-display text-lg">{item.name}</p>
                  <p className="text-sm text-inkmuted mb-2">${item.price} each</p>
                  <div className="flex items-center gap-3">
                    <select
                      value={item.qty}
                      onChange={(e) => updateQty(item.product, Number(e.target.value))}
                      className="input-field w-20 py-1.5"
                    >
                      {Array.from({ length: Math.min(item.countInStock, 10) || 1 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <button onClick={() => removeItem(item.product)} className="text-xs text-inkmuted hover:text-rust font-mono uppercase tracking-widest2">
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-line p-6 h-fit">
            <p className="font-mono text-xs uppercase tracking-widest2 mb-4">Order summary</p>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-inkmuted">Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-inkmuted mb-6">Shipping and tax calculated at checkout.</p>
            <button
              onClick={() => navigate(user ? "/checkout" : "/login?redirect=/checkout")}
              className="btn-primary w-full"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
