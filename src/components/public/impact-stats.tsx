import type { ImpactStat } from "@/lib/types";

export function ImpactStats({ stats }: { stats: ImpactStat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <div key={s.id} className="text-center">
          <div className="font-display text-3xl font-bold text-primary sm:text-4xl">
            {s.value}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
