import { Link } from "react-router-dom";

export default function ProductCard({ product, index }) {
  const onSale = product.discountPrice > 0;
  return (
    <Link to={`/product/${product.slug || product._id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface border border-line">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest2 uppercase bg-canvas/90 px-2 py-1">
          No. {String(index + 1).padStart(3, "0")}
        </span>
        {onSale && (
          <span className="absolute top-3 right-3 font-mono text-[10px] tracking-widest2 uppercase bg-rust text-surface px-2 py-1">
            Sale
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="font-display text-lg leading-snug">{product.name}</p>
        <p className="text-xs text-inkmuted font-mono uppercase tracking-widest2 mt-1">
          {product.category?.name || product.material}
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="text-brass font-medium">${product.discountPrice}</span>
              <span className="text-inkmuted line-through text-sm">${product.price}</span>
            </>
          ) : (
            <span className="font-medium">${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
