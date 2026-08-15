import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  brand: "",
  material: "",
  color: "",
  price: "",
  discountPrice: "",
  countInStock: "",
  images: "",
  isFeatured: false,
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
    if (isEdit) {
      api.get(`/products/${id}`).then((res) => {
        const p = res.data;
        setForm({
          name: p.name,
          description: p.description,
          category: p.category?._id || "",
          brand: p.brand || "",
          material: p.material || "",
          color: p.color || "",
          price: p.price,
          discountPrice: p.discountPrice || "",
          countInStock: p.countInStock,
          images: p.images.join(", "),
          isFeatured: p.isFeatured,
        });
      });
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        countInStock: Number(form.countInStock),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">{isEdit ? "Edit product" : "Add product"}</h1>
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="text-rust text-sm">{error}</p>}
        <input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field h-28" />
        <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
          <option value="">Select a category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
          <input placeholder="Material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="input-field" />
        </div>
        <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="input-field" />
        <div className="grid grid-cols-3 gap-4">
          <input required type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
          <input type="number" min="0" step="0.01" placeholder="Sale price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
          <input required type="number" min="0" placeholder="Stock qty" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} className="input-field" />
        </div>
        <input required placeholder="Image URLs, comma-separated" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="input-field" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
          Feature on homepage
        </label>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving…" : "Save product"}
        </button>
      </form>
    </div>
  );
}
