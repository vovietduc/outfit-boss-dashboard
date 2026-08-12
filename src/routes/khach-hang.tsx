import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { customerIndexOfOrder, customerTotals, customers, type Customer } from "@/data/crm";
import { money, orderList } from "@/data/store";

export const Route = createFileRoute("/khach-hang")({
  head: () => ({
    meta: [
      { title: "Khách hàng — Clothing Store Admin" },
      { name: "description", content: "Danh sách khách hàng, hạng thành viên, số đơn và tổng chi tiêu." },
      { property: "og:title", content: "Khách hàng — Clothing Store Admin" },
      { property: "og:description", content: "Danh sách khách hàng, hạng thành viên, số đơn và tổng chi tiêu." },
    ],
  }),
  component: CustomersPage,
});

const tierTone: Record<Customer["tier"], string> = {
  "Kim cương": "bg-accent/15 text-accent border-accent/30",
  Vàng: "bg-warning/15 text-warning border-warning/30",
  Bạc: "bg-muted text-muted-foreground border-border",
  Đồng: "bg-secondary text-secondary-foreground border-border",
};

function CustomersPage() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("all");
  const [sort, setSort] = useState<"revenue" | "orders" | "recent">("revenue");
  const [selected, setSelected] = useState<Customer | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return customers
      .filter((c) => (tier === "all" ? true : c.tier === tier))
      .filter((c) =>
        !needle
          ? true
          : [c.name, c.code, c.email, c.phone, c.city].some((v) => v.toLowerCase().includes(needle)),
      )
      .sort((a, b) =>
        sort === "revenue"
          ? b.revenue - a.revenue
          : sort === "orders"
            ? b.orders - a.orders
            : b.lastOrder.localeCompare(a.lastOrder),
      );
  }, [q, tier, sort]);

  const detailOrders = useMemo(
    () =>
      selected
        ? orderList.filter((o) => `kh-${customerIndexOfOrder(o.order_id)}` === selected.id).slice(0, 12)
        : [],
    [selected],
  );

  const exportCsv = () => {
    const head = ["Mã KH", "Họ tên", "Email", "Điện thoại", "Tỉnh/TP", "Hạng", "Số đơn", "Sản phẩm", "Chi tiêu"];
    const body = rows.map((c) => [c.code, c.name, c.email, c.phone, c.city, c.tier, c.orders, c.quantity, c.revenue]);
    const csv = [head, ...body].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "khach-hang.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const kpis = [
    { label: "Tổng khách hàng", value: money(customerTotals.count) },
    { label: "Khách mua lại", value: money(customerTotals.returning) },
    { label: "Chi tiêu TB", value: `${money(customerTotals.avgRevenue)} đ` },
    { label: "Đơn TB / khách", value: String(customerTotals.avgOrders) },
  ];

  return (
    <>
      <PageHeader title="Khách hàng" subtitle={`${customers.length} khách hàng phát sinh từ ${orderList.length} đơn`} />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Users className="size-4" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="space-y-4 p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-56 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm theo tên, mã KH, email, số điện thoại…"
                  className="pl-9"
                />
              </div>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Hạng" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả hạng</SelectItem>
                  <SelectItem value="Kim cương">Kim cương</SelectItem>
                  <SelectItem value="Vàng">Vàng</SelectItem>
                  <SelectItem value="Bạc">Bạc</SelectItem>
                  <SelectItem value="Đồng">Đồng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Chi tiêu cao nhất</SelectItem>
                  <SelectItem value="orders">Nhiều đơn nhất</SelectItem>
                  <SelectItem value="recent">Mua gần đây</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportCsv}>
                <Download className="size-4" /> Xuất CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Tỉnh / TP</TableHead>
                    <TableHead>Hạng</TableHead>
                    <TableHead className="text-right">Đơn</TableHead>
                    <TableHead className="text-right">Sản phẩm</TableHead>
                    <TableHead className="text-right">Chi tiêu</TableHead>
                    <TableHead className="text-right">Mua gần nhất</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((c) => (
                    <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                      <TableCell>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.code}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <p>{c.email}</p>
                        <p>{c.phone}</p>
                      </TableCell>
                      <TableCell className="text-sm">{c.city}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={tierTone[c.tier]}>{c.tier}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{c.orders}</TableCell>
                      <TableCell className="text-right">{c.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{money(c.revenue)} đ</TableCell>
                      <TableCell className="text-right text-muted-foreground">{c.lastOrder}</TableCell>
                    </TableRow>
                  ))}
                  {!rows.length && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                        Không tìm thấy khách hàng phù hợp.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              {selected?.code} · {selected?.city} · Hạng {selected?.tier}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Số đơn</p>
              <p className="mt-1 font-semibold">{selected?.orders}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Sản phẩm</p>
              <p className="mt-1 font-semibold">{selected?.quantity}</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">Chi tiêu</p>
              <p className="mt-1 font-semibold">{money(selected?.revenue ?? 0)} đ</p>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đơn</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Giá trị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailOrders.map((o) => (
                  <TableRow key={o.order_id}>
                    <TableCell>
                      <Link to="/don-hang/$orderId" params={{ orderId: String(o.order_id) }} className="font-medium text-accent hover:underline">
                        #{o.order_id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{o.date}</TableCell>
                    <TableCell className="text-right">{money(o.revenue)} đ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}