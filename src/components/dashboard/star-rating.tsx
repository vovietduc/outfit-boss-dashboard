import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = 14,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          aria-label={`Đánh giá ${i} sao`}
          onClick={() => onChange?.(i)}
          className={cn("rounded-sm", onChange && "cursor-pointer hover:scale-110 transition-transform")}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              i <= Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}