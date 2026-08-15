import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const featured = searchParams.get("featured") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (featured) params.featured = featured;

    api
      .get("/products", { params })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [keyword, category, sort, featured, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="eyebrow mb-2">Full catalog</p>
        <h1 className="font-display text-4xl">{keyword ? `Results for "${keyword}"` : "Shop all pieces"}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-56 shrink-0 space-y-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 mb-3">Category</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => updateParam("category", "")} className={`hover:text-forest ${!category ? "text-forest font-medium" : "text-inkmuted"}`}>
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => updateParam("category", c._id)}
                    className={`hover:text-forest ${category === c._id ? "text-forest font-medium" : "text-inkmuted"}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 mb-3">Sort by</p>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="input-field text-sm"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <p className="text-inkmuted text-sm">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-inkmuted text-sm">No pieces match those filters yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={(page - 1) * 12 + i} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex gap-2 mt-12 font-mono text-xs">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam("page", String(p))}
                      className={`w-8 h-8 border ${p === page ? "bg-forest text-surface border-forest" : "border-line hover:border-forest"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
