import { sales } from "./store";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  colors: string[];
  sizes: string[];
  price: number;
  stock: number;
  sold: number;
  revenue: number;
  rating: number;
  reviews: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
};

const CATEGORIES = ["Áo thun", "Áo sơ mi", "Áo khoác", "Quần", "Đầm", "Phụ kiện"];

/** Băm ổn định để dữ liệu mô phỏng (tồn kho, đánh giá) không đổi giữa các lần render. */
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
};

export const baseProducts: Product[] = (() => {
  const map = new Map<
    string,
    { colors: Set<string>; sizes: Set<string>; sold: number; revenue: number; price: number[]; first: string }
  >();
  for (const r of sales) {
    const cur =
      map.get(r.sku) ??
      { colors: new Set<string>(), sizes: new Set<string>(), sold: 0, revenue: 0, price: [], first: r.order_date };
    cur.colors.add(r.color);
    cur.sizes.add(r.size);
    cur.sold += r.quantity;
    cur.revenue += r.revenue;
    cur.price.push(r.unit_price);
    if (r.order_date < cur.first) cur.first = r.order_date;
    map.set(r.sku, cur);
  }

  return [...map.entries()]
    .map(([sku, v]) => {
      const h = hash(sku);
      return {
        id: `sku-${sku}`,
        sku,
        name: `Mẫu ${sku}`,
        category: CATEGORIES[h % CATEGORIES.length] ?? "Khác",
        colors: [...v.colors],
        sizes: [...v.sizes],
        price: Math.round(v.price.reduce((a, b) => a + b, 0) / v.price.length),
        stock: 12 + (h % 140),
        sold: v.sold,
        revenue: v.revenue,
        rating: Math.round((3.2 + (h % 18) / 10) * 10) / 10,
        reviews: 4 + (h % 90),
        status: (h % 11 === 0 ? "draft" : "active") as Product["status"],
        createdAt: v.first.slice(0, 10),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
})();

export const allCategories = CATEGORIES;
export const allColors = [...new Set(sales.map((r) => r.color))].sort();
export const allSizes = [...new Set(sales.map((r) => r.size))].sort();