import { orderList, sales, type SaleRow } from "./store";

/** Băm ổn định để dữ liệu khách hàng không đổi giữa các lần render. */
const hash = (s: string) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000003;
  return h;
};

const FIRST = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng",
  "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý",
];
const MID = ["Thị", "Ngọc", "Thu", "Minh", "Khánh", "Gia", "Hải", "Anh"];
const LAST = [
  "An", "Bình", "Chi", "Dung", "Giang", "Hà", "Hạnh", "Hương", "Lan", "Linh",
  "Mai", "Nga", "Nhung", "Oanh", "Phương", "Quyên", "Thảo", "Trang", "Trâm", "Uyên",
  "Vân", "Yến", "Duy", "Khoa", "Nam", "Sơn", "Tuấn", "Vinh",
];
const CITIES = ["TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Biên Hòa", "Nha Trang", "Huế"];
const TIERS = ["Đồng", "Bạc", "Vàng", "Kim cương"] as const;

export type Customer = {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  quantity: number;
  revenue: number;
  firstOrder: string;
  lastOrder: string;
  tier: (typeof TIERS)[number];
};

const CUSTOMER_COUNT = 64;

const nameFor = (i: number) => {
  const h = hash(`kh-${i}`);
  return `${FIRST[h % FIRST.length]} ${MID[(h >> 3) % MID.length]} ${LAST[(h >> 5) % LAST.length]}`;
};

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z]+/g, ".");

/** order_id -> chỉ số khách hàng (ổn định). */
export const customerIndexOfOrder = (orderId: number) => hash(`order-${orderId}`) % CUSTOMER_COUNT;

export const customers: Customer[] = (() => {
  const acc = new Map<number, { orders: number; quantity: number; revenue: number; first: string; last: string }>();
  for (const o of orderList) {
    const idx = customerIndexOfOrder(o.order_id);
    const cur = acc.get(idx) ?? { orders: 0, quantity: 0, revenue: 0, first: o.date, last: o.date };
    cur.orders += 1;
    cur.quantity += o.quantity;
    cur.revenue += o.revenue;
    if (o.date < cur.first) cur.first = o.date;
    if (o.date > cur.last) cur.last = o.date;
    acc.set(idx, cur);
  }

  return [...acc.entries()]
    .map(([idx, v]) => {
      const name = nameFor(idx);
      const h = hash(name + idx);
      const tier: Customer["tier"] =
        v.revenue >= 2000 ? "Kim cương" : v.revenue >= 1200 ? "Vàng" : v.revenue >= 600 ? "Bạc" : "Đồng";
      return {
        id: `kh-${idx}`,
        code: `KH${String(1000 + idx)}`,
        name,
        email: `${slug(name)}${idx}@gmail.com`,
        phone: `09${String(10000000 + (h % 89999999)).slice(0, 8)}`,
        city: CITIES[h % CITIES.length] ?? "TP. Hồ Chí Minh",
        orders: v.orders,
        quantity: v.quantity,
        revenue: v.revenue,
        firstOrder: v.first.slice(0, 10),
        lastOrder: v.last.slice(0, 10),
        tier,
      } satisfies Customer;
    })
    .sort((a, b) => b.revenue - a.revenue);
})();

export const customerOfOrder = (orderId: number) =>
  customers.find((c) => c.id === `kh-${customerIndexOfOrder(orderId)}`);

export const orderLines = (orderId: number): SaleRow[] => sales.filter((r) => r.order_id === orderId);

export const findOrder = (orderId: number) => orderList.find((o) => o.order_id === orderId);

export const customerTotals = {
  count: customers.length,
  avgRevenue: Math.round(customers.reduce((s, c) => s + c.revenue, 0) / (customers.length || 1)),
  avgOrders: Math.round((customers.reduce((s, c) => s + c.orders, 0) / (customers.length || 1)) * 10) / 10,
  returning: customers.filter((c) => c.orders > 1).length,
};

/* ---------------------------------- Khuyến mãi --------------------------------- */

export type Promotion = {
  id: string;
  code: string;
  name: string;
  type: "percent" | "amount" | "shipping";
  value: number;
  minOrder: number;
  usage: number;
  quota: number;
  startDate: string;
  endDate: string;
  active: boolean;
};

export const basePromotions: Promotion[] = [
  { id: "km-1", code: "SUMMER20", name: "Sale hè 20%", type: "percent", value: 20, minOrder: 300, usage: 148, quota: 300, startDate: "2022-06-01", endDate: "2022-08-31", active: true },
  { id: "km-2", code: "FREESHIP", name: "Miễn phí vận chuyển", type: "shipping", value: 0, minOrder: 200, usage: 96, quota: 500, startDate: "2022-06-15", endDate: "2022-12-31", active: true },
  { id: "km-3", code: "NEW50", name: "Giảm 50đ cho khách mới", type: "amount", value: 50, minOrder: 250, usage: 61, quota: 200, startDate: "2022-07-01", endDate: "2022-09-30", active: true },
  { id: "km-4", code: "VIP15", name: "Ưu đãi hạng Vàng & Kim cương", type: "percent", value: 15, minOrder: 500, usage: 24, quota: 100, startDate: "2022-08-01", endDate: "2022-10-31", active: false },
  { id: "km-5", code: "BACK2SCHOOL", name: "Mùa tựu trường", type: "percent", value: 10, minOrder: 150, usage: 187, quota: 400, startDate: "2022-08-15", endDate: "2022-09-15", active: false },
];