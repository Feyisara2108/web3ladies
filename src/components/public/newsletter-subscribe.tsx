"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter, type SubscribeState } from "@/app/actions/subscribe-newsletter";

export function NewsletterSubscribe({
  buttonLabel = "Subscribe",
}: {
  buttonLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState | null>(null);
  const [pending, startTransition] = useTransition();

  if (state?.ok) {
    return <p className="text-center text-sm font-medium text-primary">{state.message}</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => setState(await subscribeNewsletter(email)));
      }}
      className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Subscribing…" : buttonLabel}
      </Button>
      {state && !state.ok && (
        <p className="text-sm text-destructive sm:hidden">{state.message}</p>
      )}
    </form>
  );
}
