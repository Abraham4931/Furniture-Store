import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/products", { params: { limit: 100 } }).then((res) => setProducts(res.data.products)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-4xl">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">Add product</Link>
      </div>

      {loading ? (
        <p className="text-inkmuted text-sm">Loading…</p>
      ) : (
        <div className="divide-y divide-line border-t border-b border-line">
          {products.map((p) => (
            <div key={p._id} className="flex items-center gap-4 py-3">
              <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover border border-line" />
              <p className="flex-1 text-sm">{p.name}</p>
              <p className="text-sm text-inkmuted w-24">{p.countInStock} in stock</p>
              <p className="text-sm font-medium w-20">${p.price}</p>
              <Link to={`/admin/products/${p._id}/edit`} className="text-xs font-mono uppercase tracking-widest2 hover:text-forest">Edit</Link>
              <button onClick={() => remove(p._id)} className="text-xs font-mono uppercase tracking-widest2 hover:text-rust">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
