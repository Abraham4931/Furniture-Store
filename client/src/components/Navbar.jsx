import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalQty } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/shop?keyword=${encodeURIComponent(query)}` : "/shop");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-canvas/95 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="font-display text-2xl tracking-tight">
            Fernwood
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest2">
            <Link to="/shop" className="hover:text-forest transition-colors">Shop</Link>
            <Link to="/shop?category=" className="hover:text-forest transition-colors">Collections</Link>
            {user?.isAdmin && (
              <Link to="/admin" className="hover:text-forest transition-colors">Admin</Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={submitSearch} className="flex items-center border-b border-ink/40 focus-within:border-forest">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pieces…"
                className="bg-transparent py-1 px-1 text-sm w-40 outline-none placeholder:text-inkmuted"
              />
            </form>
            {user ? (
              <div className="flex items-center gap-4 text-sm">
                <Link to="/account" className="hover:text-forest">{user.name.split(" ")[0]}</Link>
                <button onClick={logout} className="text-inkmuted hover:text-forest">Sign out</button>
              </div>
            ) : (
              <Link to="/login" className="text-sm hover:text-forest">Sign in</Link>
            )}
            <Link to="/cart" className="relative text-sm">
              Cart
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-3 bg-forest text-surface text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            <div className="w-6 h-px bg-ink mb-1.5" />
            <div className="w-6 h-px bg-ink" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-line px-6 py-4 space-y-4 font-mono text-xs uppercase tracking-widest2">
          <form onSubmit={submitSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pieces…"
              className="input-field"
            />
          </form>
          <Link to="/shop" onClick={() => setMenuOpen(false)} className="block">Shop</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="block">Cart ({totalQty})</Link>
          {user ? (
            <>
              <Link to="/account" onClick={() => setMenuOpen(false)} className="block">Account</Link>
              {user.isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block">Admin</Link>}
              <button onClick={logout} className="block">Sign out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block">Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
