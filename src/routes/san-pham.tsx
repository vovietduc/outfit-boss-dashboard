import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Download, PackagePlus, Pencil, RotateCcw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/page-header";
import { StarRating } from "@/components/dashboard/star-rating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allCategories, allColors, allSizes, type Product } from "@/data/catalog";
import { money } from "@/data/store";
import { useProducts } from "@/hooks/use-products";

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

type SortKey = "revenue" | "sold" | "price" | "stock" | "rating" | "name";

const emptyForm = {
  sku: "",
  name: "",
  category: allCategories[0] ?? "Khác",
  price: 250,
  stock: 50,
  rating: 5,
  status: "active" as Product["status"],
  colors: "Dark Blue",
  sizes: "M, L, XL",
};

const statusLabel: Record<Product["status"], string> = {
  active: "Đang bán",
  draft: "Nháp",
  archived: "Ngừng bán",
};

function ProductsPage() {
  const { products, addProduct, updateProduct, removeProducts, reset } = useProducts();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [color, setColor] = useState("all");
  const [size, setSize] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [asc, setAsc] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = products.filter((p) => {
      if (term && !`${p.name} ${p.sku} ${p.category} ${p.colors.join(" ")}`.toLowerCase().includes(term))
        return false;
      if (category !== "all" && p.category !== category) return false;
      if (status !== "all" && p.status !== status) return false;
      if (color !== "all" && !p.colors.includes(color)) return false;
      if (size !== "all" && !p.sizes.includes(size)) return false;
      return true;
    });
    const dir = asc ? 1 : -1;
    return [...list].sort((a, b) =>
      sortKey === "name" ? a.name.localeCompare(b.name) * dir : (a[sortKey] - b[sortKey]) * dir,
    );
  }, [products, q, category, status, color, size, sortKey, asc]);

  const maxRevenue = Math.max(1, ...products.map((p) => p.revenue));
  const kpis = [
    { label: "Sản phẩm", value: products.length.toString() },
    { label: "Đang bán", value: products.filter((p) => p.status === "active").length.toString() },
    { label: "Sắp hết hàng", value: products.filter((p) => p.stock < 30).length.toString() },
    {
      label: "Đánh giá TB",
      value: (products.reduce((a, p) => a + p.rating, 0) / (products.length || 1)).toFixed(1),
    },
  ];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      rating: p.rating,
      status: p.status,
      colors: p.colors.join(", "),
      sizes: p.sizes.join(", "),
    });
    setDialogOpen(true);
  };

  const submit = () => {
    if (!form.sku.trim() || !form.name.trim()) {
      toast.error("Vui lòng nhập SKU và tên sản phẩm");
      return;
    }
    const payload = {
      sku: form.sku.trim().slice(0, 40),
      name: form.name.trim().slice(0, 120),
      category: form.category,
      price: Math.max(0, Number(form.price) || 0),
      stock: Math.max(0, Number(form.stock) || 0),
      rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
      status: form.status,
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (editing) {
      updateProduct(editing.id, payload);
      toast.success("Đã cập nhật sản phẩm");
    } else {
      addProduct(payload);
      toast.success("Đã thêm sản phẩm mới");
    }
    setDialogOpen(false);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    removeProducts(pendingDelete);
    setSelected((prev) => prev.filter((id) => !pendingDelete.includes(id)));
    toast.success(`Đã xóa ${pendingDelete.length} sản phẩm`);
    setPendingDelete(null);
  };

  const exportCsv = () => {
    const header = "sku,ten,danh_muc,gia,ton_kho,da_ban,doanh_thu,danh_gia,trang_thai";
    const body = filtered
      .map((p) =>
        [p.sku, p.name, p.category, p.price, p.stock, p.sold, p.revenue, p.rating, p.status]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "san-pham.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất CSV");
  };

  const allChecked = filtered.length > 0 && filtered.every((p) => selected.includes(p.id));

  return (
    <>
      <PageHeader title="Quản lý sản phẩm" subtitle={`${products.length} sản phẩm • ${filtered.length} kết quả`} />
      <div className="space-y-4 p-4 md:p-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="shadow-[var(--shadow-card)]">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="mt-1 text-2xl font-semibold">{k.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="flex flex-wrap items-center gap-2 p-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                maxLength={80}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tên, SKU, màu..."
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Danh mục" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Màu" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả màu</SelectItem>
                {allColors.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Size" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả size</SelectItem>
                {allSizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Mọi trạng thái</SelectItem>
                <SelectItem value="active">Đang bán</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="archived">Ngừng bán</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Doanh thu</SelectItem>
                <SelectItem value="sold">Đã bán</SelectItem>
                <SelectItem value="price">Giá bán</SelectItem>
                <SelectItem value="stock">Tồn kho</SelectItem>
                <SelectItem value="rating">Đánh giá</SelectItem>
                <SelectItem value="name">Tên</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => setAsc((v) => !v)} aria-label="Đảo thứ tự">
              <ArrowUpDown className="size-4" />
            </Button>
            <Button variant="outline" onClick={exportCsv}>
              <Download className="size-4" /> Xuất CSV
            </Button>
            <Button variant="outline" onClick={() => { reset(); setSelected([]); toast.success("Đã khôi phục dữ liệu gốc"); }}>
              <RotateCcw className="size-4" /> Khôi phục
            </Button>
            <Button onClick={openCreate}>
              <PackagePlus className="size-4" /> Thêm sản phẩm
            </Button>
          </CardContent>
        </Card>

        {selected.length > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm">
            <span>Đã chọn {selected.length} sản phẩm</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { selected.forEach((id) => updateProduct(id, { status: "archived" })); toast.success("Đã ngừng bán các sản phẩm đã chọn"); }}>
                Ngừng bán
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setPendingDelete(selected)}>
                <Trash2 className="size-4" /> Xóa
              </Button>
            </div>
          </div>
        )}

        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allChecked}
                        onCheckedChange={(v) => setSelected(v ? filtered.map((p) => p.id) : [])}
                        aria-label="Chọn tất cả"
                      />
                    </TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Màu / Size</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead className="text-right">Tồn kho</TableHead>
                    <TableHead className="text-right">Đã bán</TableHead>
                    <TableHead className="w-[140px]">Đánh giá</TableHead>
                    <TableHead className="w-[140px]">Doanh thu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(p.id)}
                          onCheckedChange={(v) =>
                            setSelected((prev) => (v ? [...prev, p.id] : prev.filter((id) => id !== p.id)))
                          }
                          aria-label={`Chọn ${p.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">SKU {p.sku}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                      <TableCell>
                        <div className="flex max-w-[220px] flex-wrap gap-1">
                          {p.colors.slice(0, 2).map((c) => (
                            <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                          ))}
                          {p.colors.length > 2 && (
                            <Badge variant="outline" className="text-[10px]">+{p.colors.length - 2}</Badge>
                          )}
                          {p.sizes.slice(0, 3).map((s) => (
                            <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{money(p.price)} đ</TableCell>
                      <TableCell className="text-right">
                        <span className={p.stock < 30 ? "font-medium text-destructive" : ""}>{p.stock}</span>
                      </TableCell>
                      <TableCell className="text-right">{p.sold}</TableCell>
                      <TableCell>
                        <StarRating value={p.rating} onChange={(v) => { updateProduct(p.id, { rating: v }); toast.success(`Đã đánh giá ${p.name}: ${v}★`); }} />
                        <p className="mt-1 text-[11px] text-muted-foreground">{p.rating.toFixed(1)} • {p.reviews} nhận xét</p>
                      </TableCell>
                      <TableCell>
                        <Progress value={(p.revenue / maxRevenue) * 100} />
                        <p className="mt-1 text-xs text-muted-foreground">{money(p.revenue)} đ</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.status === "active" ? "default" : p.status === "draft" ? "secondary" : "outline"}>
                          {statusLabel[p.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(p)} aria-label="Sửa">
                            <Pencil className="size-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setPendingDelete([p.id])} aria-label="Xóa">
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={11} className="py-10 text-center text-sm text-muted-foreground">
                        Không tìm thấy sản phẩm phù hợp.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
            <DialogDescription>Thông tin được lưu trên trình duyệt của bạn.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" maxLength={40} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input id="name" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Danh mục</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Product["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="archived">Ngừng bán</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Giá (đ)</Label>
              <Input id="price" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Tồn kho</Label>
              <Input id="stock" type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="colors">Màu sắc (phân cách bằng dấu phẩy)</Label>
              <Input id="colors" maxLength={200} value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="sizes">Size (phân cách bằng dấu phẩy)</Label>
              <Input id="sizes" maxLength={200} value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Đánh giá</Label>
              <StarRating size={20} value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={submit}>{editing ? "Lưu thay đổi" : "Thêm sản phẩm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa sản phẩm?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp xóa {pendingDelete?.length ?? 0} sản phẩm. Có thể khôi phục dữ liệu gốc bằng nút "Khôi phục".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
