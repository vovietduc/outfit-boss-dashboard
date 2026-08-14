import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, FileBarChart } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  money,
  orderList,
  quantityBySize,
  revenueByColor,
  revenueByMonthData,
  skuAll,
  totals,
} from "@/data/store";

export const Route = createFileRoute("/bao-cao")({
  head: () => ({
    meta: [
      { title: "Báo cáo kinh doanh — Clothing Store Admin" },
      { name: "description", content: "Báo cáo doanh thu theo tháng, top SKU, cơ cấu màu sắc và size, xuất CSV." },
      { property: "og:title", content: "Báo cáo kinh doanh — Clothing Store Admin" },
      { property: "og:description", content: "Doanh thu theo tháng, top SKU, cơ cấu màu sắc và size." },
    ],
  }),
  component: ReportsPage,
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

function ReportsPage() {
  const [month, setMonth] = useState("all");

  const months = revenueByMonthData.map((m) => m.month);

  const monthly = useMemo(
    () => (month === "all" ? revenueByMonthData : revenueByMonthData.filter((m) => m.month === month)),
    [month],
  );

  const scoped = useMemo(
    () => (month === "all" ? orderList : orderList.filter((o) => o.date.startsWith(month))),
    [month],
  );

  const summary = [
    { label: "Doanh thu", value: `${money(scoped.reduce((s, o) => s + o.revenue, 0))} đ` },
    { label: "Đơn hàng", value: money(scoped.length) },
    { label: "Sản phẩm bán ra", value: money(scoped.reduce((s, o) => s + o.quantity, 0)) },
    {
      label: "Giá trị đơn TB",
      value: `${money(Math.round(scoped.reduce((s, o) => s + o.revenue, 0) / (scoped.length || 1)))} đ`,
    },
  ];

  const exportCsv = () => {
    const rows = [
      ["Tháng", "Doanh thu", "Số đơn"],
      ...revenueByMonthData.map((m) => [m.month, String(m.revenue), String(m.orders)]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bao-cao-doanh-thu.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất báo cáo CSV");
  };

  return (
    <>
      <PageHeader title="Báo cáo" subtitle={`Tổng hợp từ ${totals.rows} dòng giao dịch`} />
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả các tháng</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  Tháng {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="size-4" /> Xuất CSV
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((s) => (
            <Card key={s.label} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FileBarChart className="size-4" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-base">Xu hướng doanh thu &amp; số đơn</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-chart-3)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Cơ cấu size</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={quantityBySize}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    isAnimationActive={false}
                    label
                  >
                    {quantityBySize.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-base">Doanh thu theo màu</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByColor}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
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
          <CardHeader>
            <CardTitle className="text-base">Top 20 SKU theo doanh thu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">#</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                  <TableHead className="text-right">Tỷ trọng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skuAll.slice(0, 20).map((s, i) => (
                  <TableRow key={s.name}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-right">{money(s.value)} đ</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {((s.value / totals.revenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
