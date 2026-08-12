import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Printer, Truck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customerOfOrder, findOrder, orderLines } from "@/data/crm";
import { money } from "@/data/store";

export const Route = createFileRoute("/don-hang/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Đơn hàng #${params.orderId} — Clothing Store Admin` },
      { name: "description", content: `Chi tiết đơn hàng #${params.orderId}: sản phẩm, khách hàng và giá trị đơn.` },
      { property: "og:title", content: `Đơn hàng #${params.orderId} — Clothing Store Admin` },
      { property: "og:description", content: "Chi tiết đơn hàng: sản phẩm, khách hàng và giá trị đơn." },
    ],
  }),
  loader: ({ params }) => {
    const order = findOrder(Number(params.orderId));
    if (!order) throw notFound();
    return null;
  },
  component: OrderDetailPage,
});

const STATUSES = ["Chờ xác nhận", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"] as const;

const statusTone: Record<string, string> = {
  "Chờ xác nhận": "bg-warning/15 text-warning border-warning/30",
  "Đang xử lý": "bg-accent/15 text-accent border-accent/30",
  "Đang giao": "bg-chart-2/15 text-chart-2 border-chart-2/30",
  "Hoàn tất": "bg-success/15 text-success border-success/30",
  "Đã hủy": "bg-destructive/10 text-destructive border-destructive/30",
};

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const id = Number(orderId);
  const order = findOrder(id)!;
  const lines = orderLines(id);
  const customer = customerOfOrder(id);
  const [status, setStatus] = useState<string>(id % 7 === 0 ? "Đang giao" : "Hoàn tất");

  const shipping = 30;
  const discount = order.revenue > 500 ? Math.round(order.revenue * 0.05) : 0;

  return (
    <>
      <PageHeader title={`Đơn hàng #${order.order_id}`} subtitle={`Đặt ngày ${order.date}`} />
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/don-hang">
              <ArrowLeft className="size-4" /> Danh sách đơn
            </Link>
          </Button>
          <Badge variant="outline" className={statusTone[status]}>{status}</Badge>
          <div className="ms-auto flex flex-wrap items-center gap-2">
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                toast.success(`Đã cập nhật trạng thái đơn #${order.order_id}`, { description: v });
              }}
            >
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast.info("Đã tạo yêu cầu giao hàng")}>
              <Truck className="size-4" /> Giao hàng
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="size-4" /> In hóa đơn
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="shadow-[var(--shadow-card)] lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Sản phẩm trong đơn ({lines.length} dòng)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Màu</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">SL</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">{l.sku}</TableCell>
                      <TableCell>{l.color}</TableCell>
                      <TableCell>{l.size}</TableCell>
                      <TableCell className="text-right">{money(l.unit_price)} đ</TableCell>
                      <TableCell className="text-right">{l.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{money(l.revenue)} đ</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="text-base">Khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{customer?.name}</p>
                <p className="text-muted-foreground">{customer?.code} · Hạng {customer?.tier}</p>
                <p className="text-muted-foreground">{customer?.email}</p>
                <p className="text-muted-foreground">{customer?.phone}</p>
                <p className="text-muted-foreground">{customer?.city}</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/khach-hang">Xem hồ sơ khách</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="text-base">Thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{money(order.revenue)} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{money(shipping)} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span>-{money(discount)} đ</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <span>Tổng cộng</span>
                  <span>{money(order.revenue + shipping - discount)} đ</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}