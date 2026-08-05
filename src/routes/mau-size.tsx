import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { money, quantityBySize, revenueByColor, totals } from "@/data/store";

export const Route = createFileRoute("/mau-size")({
  head: () => ({
    meta: [
      { title: "Màu sắc & Size — Clothing Store Analytics" },
      { name: "description", content: "Doanh thu theo màu sắc và số lượng bán ra theo từng size." },
      { property: "og:title", content: "Màu sắc & Size — Clothing Store Analytics" },
      { property: "og:description", content: "Doanh thu theo màu sắc và số lượng bán ra theo từng size." },
    ],
  }),
  component: ColorSizePage,
});

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const tooltipStyle = {
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 10,
  fontSize: 12,
};

function ColorSizePage() {
  return (
    <>
      <PageHeader title="Màu sắc & Size" subtitle="Cơ cấu bán hàng theo thuộc tính sản phẩm" />
      <div className="space-y-6 p-4 md:p-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Doanh thu theo màu sắc</CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByColor} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} interval={0} angle={-25} height={60} textAnchor="end" />
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

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Số lượng bán ra theo size</CardTitle>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quantityBySize} margin={{ left: -10, right: 8, top: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="value" name="Số lượng" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  <LabelList dataKey="value" position="top" fontSize={11} fill="var(--color-muted-foreground)" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quantityBySize.slice(0, 4).map((s) => (
            <Card key={s.name} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Size {s.name}</p>
                <p className="mt-2 text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground">
                  {((s.value / totals.quantity) * 100).toFixed(1)}% tổng số lượng
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
