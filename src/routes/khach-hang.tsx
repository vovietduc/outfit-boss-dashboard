import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { customers, vnd } from "@/data/mock";

export const Route = createFileRoute("/khach-hang")({
  head: () => ({
    meta: [
      { title: "Khách hàng — MAISON Wear Admin" },
      { name: "description", content: "Danh sách khách hàng thân thiết, số đơn và tổng chi tiêu." },
      { property: "og:title", content: "Khách hàng — MAISON Wear Admin" },
      { property: "og:description", content: "Danh sách khách hàng thân thiết, số đơn và tổng chi tiêu." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  return (
    <>
      <PageHeader title="Khách hàng" subtitle="Top khách hàng theo chi tiêu" />
      <div className="space-y-3 p-4 md:p-8">
        {customers.map((c) => (
          <Card key={c.email} className="shadow-[var(--shadow-card)]">
            <CardContent className="flex flex-wrap items-center gap-4 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {c.ten.split(" ").slice(-2).map((w) => w[0]).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.ten}</p>
                <p className="truncate text-xs text-muted-foreground">{c.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{vnd(c.chiTieu)}</p>
                <p className="text-xs text-muted-foreground">{c.donHang} đơn hàng</p>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{c.hang}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}