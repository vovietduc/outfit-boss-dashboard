import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, ShoppingBag, Users, Shirt, Wallet } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryShare, orders, products, revenueByMonth, vnd } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tổng quan — MAISON Wear Admin" },
      { name: "description", content: "Theo dõi doanh thu, đơn hàng và tồn kho cửa hàng quần áo theo thời gian thực." },
      { property: "og:title", content: "Tổng quan — MAISON Wear Admin" },
      { property: "og:description", content: "Theo dõi doanh thu, đơn hàng và tồn kho cửa hàng quần áo." },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "Doanh thu tháng", value: vnd(720_000_000), delta: "+18,2%", up: true, icon: Wallet },
  { label: "Đơn hàng", value: "455", delta: "+9,4%", up: true, icon: ShoppingBag },
  { label: "Khách hàng mới", value: "128", delta: "+4,1%", up: true, icon: Users },
  { label: "Tỷ lệ đổi trả", value: "3,2%", delta: "-0,8%", up: false, icon: Shirt },
];

const pieColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Index() {
  const lowStock = products.filter((p) => p.ton < 50);

  return (
    <>
      <PageHeader title="Tổng quan" subtitle="Tình hình kinh doanh 8 tháng đầu năm" />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <s.icon className="size-4" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                    s.up ? "text-success" : "text-destructive"
                  }`}
                >
                  {s.up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {s.delta} so với tháng trước
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Doanh thu theo tháng (triệu đồng)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByMonth} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="thang" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="doanhThu"
                    name="Doanh thu"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Cơ cấu danh mục</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {categoryShare.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `${v}%`}
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className="-mt-6 space-y-1">
                {categoryShare.map((c, i) => (
                  <li key={c.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="size-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                    {c.name} · {c.value}%
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
              <Link to="/don-hang" className="text-xs font-medium text-accent hover:underline">
                Xem tất cả
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{o.khach}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.id} · {o.sanPham}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium">{vnd(o.tong)}</span>
                    <StatusBadge status={o.trangThai} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Sắp hết hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.ten}</p>
                    <p className="text-xs text-muted-foreground">{p.danhMuc}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                    còn {p.ton}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
