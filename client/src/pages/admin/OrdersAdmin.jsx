import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get("/orders").then((res) => setOrders(res.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-10">Orders</h1>
      <div className="divide-y divide-line border-t border-b border-line">
        {orders.map((o) => (
          <div key={o._id} className="flex items-center gap-4 py-3 text-sm">
            <Link to={`/order/${o._id}`} className="w-32 hover:text-forest">#{o._id.slice(-8).toUpperCase()}</Link>
            <p className="flex-1 text-inkmuted">{o.user?.name} · {o.user?.email}</p>
            <p className="w-24">${o.totalPrice.toFixed(2)}</p>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o._id, e.target.value)}
              className="input-field py-1.5 w-36 text-xs"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
