import { useEffect, useMemo, useRef, useState } from "react";
import { storage } from "../services/storage";
import type { Product, ProductResult } from "../types/product";

const CATEGORY_OPTIONS = [
  "전자제품",
  "생활용품",
  "식품",
  "의류",
  "문구",
  "기타",
  "직접 입력",
];

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 600;
        const scale = Math.min(1, maxWidth / img.width);

        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context 생성 실패"));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error("이미지 로드 실패"));

      if (typeof reader.result === "string") {
        img.src = reader.result;
      } else {
        reject(new Error("파일 읽기 실패"));
      }
    };

    reader.onerror = () => reject(new Error("파일 읽기 실패"));
    reader.readAsDataURL(file);
  });
}

export default function MainPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<ProductResult | "">("");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filter, setFilter] = useState<"all" | "good" | "bad">("all");
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const loadProducts = () => {
    const data = storage.get();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const processFile = async (file: File) => {
    try {
      setIsProcessingImage(true);
      const compressed = await compressImage(file);
      setImageUrl(compressed);
    } catch (error) {
      console.error(error);
      alert("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleUploadChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = "";
  };

  const handleCameraChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = "";
  };

  const getFinalCategory = () => {
    if (selectedCategory === "직접 입력") {
      return customCategory.trim();
    }
    return selectedCategory.trim();
  };

  const resetForm = () => {
    setImageUrl(null);
    setSelectedCategory("");
    setCustomCategory("");
    setName("");
    setResult("");
  };

  const handleSave = () => {
    const finalCategory = getFinalCategory();

    if (!imageUrl || !finalCategory || !name.trim() || !result) {
      alert("이미지, 품목, 제품명, Good/Bad를 모두 입력해 주세요.");
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      imageUrl,
      category: finalCategory,
      name: name.trim(),
      result,
      createdAt: new Date().toISOString(),
    };

    try {
      storage.add(product);
      loadProducts();
      resetForm();
      alert("저장되었습니다.");
    } catch (error) {
      console.error(error);
      alert("저장 공간이 부족합니다. 기존 데이터를 일부 삭제해 주세요.");
    }
  };

  const handleDelete = (id: string) => {
    const ok = confirm("삭제하시겠습니까?");
    if (!ok) return;

    storage.remove(id);
    loadProducts();
  };

  const filteredProducts = useMemo(() => {
    let resultList = products;

    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      resultList = resultList.filter((product) => {
        const category = product.category.toLowerCase();
        const name = product.name.toLowerCase();
        return category.includes(keyword) || name.includes(keyword);
      });
    }

    if (filter !== "all") {
      resultList = resultList.filter((product) => product.result === filter);
    }

    return resultList;
  }, [products, searchKeyword, filter]);

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Cognote</h1>
        <p className="subtitle">사진 기반 제품 판단 기록 시스템</p>

        <section className="card">
          <h2 className="section-title">제품 등록</h2>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#374151",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              갤러리 업로드
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#0f172a",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              카메라 촬영
            </button>
          </div>

          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadChange}
            style={{ display: "none" }}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraChange}
            style={{ display: "none" }}
          />

          {isProcessingImage && (
            <p className="empty-text">이미지 처리 중...</p>
          )}

          {imageUrl && !isProcessingImage && (
            <img src={imageUrl} alt="preview" className="preview-image" />
          )}

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-input"
          >
            <option value="">품목 선택</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {selectedCategory === "직접 입력" && (
            <input
              type="text"
              placeholder="품목 직접 입력"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="text-input"
            />
          )}

          <input
            type="text"
            placeholder="제품명"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-input"
          />

          <div className="result-row">
            <button
              type="button"
              onClick={() => setResult("good")}
              className={`result-button ${
                result === "good" ? "good active" : ""
              }`}
            >
              GOOD
            </button>

            <button
              type="button"
              onClick={() => setResult("bad")}
              className={`result-button ${
                result === "bad" ? "bad active" : ""
              }`}
            >
              BAD
            </button>
          </div>

          <button type="button" onClick={handleSave} className="save-button">
            저장
          </button>
        </section>

        <section className="card">
          <h2 className="section-title">저장된 제품</h2>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: filter === "all" ? "#2563eb" : "#6b7280",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              전체
            </button>

            <button
              onClick={() => setFilter("good")}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: filter === "good" ? "#16a34a" : "#6b7280",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              GOOD
            </button>

            <button
              onClick={() => setFilter("bad")}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: filter === "bad" ? "#dc2626" : "#6b7280",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              BAD
            </button>
          </div>

          <input
            type="text"
            placeholder="품목 또는 제품명 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="text-input"
          />

          {filteredProducts.length === 0 ? (
            <p className="empty-text">검색 결과가 없습니다.</p>
          ) : (
            <div className="list">
              {filteredProducts.map((product) => (
                <div key={product.id} className="list-card">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="list-image"
                  />

                  <div className="list-body">
                    <div className="list-name">{product.name}</div>
                    <div className="list-category">{product.category}</div>

                    <div
                      className={`list-result ${
                        product.result === "good" ? "good-text" : "bad-text"
                      }`}
                    >
                      {product.result === "good" ? "👍 GOOD" : "👎 BAD"}
                    </div>

                    <div className="list-date">
                      {new Date(product.createdAt).toLocaleString()}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="delete-button"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}