import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { money, orderList, sales } from "@/data/store";

export const Route = createFileRoute("/don-hang/")({
  head: () => ({
    meta: [
      { title: "Đơn hàng — Clothing Store Analytics" },
      { name: "description", content: "Danh sách 273 đơn hàng với số dòng, số lượng và doanh thu từng đơn." },
      { property: "og:title", content: "Đơn hàng — Clothing Store Analytics" },
      { property: "og:description", content: "Danh sách đơn hàng với số lượng và doanh thu từng đơn." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const rows = orderList.slice(0, 100);
  return (
    <>
      <PageHeader title="Đơn hàng" subtitle={`${orderList.length} đơn · ${sales.length} dòng giao dịch`} />
      <div className="p-4 md:p-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Số dòng</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((o) => (
                  <TableRow key={o.order_id}>
                    <TableCell className="font-medium">#{o.order_id}</TableCell>
                    <TableCell className="text-muted-foreground">{o.date}</TableCell>
                    <TableCell className="text-right">{o.items}</TableCell>
                    <TableCell className="text-right">{o.quantity}</TableCell>
                    <TableCell className="text-right font-medium">{money(o.revenue)} đ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <p className="mt-3 text-xs text-muted-foreground">Hiển thị 100 đơn gần nhất.</p>
      </div>
    </>
  );
}
