import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Boxes, Layers, ShoppingBag, Wallet } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dateRange, money, orderList, revenueByColor, revenueByMonthData, topSku, totals } from "@/data/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tổng quan doanh thu — Clothing Store Analytics" },
      { name: "description", content: "Phân tích 527 dòng bán hàng: doanh thu, đơn hàng, top SKU và màu sắc bán chạy." },
      { property: "og:title", content: "Tổng quan doanh thu — Clothing Store Analytics" },
      { property: "og:description", content: "Doanh thu, đơn hàng, top SKU và màu sắc bán chạy từ bảng products." },
    ],
  }),
  component: Index,
});

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  fontSize: 12,
};

function Index() {
  const stats = [
    { label: "Tổng doanh thu", value: `${money(totals.revenue)} đ`, sub: `${totals.rows} dòng dữ liệu`, icon: Wallet },
    { label: "Tổng đơn hàng", value: money(totals.orders), sub: "đơn duy nhất", icon: ShoppingBag },
    { label: "Sản phẩm bán ra", value: money(totals.quantity), sub: "sản phẩm", icon: Boxes },
    { label: "Giá trung bình", value: `${money(totals.avgPrice)} đ`, sub: "mỗi sản phẩm", icon: Layers },
  ];

  return (
    <>
      <PageHeader title="Tổng quan" subtitle={`Dữ liệu từ ${dateRange.from} đến ${dateRange.to}`} />
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
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonthData} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${money(v)} đ`} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2.5}
                  fill="url(#rev)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Top 10 SKU doanh thu cao nhất</CardTitle>
              <Link to="/san-pham" className="text-xs font-medium text-accent hover:underline">
                Xem tất cả
              </Link>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSku} margin={{ left: -10, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tooltipStyle} formatter={(v: number) => `${money(v)} đ`} />
                  <Bar dataKey="value" name="Doanh thu" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Doanh thu theo màu sắc</CardTitle>
              <Link to="/mau-size" className="text-xs font-medium text-accent hover:underline">
                Chi tiết
              </Link>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByColor} margin={{ left: -10, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} interval={0} angle={-25} height={50} textAnchor="end" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tooltipStyle} formatter={(v: number) => `${money(v)} đ`} />
                  <Bar dataKey="value" name="Doanh thu" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {revenueByColor.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Đơn hàng gần đây</CardTitle>
            <Link to="/don-hang" className="text-xs font-medium text-accent hover:underline">
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderList.slice(0, 6).map((o) => (
              <div key={o.order_id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Đơn #{o.order_id}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.date} · {o.items} dòng · {o.quantity} sản phẩm
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium">{money(o.revenue)} đ</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
