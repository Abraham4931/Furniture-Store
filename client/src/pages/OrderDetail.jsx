import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <div className="max-w-3xl mx-auto px-6 py-20 text-inkmuted">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="eyebrow mb-2">Order #{order._id.slice(-8).toUpperCase()}</p>
      <h1 className="font-display text-3xl mb-8">
        Status: <span className="text-forest">{order.status}</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest2 mb-2">Shipping to</p>
          <p className="text-sm text-inkmuted leading-relaxed">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}{order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}<br />
            {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}<br />
            {order.shippingAddress.phone}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest2 mb-2">Payment</p>
          <p className="text-sm text-inkmuted">{order.paymentMethod}</p>
          <p className="text-sm text-inkmuted">{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : "Payment pending"}</p>
        </div>
      </div>

      <div className="divide-y divide-line border-t border-b border-line mb-6">
        {order.items.map((item) => (
          <div key={item.product} className="flex items-center gap-4 py-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-line" />
            <p className="flex-1 text-sm">{item.name} × {item.qty}</p>
            <p className="text-sm font-medium">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="max-w-xs ml-auto space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-inkmuted">Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-inkmuted">Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
        <div className="flex justify-between"><span className="text-inkmuted">Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
        <div className="flex justify-between font-medium pt-1"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
      </div>
    </div>
  );
}
