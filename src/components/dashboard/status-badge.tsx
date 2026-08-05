import type { OrderStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

const styles: Record<OrderStatus, string> = {
  "Chờ xác nhận": "bg-warning/15 text-warning-foreground ring-warning/40",
  "Đang giao": "bg-chart-2/15 text-chart-2 ring-chart-2/40",
  "Hoàn tất": "bg-success/15 text-success ring-success/40",
  "Đã huỷ": "bg-destructive/10 text-destructive ring-destructive/30",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}