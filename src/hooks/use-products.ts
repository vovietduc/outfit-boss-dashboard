import { useCallback, useEffect, useState } from "react";

import { baseProducts, type Product } from "@/data/catalog";

const KEY = "cs.products.v1";

function load(): Product[] {
  if (typeof window === "undefined") return baseProducts;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return baseProducts;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length ? parsed : baseProducts;
  } catch {
    return baseProducts;
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProducts(load());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Product[]) => {
    setProducts(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* bỏ qua lỗi quota */
    }
  }, []);

  const addProduct = useCallback(
    (p: Omit<Product, "id" | "sold" | "revenue" | "reviews" | "createdAt">) =>
      setProducts((prev) => {
        const next = [
          {
            ...p,
            id: `new-${Date.now()}`,
            sold: 0,
            revenue: 0,
            reviews: 0,
            createdAt: new Date().toISOString().slice(0, 10),
          },
          ...prev,
        ];
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      }),
    [],
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) =>
      setProducts((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      }),
    [],
  );

  const removeProducts = useCallback(
    (ids: string[]) =>
      setProducts((prev) => {
        const next = prev.filter((p) => !ids.includes(p.id));
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      }),
    [],
  );

  const reset = useCallback(() => persist(baseProducts), [persist]);

  return { products, hydrated, addProduct, updateProduct, removeProducts, reset };
}