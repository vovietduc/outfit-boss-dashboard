import { SidebarTrigger } from "@/components/ui/sidebar";

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-8">
      <SidebarTrigger />
      <div>
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
        <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>
      </div>
    </header>
  );
}