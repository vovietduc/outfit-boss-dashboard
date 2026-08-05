import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { products, vnd } from "@/data/mock";

export const Route = createFileRoute("/san-pham")({
  head: () => ({
    meta: [
      { title: "Sản phẩm — MAISON Wear Admin" },
      { name: "description", content: "Quản lý danh mục, giá bán và tồn kho các sản phẩm thời trang." },
      { property: "og:title", content: "Sản phẩm — MAISON Wear Admin" },
      { property: "og:description", content: "Quản lý danh mục, giá bán và tồn kho sản phẩm thời trang." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <PageHeader title="Sản phẩm" subtitle={`${products.length} mẫu đang kinh doanh`} />
      <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 md:p-8">
        {products.map((p) => (
          <Card key={p.id} className="shadow-[var(--shadow-card)]">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">{p.ten}</h2>
                  <p className="text-xs text-muted-foreground">
                    {p.id} · {p.danhMuc}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-accent/10 px-2 py-1 text-sm font-semibold text-accent">
                  {vnd(p.gia)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.mau.map((m) => (
                  <span key={m} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                    {m}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tồn kho {p.ton}</span>
                  <span>Đã bán {p.daBan}</span>
                </div>
                <Progress value={Math.min(100, (p.ton / 4) | 0)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}