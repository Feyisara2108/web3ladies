import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered max-width page container with responsive gutters. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

/** Vertical rhythm wrapper for page sections. */
export function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...props} />
  );
}
