import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orders, vnd } from "@/data/mock";

export const Route = createFileRoute("/don-hang")({
  head: () => ({
    meta: [
      { title: "Đơn hàng — MAISON Wear Admin" },
      { name: "description", content: "Danh sách và trạng thái đơn hàng của cửa hàng quần áo." },
      { property: "og:title", content: "Đơn hàng — MAISON Wear Admin" },
      { property: "og:description", content: "Danh sách và trạng thái đơn hàng của cửa hàng quần áo." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <>
      <PageHeader title="Đơn hàng" subtitle={`${orders.length} đơn trong 7 ngày gần nhất`} />
      <div className="p-4 md:p-8">
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="text-center">SL</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Ngày</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.khach}</TableCell>
                    <TableCell className="text-muted-foreground">{o.sanPham}</TableCell>
                    <TableCell className="text-center">{o.soLuong}</TableCell>
                    <TableCell className="text-right font-medium">{vnd(o.tong)}</TableCell>
                    <TableCell>
                      <StatusBadge status={o.trangThai} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{o.ngay}</TableCell>
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