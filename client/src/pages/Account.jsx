import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-2">Hello, {user.name.split(" ")[0]}</h1>
      <p className="text-inkmuted mb-10">{user.email}</p>

      <h2 className="font-mono text-xs uppercase tracking-widest2 mb-4">Order history</h2>
      {orders.length === 0 ? (
        <p className="text-inkmuted text-sm">You haven't placed any orders yet.</p>
      ) : (
        <div className="divide-y divide-line border-t border-b border-line">
          {orders.map((o) => (
            <Link key={o._id} to={`/order/${o._id}`} className="flex items-center justify-between py-4 hover:bg-surface px-2 -mx-2">
              <div>
                <p className="font-medium text-sm">Order #{o._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-inkmuted">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-xs font-mono uppercase tracking-widest2">{o.status}</p>
              <p className="font-medium">${o.totalPrice.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
