export type ProductResult = "good" | "bad";

export type Product = {
  id: string;
  imageUrl: string;
  category: string;
  name: string;
  result: ProductResult;
  createdAt: string;
};