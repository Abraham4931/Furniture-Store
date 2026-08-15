import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/products/featured/list").then((res) => setFeatured(res.data)).catch(() => {});
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <p className="eyebrow mb-6">Est. workshop No. 04 — Solid wood, direct from the maker</p>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
            Furniture built to <span className="italic text-forest">outlast</span> the room
            it sits in.
          </h1>
          <p className="mt-6 text-inkmuted max-w-md text-lg">
            Every piece is joined, sanded and finished by hand from solid oak, walnut and ash —
            no veneer, no particleboard, no showroom markup.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/shop" className="btn-primary">Browse the catalog</Link>
            <Link to="/shop?featured=true" className="btn-outline">Featured pieces</Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="aspect-[3/4] overflow-hidden border border-line">
            <img
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900"
              alt="Solid wood armchair in a sunlit room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <div className="grain-rule max-w-7xl mx-auto" />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl">Shop by room</h2>
          <Link to="/shop" className="font-mono text-xs uppercase tracking-widest2 hover:text-forest">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat._id}`}
              className="group relative aspect-square overflow-hidden bg-surface border border-line flex items-end p-4"
            >
              <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest2 text-inkmuted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl relative z-10 group-hover:text-forest transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grain-rule max-w-7xl mx-auto" />

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl">Featured pieces</h2>
          <Link to="/shop?featured=true" className="font-mono text-xs uppercase tracking-widest2 hover:text-forest">View all →</Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-inkmuted text-sm">No featured products yet — run the seed script to load sample data.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featured.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Craft statement */}
      <section className="bg-forest text-surface">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 opacity-70 mb-2">01 — Material</p>
            <p className="font-display text-xl">Kiln-dried hardwood, sourced from managed forests.</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 opacity-70 mb-2">02 — Joinery</p>
            <p className="font-display text-xl">Mortise-and-tenon frames, not staples or particleboard.</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 opacity-70 mb-2">03 — Delivery</p>
            <p className="font-display text-xl">Shipped assembled where possible, insured door to door.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
