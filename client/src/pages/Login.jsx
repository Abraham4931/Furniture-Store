import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(searchParams.get("redirect") || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-4xl mb-2">Sign in</h1>
      <p className="text-inkmuted text-sm mb-8">
        Demo admin: admin@furniture.com / admin1234 · Demo shopper: shopper@example.com / shopper1234
      </p>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-rust text-sm">{error}</p>}
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-inkmuted mt-6">
        New here? <Link to="/register" className="text-forest hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
