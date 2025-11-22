import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";
import { injectGlobalStyles } from "../styles/colors";

export default function ProductDetails() {
  useEffect(() => { injectGlobalStyles(); }, []);
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`, { headers });
        setProduct(data);
      } catch (e) {
        if (e.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else if (e.response?.status === 404) {
          alert("Product not found");
          navigate("/products");
        } else {
          console.error(e);
          alert("Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers });
      navigate("/products");
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Navbar />
      <main style={{ padding: 32, background: "var(--cream)", minHeight: "100vh" }}>
        <div className="card" style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
              <ArrowLeft size={16} /> Back
            </button>
            <h2 style={{ margin: 0, color: "var(--brown)" }}>{product.name}</h2>
            <p style={{ margin: 0, color: "#666" }}>SKU: {product.sku || "-"}</p>
          </div>
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} /> Delete
          </button>
        </div>

        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div className="form-label">Category</div>
            <div>{product.category || "-"}</div>
          </div>
          <div>
            <div className="form-label">Unit</div>
            <div>{product.unit || "pcs"}</div>
          </div>
          <div>
            <div className="form-label">Cost per unit</div>
            <div>₹{(product.costPerUnit || 0).toLocaleString("en-IN")}</div>
          </div>
          <div>
            <div className="form-label">On hand</div>
            <div>{product.onHand}</div>
          </div>
          <div>
            <div className="form-label">Free to use</div>
            <div>{product.freeToUse}</div>
          </div>
          <div>
            <div className="form-label">Created</div>
            <div>{new Date(product.createdAt).toLocaleString("en-IN")}</div>
          </div>
          <div>
            <div className="form-label">Updated</div>
            <div>{new Date(product.updatedAt).toLocaleString("en-IN")}</div>
          </div>
        </div>
      </main>
    </>
  );
}