import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { money, sales, skuAll } from "@/data/store";

export const Route = createFileRoute("/san-pham")({
  head: () => ({
    meta: [
      { title: "Sản phẩm (SKU) — Clothing Store Analytics" },
      { name: "description", content: "Xếp hạng SKU theo doanh thu, số lượng bán và giá trung bình." },
      { property: "og:title", content: "Sản phẩm (SKU) — Clothing Store Analytics" },
      { property: "og:description", content: "Xếp hạng SKU theo doanh thu, số lượng bán và giá trung bình." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const max = skuAll[0].value;
  const detail = skuAll.slice(0, 40).map((s) => {
    const rows = sales.filter((r) => r.sku === s.name);
    return {
      sku: s.name,
      revenue: s.value,
      quantity: rows.reduce((a, r) => a + r.quantity, 0),
      avgPrice: Math.round(rows.reduce((a, r) => a + r.unit_price, 0) / rows.length),
    };
  });

  return (
    <>
      <PageHeader title="Sản phẩm" subtitle={`${skuAll.length} SKU đã phát sinh doanh thu`} />
      <div className="p-4 md:p-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="w-[30%]">Tỷ trọng</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Giá TB</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.map((d, i) => (
                  <TableRow key={d.sku}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">SKU {d.sku}</TableCell>
                    <TableCell>
                      <Progress value={(d.revenue / max) * 100} />
                    </TableCell>
                    <TableCell className="text-right">{d.quantity}</TableCell>
                    <TableCell className="text-right">{money(d.avgPrice)} đ</TableCell>
                    <TableCell className="text-right font-medium">{money(d.revenue)} đ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <p className="mt-3 text-xs text-muted-foreground">Hiển thị 40 SKU dẫn đầu theo doanh thu.</p>
      </div>
    </>
  );
}
