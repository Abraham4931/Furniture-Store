import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-4xl mb-6">This piece isn't in the catalog.</h1>
      <Link to="/" className="btn-primary">Back home</Link>
    </div>
  );
}
