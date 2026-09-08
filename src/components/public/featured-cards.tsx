import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FeaturedItem } from "@/lib/types";

export function FeaturedCards({ items }: { items: FeaturedItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="group h-full overflow-hidden">
          <CardContent className="flex h-full flex-col gap-3 p-6">
            {item.category && <Badge className="w-fit">{item.category}</Badge>}
            <h3 className="font-display text-lg font-semibold leading-tight">
              {item.title}
            </h3>
            {item.description && (
              <p className="flex-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
            {item.cta_url && (
              <Link
                href={item.cta_url}
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                {item.cta_label ?? "Learn More"}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
