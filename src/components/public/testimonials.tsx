import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Testimonial } from "@/lib/types";

/**
 * Testimonial cards: large purple quote-mark, category pill, quoted text,
 * divider, then name + role.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <Card key={t.id} className="h-full">
          <CardContent className="flex h-full flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <Quote className="size-7 text-primary" />
              {t.category && <Badge>{t.category}</Badge>}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-foreground">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="border-t border-border pt-4">
              <div className="font-semibold">{t.name}</div>
              {t.role && (
                <div className="text-sm text-muted-foreground">{t.role}</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
