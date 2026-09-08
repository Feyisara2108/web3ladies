import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SocialProof as SocialProofItem } from "@/lib/types";

/** "Proof of work" win highlights — title + category tag. */
export function SocialProof({ items }: { items: SocialProofItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <Card key={s.id} className="h-full">
          <CardContent className="flex h-full flex-col gap-3 p-6">
            {s.category && <Badge className="w-fit">{s.category}</Badge>}
            <p className="text-sm font-medium leading-relaxed">{s.title}</p>
            {s.description && (
              <p className="text-sm text-muted-foreground">{s.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
