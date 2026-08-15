import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-2xl mb-3">Fernwood</p>
          <p className="text-sm text-inkmuted max-w-xs">
            Solid-wood furniture, built by a small workshop and sold direct — no showroom markup.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-forest">All pieces</Link></li>
            <li><Link to="/shop?sort=newest" className="hover:text-forest">New arrivals</Link></li>
            <li><Link to="/shop?featured=true" className="hover:text-forest">Featured</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Account</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/account" className="hover:text-forest">Order history</Link></li>
            <li><Link to="/login" className="hover:text-forest">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Workshop</p>
          <p className="text-sm text-inkmuted">Mon–Fri, 9:00–18:00<br />hello@fernwood.example</p>
        </div>
      </div>
      <div className="grain-rule" />
      <p className="text-center text-xs text-inkmuted py-6 font-mono tracking-widest2 uppercase">
        Fernwood Furniture Co. — Demo storefront
      </p>
    </footer>
  );
}
