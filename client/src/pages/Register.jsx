import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-4xl mb-8">Create an account</h1>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-rust text-sm">{error}</p>}
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
        <input required type="password" minLength={6} placeholder="Password (min. 6 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-inkmuted mt-6">
        Already have an account? <Link to="/login" className="text-forest hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
