import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="eyebrow mb-2">Admin</p>
      <h1 className="font-display text-4xl mb-10">Store dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/products" className="border border-line p-8 hover:border-forest transition-colors">
          <p className="font-display text-2xl mb-2">Products</p>
          <p className="text-sm text-inkmuted">Add, edit and remove catalog items.</p>
        </Link>
        <Link to="/admin/orders" className="border border-line p-8 hover:border-forest transition-colors">
          <p className="font-display text-2xl mb-2">Orders</p>
          <p className="text-sm text-inkmuted">Review orders and update fulfillment status.</p>
        </Link>
      </div>
    </div>
  );
}
