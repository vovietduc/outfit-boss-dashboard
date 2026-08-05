import raw from "./store-data.json";

export type SaleRow = {
  id: number;
  order_id: number;
  order_date: string;
  sku: string;
  color: string;
  size: string;
  unit_price: number;
  quantity: number;
  revenue: number;
};

export const sales = raw as SaleRow[];

export const money = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

const sumBy = <K extends keyof SaleRow>(key: K, field: "revenue" | "quantity") => {
  const map = new Map<string, number>();
  for (const r of sales) {
    const k = String(r[key]);
    map.set(k, (map.get(k) ?? 0) + r[field]);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const totals = {
  revenue: sales.reduce((s, r) => s + r.revenue, 0),
  orders: new Set(sales.map((r) => r.order_id)).size,
  quantity: sales.reduce((s, r) => s + r.quantity, 0),
  rows: sales.length,
  avgPrice: Math.round(sales.reduce((s, r) => s + r.unit_price, 0) / sales.length),
};

export const dateRange = {
  from: sales[0].order_date,
  to: sales[sales.length - 1].order_date,
};

export const topSku = sumBy("sku", "revenue").slice(0, 10);
export const skuAll = sumBy("sku", "revenue");
export const revenueByColor = sumBy("color", "revenue").slice(0, 10);
export const quantityBySize = sumBy("size", "quantity");

export const revenueByMonthData = (() => {
  const map = new Map<string, { revenue: number; orders: Set<number> }>();
  for (const r of sales) {
    const m = r.order_date.slice(0, 7);
    const cur = map.get(m) ?? { revenue: 0, orders: new Set<number>() };
    cur.revenue += r.revenue;
    cur.orders.add(r.order_id);
    map.set(m, cur);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, revenue: v.revenue, orders: v.orders.size }));
})();

export const orderList = (() => {
  const map = new Map<number, { order_id: number; date: string; items: number; quantity: number; revenue: number }>();
  for (const r of sales) {
    const cur = map.get(r.order_id) ?? { order_id: r.order_id, date: r.order_date, items: 0, quantity: 0, revenue: 0 };
    cur.items += 1;
    cur.quantity += r.quantity;
    cur.revenue += r.revenue;
    map.set(r.order_id, cur);
  }
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
})();
