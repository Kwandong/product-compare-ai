// v-8
import { useState, useRef } from "react";

type ProductStatus = "good" | "bad";

type Product = {
  id: string;
  name: string;
  design: number;
  priceScore: number;
  status: ProductStatus;
  imageUrl?: string;
  createdAt: number;
};

export default function App() {
  const [name, setName] = useState("");
  const [design, setDesign] = useState(3);
  const [priceScore, setPriceScore] = useState(3);
  const [status, setStatus] = useState<ProductStatus>("good");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 👉 숨겨진 input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const addProduct = () => {
    if (!name.trim()) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      name: name.trim(),
      design,
      priceScore,
      status,
      imageUrl: imageUrl || undefined,
      createdAt: Date.now(),
    };

    setProducts([newProduct, ...products]);

    setName("");
    setDesign(3);
    setPriceScore(3);
    setStatus("good");
    setImageUrl(null);
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((v) => v !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // 👉 이미지 처리 공통
  const handleImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  // 👉 업로드
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImage(file);
  };

  // 👉 촬영
  const handleCamera = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImage(file);
  };

  const selectedProducts = products.filter((p) =>
    selectedIds.includes(p.id)
  );

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Product Compare AI</h1>
      <p>이미지 기반 제품 판단 시스템</p>

      {/* 입력 */}
      <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 24 }}>
        <h2>제품 등록</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="제품 이름"
          style={{ width: "90%", padding: 8 }}
        />

        {/* 👉 버튼 UI */}
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ marginRight: 10 }}
          >
            📁 이미지 업로드
          </button>

          <button onClick={() => cameraInputRef.current?.click()}>
            📸 카메라 촬영
          </button>
        </div>

        {/* 👉 숨겨진 input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          style={{ display: "none" }}
        />

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleCamera}
          style={{ display: "none" }}
        />

        {/* 미리보기 */}
        {imageUrl && (
          <img
            src={imageUrl}
            style={{ width: 150, marginTop: 10, borderRadius: 10 }}
          />
        )}

        <div>
          디자인:
          <input
            type="number"
            min="1"
            max="5"
            value={design}
            onChange={(e) => setDesign(Number(e.target.value))}
          />
        </div>

        <div>
          가격:
          <input
            type="number"
            min="1"
            max="5"
            value={priceScore}
            onChange={(e) => setPriceScore(Number(e.target.value))}
          />
        </div>

        <div>
          <button
            onClick={() => setStatus("good")}
            style={{
              background: status === "good" ? "green" : "gray",
              color: "white",
              marginRight: 10,
            }}
          >
            Good
          </button>

          <button
            onClick={() => setStatus("bad")}
            style={{
              background: status === "bad" ? "red" : "gray",
              color: "white",
            }}
          >
            Bad
          </button>
        </div>

        <button onClick={addProduct}>추가</button>
      </div>

      {/* 리스트 */}
      <div style={{ border: "1px solid #ddd", padding: 16 }}>
        <h2>제품 목록</h2>

        <div>선택: {selectedIds.length}</div>

        <ul>
          {products.map((p) => (
            <li key={p.id}>
              <input
                type="checkbox"
                checked={selectedIds.includes(p.id)}
                onChange={() => toggleSelect(p.id)}
              />

              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  style={{ width: 50, margin: "0 10px" }}
                />
              )}

              {p.name} ({p.design}/{p.priceScore}){" "}
              {p.status === "good" ? "👍" : "👎"}
            </li>
          ))}
        </ul>
      </div>

      {/* 비교 */}
      {selectedProducts.length >= 2 && (
        <div style={{ marginTop: 20, border: "2px solid green", padding: 16 }}>
          <h2>비교</h2>

          <div style={{ display: "flex", gap: 20 }}>
            {selectedProducts.map((p) => (
              <div key={p.id} style={{ width: 200 }}>
                {p.imageUrl && (
                  <img src={p.imageUrl} style={{ width: "100%" }} />
                )}
                <h3>{p.name}</h3>
                <p>디자인: {p.design}</p>
                <p>가격: {p.priceScore}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}