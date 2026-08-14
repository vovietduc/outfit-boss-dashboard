import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Ticket, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { basePromotions, type Promotion } from "@/data/crm";
import { money } from "@/data/store";

export const Route = createFileRoute("/khuyen-mai")({
  head: () => ({
    meta: [
      { title: "Khuyến mãi — Clothing Store Admin" },
      { name: "description", content: "Quản lý mã giảm giá: tạo mã, bật/tắt, theo dõi lượt dùng và hạn sử dụng." },
      { property: "og:title", content: "Khuyến mãi — Clothing Store Admin" },
      { property: "og:description", content: "Quản lý mã giảm giá, lượt sử dụng và thời hạn áp dụng." },
    ],
  }),
  component: PromotionsPage,
});

const typeLabel: Record<Promotion["type"], string> = {
  percent: "Giảm %",
  amount: "Giảm tiền",
  shipping: "Miễn ship",
};

const emptyForm = {
  code: "",
  name: "",
  type: "percent" as Promotion["type"],
  value: 10,
  minOrder: 200,
  quota: 100,
  startDate: "2022-06-01",
  endDate: "2022-12-31",
};

function PromotionsPage() {
  const [list, setList] = useState<Promotion[]>(basePromotions);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(
    () =>
      list.filter((p) => {
        const okQ =
          !q ||
          p.code.toLowerCase().includes(q.toLowerCase()) ||
          p.name.toLowerCase().includes(q.toLowerCase());
        const okS = status === "all" || (status === "on" ? p.active : !p.active);
        return okQ && okS;
      }),
    [list, q, status],
  );

  const kpis = [
    { label: "Tổng mã", value: String(list.length) },
    { label: "Đang chạy", value: String(list.filter((p) => p.active).length) },
    { label: "Lượt sử dụng", value: money(list.reduce((s, p) => s + p.usage, 0)) },
    {
      label: "Tỷ lệ dùng TB",
      value: `${Math.round((list.reduce((s, p) => s + p.usage / p.quota, 0) / (list.length || 1)) * 100)}%`,
    },
  ];

  const toggle = (id: string) =>
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  const remove = (id: string) => {
    setList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa mã khuyến mãi");
  };

  const create = () => {
    if (!form.code.trim() || !form.name.trim()) {
      toast.error("Vui lòng nhập mã và tên chương trình");
      return;
    }
    setList((prev) => [
      { id: `km-${Date.now()}`, ...form, code: form.code.toUpperCase(), usage: 0, active: true },
      ...prev,
    ]);
    setForm(emptyForm);
    setOpen(false);
    toast.success("Đã tạo mã khuyến mãi");
  };

  return (
    <>
      <PageHeader title="Khuyến mãi" subtitle="Tạo và theo dõi các chương trình giảm giá" />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Ticket className="size-4" />
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
                  placeholder="Tìm theo mã hoặc tên..."
                  className="pl-9"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="on">Đang chạy</SelectItem>
                  <SelectItem value="off">Tạm dừng</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setOpen(true)}>
                <Plus className="size-4" /> Tạo mã
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Chương trình</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-right">Giá trị</TableHead>
                    <TableHead className="text-right">Đơn tối thiểu</TableHead>
                    <TableHead className="w-44">Lượt dùng</TableHead>
                    <TableHead>Thời hạn</TableHead>
                    <TableHead className="text-center">Bật</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.code}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{typeLabel[p.type]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {p.type === "percent" ? `${p.value}%` : p.type === "amount" ? `${money(p.value)} đ` : "—"}
                      </TableCell>
                      <TableCell className="text-right">{money(p.minOrder)} đ</TableCell>
                      <TableCell>
                        <Progress value={Math.min(100, (p.usage / p.quota) * 100)} className="h-2" />
                        <span className="text-xs text-muted-foreground">
                          {p.usage}/{p.quota}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.startDate} → {p.endDate}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={p.active} onCheckedChange={() => toggle(p.id)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                        Không có mã nào khớp bộ lọc.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo mã khuyến mãi</DialogTitle>
            <DialogDescription>Mã mới sẽ được bật ngay sau khi tạo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Mã</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="SALE10" />
            </div>
            <div className="space-y-2">
              <Label>Tên chương trình</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Loại</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as Promotion["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Giảm %</SelectItem>
                  <SelectItem value="amount">Giảm tiền</SelectItem>
                  <SelectItem value="shipping">Miễn ship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Giá trị</Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn tối thiểu</Label>
              <Input
                type="number"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Số lượt tối đa</Label>
              <Input
                type="number"
                value={form.quota}
                onChange={(e) => setForm({ ...form, quota: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Bắt đầu</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Kết thúc</Label>
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={create}>Tạo mã</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
