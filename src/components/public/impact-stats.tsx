import { Card, CardContent } from "@/components/ui/card";
import type { ImpactStat } from "@/lib/types";

/** 6 stat cards (3×2): big purple number, bold label, gray description. */
export function ImpactStats({ stats }: { stats: ImpactStat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.id} className="h-full">
          <CardContent className="p-6">
            <div className="font-display text-4xl font-bold text-primary">
              {s.value}
            </div>
            <div className="mt-1 font-semibold">{s.label}</div>
            {s.description && (
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
