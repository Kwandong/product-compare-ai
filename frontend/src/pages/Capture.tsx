import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../services/storage";

type ResultType = "good" | "bad" | "";

type Product = {
  id: string;
  imageUrl: string;
  category: string;
  name: string;
  result: "good" | "bad";
  createdAt: string;
};

export default function Capture() {
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<ResultType>("");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const resetForm = () => {
    setImageUrl(null);
    setCategory("");
    setName("");
    setResult("");
  };

  const handleSave = () => {
    if (!imageUrl || !category.trim() || !name.trim() || !result) {
      alert("이미지, 품목, 제품명, Good/Bad를 모두 입력해 주세요.");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      imageUrl,
      category: category.trim(),
      name: name.trim(),
      result: result as "good" | "bad",
      createdAt: new Date().toISOString(),
    };

    const existing = storage.get();
    storage.set([product, ...existing]);

    resetForm();
    navigate("/");
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "0 auto",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>제품 등록</h2>

      <input type="file" accept="image/*" onChange={handleImage} />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="preview"
          style={{
            width: "100%",
            borderRadius: 12,
            objectFit: "cover",
          }}
        />
      )}

      <input
        type="text"
        placeholder="품목 (예: 전자제품)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <input
        type="text"
        placeholder="제품명"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={() => setResult("good")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            backgroundColor: result === "good" ? "#16a34a" : "#9ca3af",
            color: "white",
            fontWeight: 700,
          }}
        >
          GOOD
        </button>

        <button
          type="button"
          onClick={() => setResult("bad")}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            backgroundColor: result === "bad" ? "#dc2626" : "#9ca3af",
            color: "white",
            fontWeight: 700,
          }}
        >
          BAD
        </button>
      </div>

      <button
        type="button"
        onClick={handleSave}
        style={{
          padding: 14,
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          backgroundColor: "#111827",
          color: "white",
          fontWeight: 700,
        }}
      >
        저장
      </button>
    </div>
  );
}