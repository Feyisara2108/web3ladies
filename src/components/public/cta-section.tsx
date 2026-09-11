import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";

export function CTASection({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <Section className="pb-24">
      <Container>
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={primary.href}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              {primary.label}
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex h-12 items-center justify-center rounded-full border border-primary-foreground/30 px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
