import type { Product } from "../types/product";

const KEY = "cognote_products";

export const storage = {
  get(): Product[] {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  },

  set(products: Product[]) {
    localStorage.setItem(KEY, JSON.stringify(products));
  },

  add(product: Product) {
    const current = this.get();
    this.set([product, ...current]);
  },

  remove(id: string) {
    const current = this.get();
    this.set(current.filter((item) => item.id !== id));
  },
};