import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      api.get(`/products/${res.data._id}/reviews`).then((r) => setReviews(r.data));
    });
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      const r = await api.get(`/products/${product._id}/reviews`);
      setReviews(r.data);
      const updated = await api.get(`/products/${product._id}`);
      setProduct(updated.data);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.response?.data?.message || "Could not submit review");
    }
  };

  if (!product) return <div className="max-w-7xl mx-auto px-6 py-20 text-inkmuted">Loading…</div>;

  const onSale = product.discountPrice > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-[4/5] border border-line overflow-hidden mb-3">
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 border overflow-hidden ${i === activeImage ? "border-forest" : "border-line"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-2">{product.category?.name}</p>
          <h1 className="font-display text-4xl mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            {onSale ? (
              <>
                <span className="text-2xl text-brass font-medium">${product.discountPrice}</span>
                <span className="text-inkmuted line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-medium">${product.price}</span>
            )}
          </div>
          <p className="text-inkmuted leading-relaxed mb-6">{product.description}</p>

          <div className="grid grid-cols-2 gap-y-2 text-sm mb-6 font-mono">
            {product.material && <><span className="text-inkmuted">Material</span><span>{product.material}</span></>}
            {product.color && <><span className="text-inkmuted">Color</span><span>{product.color}</span></>}
            {product.dimensions?.width && (
              <>
                <span className="text-inkmuted">Dimensions</span>
                <span>{product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} {product.dimensions.unit}</span>
              </>
            )}
            <span className="text-inkmuted">Availability</span>
            <span>{product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of stock"}</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="input-field w-24">
              {Array.from({ length: Math.min(product.countInStock, 10) || 1 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <button
              disabled={product.countInStock === 0}
              onClick={() => {
                addItem(product, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1500);
              }}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>

          {product.numReviews > 0 && (
            <p className="text-sm text-inkmuted">★ {product.rating.toFixed(1)} · {product.numReviews} review{product.numReviews !== 1 && "s"}</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 max-w-2xl">
        <h2 className="font-display text-2xl mb-6">Reviews</h2>
        <div className="space-y-6 mb-10">
          {reviews.length === 0 && <p className="text-inkmuted text-sm">No reviews yet — be the first.</p>}
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-line pb-4">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-brass text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
              </div>
              <p className="text-sm text-inkmuted">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={submitReview} className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-widest2">Leave a review</p>
            {reviewError && <p className="text-rust text-sm">{reviewError}</p>}
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="input-field w-32"
            >
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n !== 1 && "s"}</option>)}
            </select>
            <textarea
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your thoughts on this piece…"
              className="input-field h-24"
            />
            <button type="submit" className="btn-outline">Submit review</button>
          </form>
        ) : (
          <p className="text-sm text-inkmuted">
            <button onClick={() => navigate("/login")} className="underline hover:text-forest">Sign in</button> to leave a review.
          </p>
        )}
      </div>
    </div>
  );
}
