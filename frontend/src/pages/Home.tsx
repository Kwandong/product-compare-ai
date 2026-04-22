import { useEffect, useState } from "react";
import { storage } from "../services/storage";

type Product = {
  id: string;
  imageUrl: string;
  category: string;
  name: string;
  result: "good" | "bad";
  createdAt: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadData = () => {
    const data = storage.get();
    setProducts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("삭제하시겠습니까?")) return;

    const updated = products.filter((p) => p.id !== id);
    storage.set(updated);
    setProducts(updated);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>저장된 제품</h2>

      {products.length === 0 && (
        <p style={{ textAlign: "center" }}>데이터 없음</p>
      )}

      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #333",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <img
            src={p.imageUrl}
            style={{ width: "100%", borderRadius: 8 }}
          />

          <div style={{ marginTop: 8 }}>
            <b>{p.name}</b>
          </div>

          <div>{p.category}</div>

          <div>
            {p.result === "good" ? "👍 GOOD" : "👎 BAD"}
          </div>

          <div style={{ fontSize: 12, color: "#aaa" }}>
            {new Date(p.createdAt).toLocaleString()}
          </div>

          <button
            onClick={() => handleDelete(p.id)}
            style={{
              marginTop: 8,
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}